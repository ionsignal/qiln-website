import { GPUCurtains, Mesh, PlaneGeometry, Vec3 } from "gpu-curtains";

type VisualizationCleanup = () => void;

const MAX_PIXEL_RATIO = 1.5;
const GEOMETRY_SEGMENTS = 96;
const GRID_CELLS = 80;
const GRID_LINE_ALPHA = 0.44;
const FRAME_DELTA_CLAMP_SECONDS = 0.1;

const activeVisualizations = new WeakMap<HTMLElement, VisualizationCleanup>();
const noOpCleanup: VisualizationCleanup = () => {};

export async function initVisualization(
  target: string | HTMLElement,
): Promise<VisualizationCleanup> {
  const container =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!container || !("gpu" in navigator)) return noOpCleanup;

  activeVisualizations.get(container)?.();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const gpuCurtains = new GPUCurtains({
    container,
    autoRender: false,
    autoResize: true,
    watchScroll: false,
    lights: false,
    production: import.meta.env.PROD,
    pixelRatio: Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
    renderPass: {
      useDepth: false,
      sampleCount: 1,
    },
  });

  const canvas = gpuCurtains.renderer?.canvas;
  let mesh: Mesh | null = null;
  let intersectionObserver: IntersectionObserver | null = null;
  let animationFrameId: number | null = null;
  let lastFrameTime: number | null = null;
  let isContainerVisible = false;
  let isDisposed = false;
  let isRestoringContext = false;
  let needsStaticFrame = true;

  const stopRenderLoop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    lastFrameTime = null;
  };

  const destroyResources = () => {
    stopRenderLoop();
    intersectionObserver?.disconnect();
    intersectionObserver = null;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    try {
      gpuCurtains.destroy();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn(
          "[Visualization] Failed to destroy GPU resources cleanly.",
          error,
        );
      }
    }
    canvas?.remove();
  };

  const cleanup: VisualizationCleanup = () => {
    if (isDisposed) return;
    isDisposed = true;
    destroyResources();
    if (activeVisualizations.get(container) === cleanup) {
      activeVisualizations.delete(container);
    }
  };

  activeVisualizations.set(container, cleanup);

  const advanceGridTime = (deltaSeconds: number) => {
    if (!mesh?.uniforms.params || deltaSeconds <= 0) return;
    const params = mesh.uniforms.params;
    const currentTime = params.time.value as number;
    params.time.value = currentTime + deltaSeconds * 0.3;
  };

  const shouldRender = () =>
    !isDisposed && isContainerVisible && document.visibilityState === "visible";

  const requestRender = () => {
    if (!shouldRender() || animationFrameId !== null) return;
    if (prefersReducedMotion && !needsStaticFrame) return;
    animationFrameId = requestAnimationFrame(renderFrame);
  };

  function renderFrame(timestamp: number) {
    animationFrameId = null;
    if (!shouldRender()) {
      lastFrameTime = null;
      return;
    }
    const deltaSeconds =
      lastFrameTime === null
        ? 0
        : Math.min(
            (timestamp - lastFrameTime) / 1000,
            FRAME_DELTA_CLAMP_SECONDS,
          );
    lastFrameTime = timestamp;
    if (!prefersReducedMotion) {
      advanceGridTime(deltaSeconds);
    }
    gpuCurtains.render();
    if (prefersReducedMotion) {
      needsStaticFrame = !mesh?.ready;
    }
    requestRender();
  }

  function handleVisibilityChange() {
    lastFrameTime = null;
    if (document.visibilityState === "visible") {
      needsStaticFrame = true;
      requestRender();
    } else {
      stopRenderLoop();
    }
  }

  try {
    await gpuCurtains.setDevice();

    if (
      isDisposed ||
      !gpuCurtains.deviceManager.ready ||
      !gpuCurtains.renderer?.ready
    ) {
      destroyResources();
      return cleanup;
    }

    const geometry = new PlaneGeometry({
      widthSegments: GEOMETRY_SEGMENTS,
      heightSegments: GEOMETRY_SEGMENTS,
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
        var displacedPosition = attributes.position;

        let waveX = sin(attributes.uv.x * 20.0 + params.time * 1.2) * 0.4;
        let waveY = cos(attributes.uv.y * 20.0 - params.time * 0.8) * 0.4;
        displacedPosition.z += waveX + waveY;

        vsOutput.position = getOutputPosition(displacedPosition);
        vsOutput.uv = attributes.uv;
        vsOutput.normal = getWorldNormal(attributes.normal);

        let worldPosition = getWorldPosition(displacedPosition);
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
        let gridUv = fsInput.uv * ${GRID_CELLS.toFixed(1)};
        let gridDistance =
          abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
        let lineDistance = min(gridDistance.x, gridDistance.y);
        let lineAlpha = 1.0 - min(lineDistance, 1.0);
        let viewDistance = length(fsInput.viewDirection);
        let fogFactor = smoothstep(14.0, 28.0, viewDistance);
        let finalColor =
          mix(params.gridColor, params.bgColor, fogFactor);
        let finalAlpha =
          mix(
            lineAlpha * ${GRID_LINE_ALPHA.toFixed(4)},
            0.0,
            fogFactor
          );

        return vec4f(finalColor, finalAlpha);
      }
    `;

    mesh = new Mesh(gpuCurtains, {
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
              value: new Vec3(32 / 255, 104 / 255, 145 / 255),
            },
            bgColor: {
              type: "vec3f",
              value: new Vec3(6 / 255, 9 / 255, 19 / 255),
            },
          },
        },
      },
      frustumCulling: false,
      depth: false,
      depthWriteEnabled: false,
      cullMode: "none",
      transparent: true,
    });

    mesh.scale.set(30, 30, 1);
    mesh.rotation.x = -Math.PI / 2.2;
    mesh.position.y = -1.5;
    mesh.position.z = -5;

    gpuCurtains.renderer.onAfterResize(() => {
      needsStaticFrame = true;
      lastFrameTime = null;
      requestRender();
    });

    gpuCurtains.onContextLost(() => {
      stopRenderLoop();
      if (isDisposed || isRestoringContext) return;
      isRestoringContext = true;
      void gpuCurtains
        .restoreContext()
        .then(() => {
          if (isDisposed) return;
          needsStaticFrame = true;
          lastFrameTime = null;
          requestRender();
        })
        .catch((error: unknown) => {
          if (import.meta.env.DEV) {
            console.warn(
              "[Visualization] WebGPU context restoration failed.",
              error,
            );
          }
          cleanup();
        })
        .finally(() => {
          isRestoringContext = false;
        });
    });

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isContainerVisible = entry?.isIntersecting ?? false;
        lastFrameTime = null;
        if (isContainerVisible) {
          needsStaticFrame = true;
          requestRender();
        } else {
          stopRenderLoop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        "[Visualization] WebGPU initialization failed. Using CSS fallback.",
        error,
      );
    }
    cleanup();
  }
  if (isDisposed) {
    destroyResources();
  }
  return cleanup;
}
