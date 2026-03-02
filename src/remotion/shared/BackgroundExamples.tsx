import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_FAMILY,
  useRadialVignette,
  useTemporalShift,
  useCornerGlow,
  SCENE_PALETTES,
  TEXT_FINISH,
} from "./animations";
import { FilmGrainOverlay } from "./FilmGrainOverlay";

const SECTION_DURATION = 90;

/**
 * BackgroundExamples: Demo composition showcasing all 4 background primitives.
 * 5 sections × 90 frames = 450 frames (15 seconds at 30fps).
 */
export const BackgroundExamples: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      {/* 1. Radial Vignette */}
      <Sequence from={0} durationInFrames={SECTION_DURATION}>
        <RadialVignetteDemo />
      </Sequence>

      {/* 2. Temporal Shift */}
      <Sequence from={SECTION_DURATION} durationInFrames={SECTION_DURATION}>
        <TemporalShiftDemo />
      </Sequence>

      {/* 3. Film Grain */}
      <Sequence from={SECTION_DURATION * 2} durationInFrames={SECTION_DURATION}>
        <FilmGrainDemo />
      </Sequence>

      {/* 4. Corner Glow */}
      <Sequence from={SECTION_DURATION * 3} durationInFrames={SECTION_DURATION}>
        <CornerGlowDemo />
      </Sequence>

      {/* 5. Combined */}
      <Sequence from={SECTION_DURATION * 4} durationInFrames={SECTION_DURATION}>
        <CombinedDemo />
      </Sequence>
    </AbsoluteFill>
  );
};

// =====================================================================
// Section label badge (top-right corner)
// =====================================================================
const SectionLabel: React.FC<{ label: string; number: number }> = ({
  label,
  number,
}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      right: 60,
      display: "flex",
      alignItems: "center",
      gap: 16,
      zIndex: 10,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#6366F1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        fontWeight: 700,
        color: "white",
      }}
    >
      {number}
    </div>
    <span
      style={{
        ...TEXT_FINISH,
        fontSize: 28,
        fontWeight: 600,
        color: "#6B7280",
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  </div>
);

// =====================================================================
// Color swatch: small labeled color chip
// =====================================================================
const Swatch: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: color,
        border: "2px solid rgba(0,0,0,0.08)",
      }}
    />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          ...TEXT_FINISH,
          fontSize: 22,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...TEXT_FINISH,
          fontSize: 18,
          color: "#9CA3AF",
          fontFamily: "monospace",
        }}
      >
        {color}
      </span>
    </div>
  </div>
);

