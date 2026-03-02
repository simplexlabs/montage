import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Film Grain Overlay: SVG noise texture via feTurbulence.
 *
 * Renders an invisible SVG filter and applies it to a full-screen overlay.
 * The overlay composites with the background via CSS mix-blend-mode.
 *
 * - **intensity**: opacity 0–100 (default 15 → 15% opacity, ~1.5% perceived)
 * - **animated**: when true, changes the turbulence seed each frame for
 *   animated "living" grain. Default is static (single seed).
 * - **baseFrequency**: turbulence granularity (default 0.65)
 * - **blendMode**: CSS mix-blend-mode (default "overlay")
 *
 * Usage:
 * ```tsx
 * <AbsoluteFill>
 *   <Background />
 *   <FilmGrainOverlay intensity={15} />
 * </AbsoluteFill>
 * ```
 */
export const FilmGrainOverlay: React.FC<{
  intensity?: number;
  animated?: boolean;
  baseFrequency?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
}> = ({
  intensity = 15,
  animated = false,
  baseFrequency = 0.65,
  blendMode = "overlay",
}) => {
  const frame = useCurrentFrame();
  const seed = animated ? frame : 1;
  const filterId = `grain-${seed}`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Hidden SVG filter definition */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves={4}
              seed={seed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* Full-screen noise rect */}
      <AbsoluteFill
        style={{
          opacity: intensity / 100,
          mixBlendMode: blendMode,
        }}
      >
        <svg width="100%" height="100%">
          <rect
            width="100%"
            height="100%"
            filter={`url(#${filterId})`}
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
