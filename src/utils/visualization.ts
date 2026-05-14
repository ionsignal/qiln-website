import { GPUCurtains, Mesh, PlaneGeometry, Vec3 } from "gpu-curtains";

export async function initVisualization(containerSelector: string) {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (!container) return;

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
      
      let finalColor = mix(params.gridColor, params.bgColor, fogFactor);
      let finalAlpha = mix(lineAlpha * 0.8, 0.0, fogFactor); 
      
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
  gpuCurtains.onBeforeRender(() => {
    if (isVisible && mesh.uniforms.params) {
      // This correctly triggers gpu-curtains' internal setter to update the GPU buffer
      mesh.uniforms.params.time.value =
        (mesh.uniforms.params.time.value as number) + 0.005;
    }
  });
}
