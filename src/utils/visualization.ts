import { GPUCurtains, Mesh, PlaneGeometry, Vec3 } from "gpu-curtains";

const PULSE_POOL_SIZE = 16; // Fixed-size GPU array. Headroom for ~1.5s lifetime × ~3s spawn rate.
const PULSE_LIFETIME_SECONDS = 1.5; // Total visible duration of one pulse.
const PULSE_ATTACK_SECONDS = 0.15; // Rise time; remainder is exponential-feeling decay.
const PULSE_SPAWN_INTERVAL_MIN_SECONDS = 0.05;
const PULSE_SPAWN_INTERVAL_MAX_SECONDS = 0.3;
const PULSE_RADIUS_UV = 0.05;
const PULSE_MAX_INTENSITY = 1.0;
const GRID_CELLS = 80; // Must match `uv * 80.0` in fragment shader.
const PULSE_SPAWN_ROW_MIN = Math.floor(0.34 * GRID_CELLS); // 27
const PULSE_SPAWN_ROW_MAX = Math.floor(0.64 * GRID_CELLS); // 51
const PULSE_SENTINEL_AGE = -1.0; // Inactive-slot marker; shader skips these.
const FRAME_DELTA_CLAMP_SECONDS = 0.1; // Cap dt to absorb tab-backgrounding spikes.

const getRandomSpawnInterval = () =>
  PULSE_SPAWN_INTERVAL_MIN_SECONDS +
  Math.random() *
    (PULSE_SPAWN_INTERVAL_MAX_SECONDS - PULSE_SPAWN_INTERVAL_MIN_SECONDS);