// =====================================================================
// 1. Radial Vignette Demo
// =====================================================================
const RadialVignetteDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = useRadialVignette(frame, fps, { delay: 0 });

  return (
    <AbsoluteFill>
      <div style={bgStyle} />
      <SectionLabel label="useRadialVignette" number={1} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Radial Vignette
        </span>
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 40,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Offset radial gradient — bright center, muted edges
        </span>

        <div style={{ display: "flex", gap: 48, marginTop: 40 }}>
          <Swatch color={SCENE_PALETTES.intro.center} label="Center" />
          <Swatch color={SCENE_PALETTES.intro.mid} label="Mid" />
          <Swatch color={SCENE_PALETTES.intro.outer} label="Outer" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. Temporal Shift Demo
// =====================================================================
const TemporalShiftDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = useTemporalShift(frame, fps, {
    keyframes: [0, 40, 89],
    palettes: [
      SCENE_PALETTES.intro,
      SCENE_PALETTES.integration,
      SCENE_PALETTES.feature,
    ],
  });

  const bgStyle = useRadialVignette(frame, fps, { delay: 0, colors: palette });

  // Determine which scene name to show
  const sceneName =
    frame < 20 ? "intro" : frame < 60 ? "integration" : "feature";

  return (
    <AbsoluteFill>
      <div style={bgStyle} />
      <SectionLabel label="useTemporalShift" number={2} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Temporal Shift
        </span>
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 40,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Palette morphs between scene types
        </span>

        <div
          style={{
            marginTop: 40,
            padding: "20px 48px",
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              ...TEXT_FINISH,
              fontSize: 36,
              fontWeight: 600,
              color: "#374151",
              fontFamily: "monospace",
            }}
          >
            SCENE_PALETTES.{sceneName}
          </span>
        </div>

        <div style={{ display: "flex", gap: 48, marginTop: 20 }}>
          <Swatch color={palette.center} label="Center" />
          <Swatch color={palette.mid} label="Mid" />
          <Swatch color={palette.outer} label="Outer" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. Film Grain Demo
// =====================================================================
const FilmGrainDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = useRadialVignette(frame, fps, { delay: 0 });

  return (
    <AbsoluteFill>
      <SectionLabel label="FilmGrainOverlay" number={3} />

      {/* Left half: without grain */}
      <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)" }}>
        <div style={bgStyle} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "50%",
          }}
        >
          <span
            style={{
              ...TEXT_FINISH,
              fontSize: 48,
              fontWeight: 600,
              color: "#6B7280",
            }}
          >
            Without grain
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Right half: with grain */}
      <AbsoluteFill style={{ clipPath: "inset(0 0 0 50%)" }}>
        <div style={bgStyle} />
        <FilmGrainOverlay intensity={15} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "50%",
          }}
        >
          <span
            style={{
              ...TEXT_FINISH,
              fontSize: 48,
              fontWeight: 600,
              color: "#6B7280",
            }}
          >
            With grain (15%)
          </span>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Center divider */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: "rgba(0,0,0,0.12)",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      />

      {/* Title overlay */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Film Grain Overlay
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. Corner Glow Demo
// =====================================================================
const CornerGlowDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgStyle = useRadialVignette(frame, fps, { delay: 0 });
  const glowStyle = useCornerGlow(frame, fps, {
    delay: 10,
    position: "top-left",
    targetOpacity: 0.15,
  });

  return (
    <AbsoluteFill>
      <div style={bgStyle} />
      <div style={glowStyle} />
      <SectionLabel label="useCornerGlow" number={4} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Corner Glow
        </span>
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 40,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Soft directional light from top-left
        </span>

        {/* Arrow pointing to glow origin */}
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 180,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "3px dashed rgba(99, 102, 241, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                fontSize: 32,
                color: "#6366F1",
              }}
            >
              ↖
            </span>
          </div>
          <span
            style={{
              ...TEXT_FINISH,
              fontSize: 24,
              color: "#9CA3AF",
            }}
          >
            glow origin
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. Combined Demo — all 4 layers stacked
// =====================================================================
const CombinedDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = useTemporalShift(frame, fps, {
    keyframes: [0, 45, 89],
    palettes: [SCENE_PALETTES.intro, SCENE_PALETTES.integration, SCENE_PALETTES.feature],
  });

  const bgStyle = useRadialVignette(frame, fps, { delay: 0, colors: palette });
  const glowStyle = useCornerGlow(frame, fps, { delay: 5, position: "top-left" });

  return (
    <AbsoluteFill>
      {/* Layer 1: Radial vignette with temporal shift */}
      <div style={bgStyle} />

      {/* Layer 2: Film grain */}
      <FilmGrainOverlay intensity={15} />

      {/* Layer 3: Corner glow */}
      <div style={glowStyle} />

      <SectionLabel label="Combined Stack" number={5} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          All Layers Combined
        </span>
        <span
          style={{
            ...TEXT_FINISH,
            fontSize: 40,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Vignette + Temporal Shift + Grain + Corner Glow
        </span>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 32,
          }}
        >
          {["Vignette", "Temporal", "Grain", "Glow"].map((name, i) => (
            <div
              key={name}
              style={{
                padding: "16px 32px",
                borderRadius: 12,
                backgroundColor: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <span
                style={{
                  ...TEXT_FINISH,
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#6366F1",
                }}
              >
                {i + 1}. {name}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
