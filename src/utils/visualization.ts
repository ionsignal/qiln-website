// themes/minimal/src/utils/visualization.ts
import { GPUCurtains, Mesh, PlaneGeometry, Vec3 } from "gpu-curtains";

const PULSE_POOL_SIZE = 16; // Fixed-size GPU array. Headroom for ~1.5s lifetime × ~3s spawn rate.
const PULSE_LIFETIME_SECONDS = 1.5; // Total visible duration of one pulse.
const PULSE_ATTACK_SECONDS = 0.15; // Rise time; remainder is exponential-feeling decay.
// APPLIED FIX: Swapped MIN and MAX to correct mathematical logic
const PULSE_SPAWN_INTERVAL_MIN_SECONDS = 0.05;
const PULSE_SPAWN_INTERVAL_MAX_SECONDS = 0.3;
const PULSE_RADIUS_UV = 0.05; //
const PULSE_MAX_INTENSITY = 1.0; //
const GRID_CELLS = 80; // Must match `uv * 80.0` in fragment shader.
const PULSE_MIN_SEPARATION_UV = 0.1; // Reject spawns clustered near existing pulses.
const PULSE_SPAWN_UV_Y_MAX = 0.64; // After -PI/2.2 X-rotation, uv.y near 1 is deep in fog.
const PULSE_SPAWN_UV_Y_MIN = 0.34; // Avoid the near-camera edge (under the CSS top mask).
const PULSE_SENTINEL_AGE = -1.0; // Inactive-slot marker; shader skips these.
const FRAME_DELTA_CLAMP_SECONDS = 0.1; // Cap dt to absorb tab-backgrounding spikes.

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
  // ADDED: Pulse state. Packed as vec4f per slot for clean 16-byte alignment in
  // the uniform buffer (.xy = UV position, .z = age in seconds, .w = reserved).
  // Mutated in place each frame; reassigned to .value to trigger upload.
  const pulseData = new Float32Array(PULSE_POOL_SIZE * 4);
  for (let i = 0; i < PULSE_POOL_SIZE; i++) {
    pulseData[i * 4 + 2] = PULSE_SENTINEL_AGE; // age slot starts inactive
  }
  // ADDED: JS-side timing state (separate from the `time` uniform, which is a
  // frame-count proxy used only by the wave animation).
  let lastFrameTime: number | null = null;
  let timeUntilNextSpawn =
    PULSE_SPAWN_INTERVAL_MIN_SECONDS +
    Math.random() *
      (PULSE_SPAWN_INTERVAL_MAX_SECONDS - PULSE_SPAWN_INTERVAL_MIN_SECONDS);

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
      
      // INCREASED AMPLITUDE: from 0.05 to 0.4 so it's visible from far away
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
      // Scale UVs up because the plane is much larger now
      let uv = fsInput.uv * 80.0;
      let grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
      let line = min(grid.x, grid.y);
      let lineAlpha = 1.0 - min(line, 1.0);
      let dist = length(fsInput.viewDirection);

      // FIXED FOG: Camera is at Z=10. Plane is at Z=-5. 
      // Distances range from ~15 (center) to 30+ (edges).
      let fogFactor = smoothstep(14.0, 28.0, dist);

      // ADDED: Pulse contribution. Each slot is a vec4f (xy = UV position,
      // z = age in seconds, w = reserved). Sentinel age (< 0) marks inactive
      // slots. Spatial falloff is Gaussian in UV space; temporal envelope is
      // a fast attack followed by smoothstep decay. Pulses share gridColor to
      // stay on-brand and are multiplied by (1 - fogFactor) so far-back pulses
      // never pop through the haze.
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

      // APPLIED FIX: Changed from 'let' to 'var' to allow overriding for debug
      var finalColor = mix(params.gridColor, params.bgColor, fogFactor) + params.gridColor * pulseGlow;
      var finalAlpha = mix(lineAlpha * 0.8, 0.0, fogFactor) + pulseGlow * 0.5;

      // APPLIED FIX: Visual debug overlay for the spawn zone rejection logic
      if (fsInput.uv.y < ${PULSE_SPAWN_UV_Y_MIN.toFixed(4)} || fsInput.uv.y > ${PULSE_SPAWN_UV_Y_MAX.toFixed(4)}) {
        finalColor = vec3f(1.0, 0.0, 0.0); // Pure red
        finalAlpha = max(finalAlpha, 0.5); // Ensure it's clearly visible
      }

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

  // APPLIED FIX: Extract listener so it can be removed during cleanup
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      lastFrameTime = null;
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // ADDED: Find first inactive slot and seed it with a new pulse at a random
  // grid intersection. Rejects candidates too deep in the fog, too close to
  // the near edge (under the CSS top mask), or clustered near another active
  // pulse. A rejected candidate simply means no pulse spawns this tick — the
  // spawn timer will roll again on the next interval.
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
    const cellY = Math.floor(Math.random() * GRID_CELLS);
    const uvX = (cellX + 0.5) / GRID_CELLS;
    const uvY = (cellY + 0.5) / GRID_CELLS;

    // // Spawn-zone exclusion: keep pulses in the readable mid-band of the plane.
    // if (uvY < PULSE_SPAWN_UV_Y_MIN || uvY > PULSE_SPAWN_UV_Y_MAX) return;

    // // Cluster rejection: require minimum UV separation from active pulses.
    // for (let i = 0; i < PULSE_POOL_SIZE; i++) {
    //   if (pulseData[i * 4 + 2] < 0) continue;
    //   const dx = pulseData[i * 4] - uvX;
    //   const dy = pulseData[i * 4 + 1] - uvY;
    //   if (Math.sqrt(dx * dx + dy * dy) < PULSE_MIN_SEPARATION_UV) return;
    // }

    pulseData[slotIndex * 4] = uvX;
    pulseData[slotIndex * 4 + 1] = uvY;
    pulseData[slotIndex * 4 + 2] = 0; // age starts at 0
    pulseData[slotIndex * 4 + 3] = 0; // reserved
  };

  gpuCurtains.onBeforeRender(() => {
    // MODIFIED: Per-frame callback now also drives the pulse subsystem. Pulse
    // work is gated on `isVisible && !reduceMotion`; the wave's `time`
    // advancement runs whenever visible (matching prior behavior).
    const now = performance.now();
    let dt = 0;
    if (lastFrameTime !== null) {
      dt = Math.min((now - lastFrameTime) / 1000, FRAME_DELTA_CLAMP_SECONDS);
    }
    lastFrameTime = now;

    if (isVisible && !reduceMotion && dt > 0) {
      // Age active pulses; retire those past lifetime by resetting to sentinel.
      let anyChanged = false;
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

      // Spawn cadence: when timer expires, try to spawn and reroll the gap.
      timeUntilNextSpawn -= dt;
      if (timeUntilNextSpawn <= 0) {
        trySpawnPulse();
        timeUntilNextSpawn =
          PULSE_SPAWN_INTERVAL_MIN_SECONDS +
          Math.random() *
            (PULSE_SPAWN_INTERVAL_MAX_SECONDS -
              PULSE_SPAWN_INTERVAL_MIN_SECONDS);
        anyChanged = true;
      }

      if (anyChanged && mesh.uniforms.params) {
        // APPLIED FIX: Idiomatic gpu-curtains reactivity
        mesh.uniforms.params.pulses.shouldUpdate = true;
      }
    }

    if (isVisible && mesh.uniforms.params) {
      // APPLIED FIX: Frame-rate independent wave animation
      // (0.3 scaler roughly matches the old 0.005 per frame at 60fps)
      mesh.uniforms.params.time.value =
        (mesh.uniforms.params.time.value as number) + dt * 0.3;
    }
  });

  // APPLIED FIX: Return a cleanup function for Astro View Transitions
  return {
    destroy: () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      gpuCurtains.destroy();
    },
  };
}