export async function initVisualization(containerSelector: string) {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (!container) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const gpuCurtains = new GPUCurtains({
    container,
    autoResize: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  });

  try {
    await gpuCurtains.setDevice();
  } catch (error) {
    console.warn(
      "WebGPU not supported. Falling back to CSS background.",
      error,
    );
    gpuCurtains.destroy();
    return;
  }

  const geometry = new PlaneGeometry({
    widthSegments: 150,
    heightSegments: 150,
  });

  // Pulse state. Packed as vec4f per slot for clean 16-byte alignment in
  // the uniform buffer (.xy = UV position, .z = age in seconds, .w = reserved).
  // Mutated in place each frame; flagged via `.shouldUpdate` to trigger upload.
  const pulseData = new Float32Array(PULSE_POOL_SIZE * 4);
  for (let i = 0; i < PULSE_POOL_SIZE; i++) {
    pulseData[i * 4 + 2] = PULSE_SENTINEL_AGE; // age slot starts inactive
  }

  let lastFrameTime: number | null = null;
  let timeUntilNextSpawn = getRandomSpawnInterval();

  const vertexShader = /* wgsl */ `
    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) uv: vec2f,
      @location(1) normal: vec3f,
      @location(2) worldPosition: vec3f,
      @location(3) viewDirection: vec3f,
    };

    @vertex fn main(
      attributes: Attributes,
    ) -> VSOutput {
      var vsOutput: VSOutput;
      var displacedPos = attributes.position;
      
      let wave1 = sin(attributes.uv.x * 20.0 + params.time * 1.2) * 0.4;
      let wave2 = cos(attributes.uv.y * 20.0 - params.time * 0.8) * 0.4;
      displacedPos.z += wave1 + wave2;

      vsOutput.position = getOutputPosition(displacedPos);
      vsOutput.uv = attributes.uv;
      vsOutput.normal = getWorldNormal(attributes.normal);
      
      let worldPosition: vec4f = getWorldPosition(displacedPos);
      vsOutput.worldPosition = worldPosition.xyz / worldPosition.w;
      vsOutput.viewDirection = camera.position - vsOutput.worldPosition;
      
      return vsOutput;
    }
  `;

  const fragmentShader = /* wgsl */ `
    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) uv: vec2f,
      @location(1) normal: vec3f,
      @location(2) worldPosition: vec3f,
      @location(3) viewDirection: vec3f,
    };

    @fragment fn main(fsInput: VSOutput) -> @location(0) vec4f {
      let uv = fsInput.uv * 80.0;
      let grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
      let line = min(grid.x, grid.y);
      let lineAlpha = 1.0 - min(line, 1.0);
      let dist = length(fsInput.viewDirection);

      // Camera is at Z=10. Plane is at Z=-5. 
      // Distances range from ~15 (center) to 30+ (edges).
      let fogFactor = smoothstep(14.0, 28.0, dist);

      // Pulse contribution. Each slot is a vec4f (xy = UV position, z = age in seconds). 
      // Sentinel age (< 0) marks inactive slots. Spatial falloff is Gaussian in UV space; 
      // temporal envelope is a fast attack followed by smoothstep decay. 
      // Pulses share gridColor and are multiplied by (1 - fogFactor) so they fade into the haze.
      var pulseGlow: f32 = 0.0;
      let radius = ${PULSE_RADIUS_UV.toFixed(4)};
      let radiusSq = radius * radius;
      
      for (var i: i32 = 0; i < ${PULSE_POOL_SIZE}; i = i + 1) {
        let slot = params.pulses[i];
        let age = slot.z;
        
        if (age < 0.0) {
          continue;
        }
        
        let d = distance(fsInput.uv, slot.xy);
        if (d > radius * 3.0) {
          continue;
        }
        
        let spatial = exp(-(d * d) / radiusSq);
        let attack = smoothstep(0.0, ${PULSE_ATTACK_SECONDS.toFixed(4)}, age);
        let decay = 1.0 - smoothstep(${PULSE_ATTACK_SECONDS.toFixed(4)}, ${PULSE_LIFETIME_SECONDS.toFixed(4)}, age);
        
        pulseGlow = pulseGlow + spatial * attack * decay;
      }
      
      pulseGlow = min(pulseGlow, ${PULSE_MAX_INTENSITY.toFixed(4)});
      pulseGlow = pulseGlow * (1.0 - fogFactor);

      let finalColor = mix(params.gridColor, params.bgColor, fogFactor) + params.gridColor * pulseGlow;
      let finalAlpha = mix(lineAlpha * 0.8, 0.0, fogFactor) + pulseGlow * 0.5;
      
      return vec4f(finalColor, finalAlpha);
    }
  `;

  const mesh = new Mesh(gpuCurtains, {
    label: "Bioluminescent Grid",
    geometry,
    shaders: {
      vertex: { code: vertexShader },
      fragment: { code: fragmentShader },
    },
    uniforms: {
      params: {
        struct: {
          time: { type: "f32", value: 0 },
          gridColor: {
            type: "vec3f",
            value: new Vec3(51 / 255, 177 / 255, 255 / 255),
          },
          bgColor: {
            type: "vec3f",
            value: new Vec3(6 / 255, 9 / 255, 19 / 255),
          },
          pulses: {
            type: "array<vec4f>",
            value: pulseData,
          },
        },
      },
    },
    transparent: true,
  });

  mesh.scale.set(30, 30, 1);
  mesh.rotation.x = -Math.PI / 2.2;
  mesh.position.y = -1.5;
  mesh.position.z = -5.0;

  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0 },
  );
  observer.observe(container);

  // Reset frame-time tracker when the tab returns to foreground so a
  // multi-second `performance.now()` delta doesn't retire every active pulse
  // in a single frame.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      lastFrameTime = null;
    }
  });

  // Find the first inactive slot and seed it with a new pulse at a random
  // grid intersection. Constrains the spawn Y-coordinate to a specific band
  // (PULSE_SPAWN_ROW_MIN to MAX) to ensure pulses appear in the optimal
  // middle-ground of the grid.
  const trySpawnPulse = (): void => {
    let slotIndex = -1;
    for (let i = 0; i < PULSE_POOL_SIZE; i++) {
      if (pulseData[i * 4 + 2] < 0) {
        slotIndex = i;
        break;
      }
    }
    if (slotIndex === -1) return;

    const cellX = Math.floor(Math.random() * GRID_CELLS);
    const cellY =
      Math.floor(
        Math.random() * (PULSE_SPAWN_ROW_MAX - PULSE_SPAWN_ROW_MIN + 1),
      ) + PULSE_SPAWN_ROW_MIN;
    const uvX = (cellX + 0.5) / GRID_CELLS;
    const uvY = (cellY + 0.5) / GRID_CELLS;

    pulseData[slotIndex * 4] = uvX;
    pulseData[slotIndex * 4 + 1] = uvY;
    pulseData[slotIndex * 4 + 2] = 0; // age starts at 0
    pulseData[slotIndex * 4 + 3] = 0; // reserved
  };

  gpuCurtains.onBeforeRender(() => {
    const now = performance.now();
    let dt = 0;

    if (lastFrameTime !== null) {
      dt = Math.min((now - lastFrameTime) / 1000, FRAME_DELTA_CLAMP_SECONDS);
    }
    lastFrameTime = now;

    if (isVisible && dt > 0) {
      // 1. Advance the wave animation (frame-rate independent)
      if (mesh.uniforms.params) {
        const currentTime = mesh.uniforms.params.time.value as number;
        mesh.uniforms.params.time.value = currentTime + dt * 0.3;
      }

      // 2. Process pulse lifecycle
      if (!reduceMotion) {
        let anyChanged = false;

        // Age active pulses; retire those past lifetime by resetting to sentinel
        for (let i = 0; i < PULSE_POOL_SIZE; i++) {
          const ageIdx = i * 4 + 2;
          if (pulseData[ageIdx] >= 0) {
            pulseData[ageIdx] += dt;
            if (pulseData[ageIdx] >= PULSE_LIFETIME_SECONDS) {
              pulseData[ageIdx] = PULSE_SENTINEL_AGE;
            }
            anyChanged = true;
          }
        }

        // Spawn cadence: when timer expires, try to spawn and reroll the gap
        timeUntilNextSpawn -= dt;
        if (timeUntilNextSpawn <= 0) {
          trySpawnPulse();
          timeUntilNextSpawn = getRandomSpawnInterval();
          anyChanged = true;
        }

        // Notify GPU if pulse data changed
        if (anyChanged && mesh.uniforms.params) {
          mesh.uniforms.params.pulses.shouldUpdate = true;
        }
      }
    }
  });
}
