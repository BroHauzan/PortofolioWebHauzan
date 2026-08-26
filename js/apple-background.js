/* ============================================================
   apple-background.js — NeatGradient full-page canvas.

   Full-page: canvas lives in .ambient (fixed stage behind nav).
   Resize is viewport-based, not hero-based.
   Scroll yOffset still applies.
   Resolution lowered to 0.6 for performance over large area.
   ============================================================ */

const canvas = document.getElementById("gradient-bg");

if (canvas) {
  if (window.location.protocol === "file:") {
    console.warn(
      "NeatGradient mungkin gagal: file:// block ES module. " +
        "Pakai local server (Live Server / python3 -m http.server)."
    );
  }

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (REDUCED) {
    console.log("NeatGradient skipped: reduced-motion.");
  } else {
    (async () => {
      try {
        const { NeatGradient } = await import("https://esm.sh/@firecms/neat");
        if (typeof NeatGradient === "undefined") throw new Error("NeatGradient tidak tersedia.");

        const config = {
            colors: [
                { color: '#FF5772', enabled: true },
                { color: '#00B7FF', enabled: true },
                { color: '#FFC600', enabled: true },
                { color: '#8B6AE6', enabled: true },
                { color: '#2E0EC7', enabled: true },
                { color: '#FF9A9E', enabled: true },
            ],
            speed: 2.5,
            horizontalPressure: 2,
            verticalPressure: 4,
            waveFrequencyX: 4,
            waveFrequencyY: 4,
            waveAmplitude: 6,
            secondaryWaveEnabled: false,
            secondaryWaveFrequencyX: 3,
            secondaryWaveFrequencyY: 3,
            secondaryWaveAmplitude: 5,
            secondaryWaveSpeed: 0.6,
            secondaryWaveAngle: 1,
            shadows: 1,
            highlights: 5,
            colorBrightness: 1,
            colorSaturation: 7,
            wireframe: false,
            antialias: false,
            colorBlending: 4,
            backgroundColor: '#FFC600',
            backgroundAlpha: 1,
            grainScale: 0,
            grainSparsity: 0,
            grainIntensity: 0,
            grainSpeed: 1,
            resolution: 0.65,
            yOffset: 0,
            yOffsetWaveMultiplier: 4,
            yOffsetColorMultiplier: 6.3,
            yOffsetFlowMultiplier: 4,
            flowDistortionA: 0,
            flowDistortionB: 0,
            flowScale: 1,
            flowEase: 0,
            flowEnabled: false,
            enableProceduralTexture: false,
            transparentTextureVoid: false,
            textureMode: 'bitmap',
            bakeEdgeSoftness: 1,
            textureVoidLikelihood: 0.45,
            textureVoidWidthMin: 200,
            textureVoidWidthMax: 486,
            textureBandDensity: 2.15,
            textureColorBlending: 0.01,
            textureSeed: 333,
            textureEase: 0.5,
            proceduralBackgroundColor: '#000000',
            textureShapeTriangles: 20,
            textureShapeCircles: 15,
            textureShapeBars: 15,
            textureShapeSquiggles: 10,
            domainWarpEnabled: false,
            domainWarpIntensity: 0,
            domainWarpScale: 3,
            vignetteIntensity: 0,
            vignetteRadius: 0.8,
            fresnelEnabled: true,
            fresnelPower: 2,
            fresnelIntensity: 0.6,
            fresnelColor: '#F90707',
            iridescenceEnabled: false,
            iridescenceIntensity: 0.5,
            iridescenceSpeed: 1,
            prismEdgeEnabled: false,
            prismEdgeIntensity: 0.5,
            prismEdgeThinness: 3,
            prismEdgeSpread: 1,
            prismEdgeSpeed: 0.5,
            prismEdgeRipple: 1,
            bloomIntensity: 0,
            bloomThreshold: 0.95,
            chromaticAberration: 1,
            shapeType: 'sphere',
            shapeRotationX: 0,
            shapeRotationY: 0,
            shapeRotationZ: 0,
            shapeAutoRotateSpeedX: 0,
            shapeAutoRotateSpeedY: 0,
            sphereRadius: 15,
            torusRadius: 15,
            torusTube: 5,
            cylinderRadius: 10,
            cylinderHeight: 40,
            planeBend: 0,
            planeTwist: 0,
            silhouetteFade: 0.25,
            cylinderFade: 0.08,
            ribbonFade: 0.05,
            flatShading: false,
            cameraLock: false,
            cameraX: 0,
            cameraY: -12,
            cameraZ: 0,
            cameraRotationX: 0,
            cameraRotationY: 0,
            cameraRotationZ: 0,
            cameraZoom: 4.4,
        };

        let gradient = new NeatGradient({ ref: canvas, ...config });
        window.__appleGradient = gradient;
        console.log("NeatGradient (full-page) initialized.");

        window.addEventListener(
          "scroll",
          () => {
            if (gradient) gradient.yOffset = window.scrollY;
          },
          { passive: true }
        );

        // Viewport resize → recreate so GL viewport matches screen size.
        let lastW = window.innerWidth;
        let lastH = window.innerHeight;
        let t = 0;
        window.addEventListener("resize", () => {
          clearTimeout(t);
          t = setTimeout(() => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (Math.abs(w - lastW) < 4 && Math.abs(h - lastH) < 4) return;
            lastW = w;
            lastH = h;
            try {
              if (gradient && typeof gradient.destroy === "function") gradient.destroy();
              gradient = new NeatGradient({ ref: canvas, ...config });
              window.__appleGradient = gradient;
            } catch (e) {
              console.warn("NeatGradient: gagal recreate saat resize.", e);
            }
          }, 200);
        }, { passive: true });
      } catch (err) {
        console.warn("NeatGradient gagal init; fallback ke paper statis.", err);
      }
    })();
  }
}
