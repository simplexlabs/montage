import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  useTypingAnimation,
  useLetterPopIn,
  useWordDragIn,
  useMaskedRise,
  useGradientFill,
  useWipeReveal,
  useScalePop,
  useGrowingUnderline,
  useFloatingText,
  useCursorPath,
  useCursorClick,
  useTextSelection,
  useMultiCursorSwarm,
  usePanelReveal,
  useDynamicResize,
  usePowerWipeTransition,
  useCameraPanTransition,
  useFocusShiftTransition,
  useStaggeredDissolveExit,
  useMetallicText,
  useBrandGradient,
  useBloom,
  useFloatingShadow,
  useSubpixelSmooth,
  useTracking,
  TEXT_FINISH,
  FONT_FAMILY,
} from "./animations";

const INDIGO = "#6366F1";
const SECTION_DURATION = 90; // 3 seconds each at 30fps
const CURSOR_SIZE = 60;

/**
 * Unified animation reference — all 26 animations in one composition.
 * 26 sections × 90 frames = 2340 frames (78 seconds at 30fps).
 *
 * Sections 1–9:   Text animations
 * Sections 10–13: Cursor animations
 * Sections 14–15: UI transition animations
 * Sections 16–19: Scene transition animations
 * Sections 20–26: Professional text finishing effects
 */
export const AnimationReference: React.FC = () => {
  const sections = [
    // Text animations (1–9)
    { component: TypingAnimationDemo, label: "useTypingAnimation" },
    { component: LetterPopInDemo, label: "useLetterPopIn" },
    { component: WordDragInDemo, label: "useWordDragIn" },
    { component: MaskedRiseDemo, label: "useMaskedRise" },
    { component: GradientFillDemo, label: "useGradientFill" },
    { component: WipeRevealDemo, label: "useWipeReveal" },
    { component: ScalePopDemo, label: "useScalePop" },
    { component: GrowingUnderlineDemo, label: "useGrowingUnderline" },
    { component: FloatingTextDemo, label: "useFloatingText" },
    // Cursor animations (10–13)
    { component: CursorPathDemo, label: "useCursorPath" },
    { component: CursorClickDemo, label: "useCursorClick" },
    { component: TextSelectionDemo, label: "useTextSelection" },
    { component: MultiCursorSwarmDemo, label: "useMultiCursorSwarm" },
    // UI transitions (14–15)
    { component: PanelRevealDemo, label: "usePanelReveal" },
    { component: DynamicResizeDemo, label: "useDynamicResize" },
    // Scene transitions (16–19)
    { component: PowerWipeTransitionDemo, label: "usePowerWipeTransition" },
    { component: CameraPanTransitionDemo, label: "useCameraPanTransition" },
    { component: FocusShiftTransitionDemo, label: "useFocusShiftTransition" },
    { component: StaggeredDissolveExitDemo, label: "useStaggeredDissolveExit" },
    // Professional text finishing (20–26)
    { component: MetallicTextDemo, label: "useMetallicText" },
    { component: BrandGradientDemo, label: "useBrandGradient" },
    { component: BloomDemo, label: "useBloom" },
    { component: InnerBevelDemo, label: "useInnerBevel" },
    { component: FloatingShadowDemo, label: "useFloatingShadow" },
    { component: SubpixelSmoothDemo, label: "useSubpixelSmooth" },
    { component: TrackingDemo, label: "useTracking" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FAFAFA",
        fontFamily: FONT_FAMILY,
      }}
    >
      {sections.map((section, i) => {
        const Component = section.component;
        return (
          <Sequence
            key={section.label}
            from={i * SECTION_DURATION}
            durationInFrames={SECTION_DURATION}
          >
            <Component sectionNumber={i + 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// Shared section label badge (top-right corner)
// =====================================================================

interface DemoProps {
  sectionNumber: number;
}

const SectionLabel: React.FC<{ label: string; number: number; category?: string }> = ({
  label,
  number,
  category,
}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      right: 60,
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: INDIGO,
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#6B7280",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {category && (
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#9CA3AF",
            letterSpacing: 0.5,
          }}
        >
          {category}
        </span>
      )}
    </div>
  </div>
);

// =====================================================================
// 1. Typing Animation
// =====================================================================
const TypingAnimationDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { typedText, cursorOpacity } = useTypingAnimation(frame, fps, {
    text: "npm install simplex --save",
    charFrames: 2,
    delay: 8,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useTypingAnimation" number={sectionNumber} category="Text" />

      <div
        style={{
          backgroundColor: "#1E293B",
          borderRadius: 20,
          padding: "40px 60px",
          minWidth: 800,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontFamily: "SF Mono, Menlo, monospace",
            color: "#E2E8F0",
            fontWeight: 500,
          }}
        >
          $ {typedText}
          <span style={{ opacity: cursorOpacity, color: "#6366F1" }}>|</span>
        </span>
      </div>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Character-by-character typing with blinking cursor
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. Letter Pop In
// =====================================================================
const LetterPopInDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = "Simplex";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useLetterPopIn" number={sectionNumber} category="Text" />

      <div style={{ display: "flex" }}>
        {text.split("").map((letter, i) => {
          const style = useLetterPopIn(frame, fps, { index: i, stagger: 3 });
          return (
            <span
              key={i}
              style={{
                ...style,
                fontSize: 160,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: -2,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Bouncy letter-by-letter scale pop
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. Word Drag In
// =====================================================================
const WordDragInDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Use", color: "#374151" },
    { text: "Simplex", color: INDIGO },
    { text: "for", color: "#374151" },
    { text: "workflows", color: "#374151" },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useWordDragIn" number={sectionNumber} category="Text" />

      <div style={{ display: "flex", gap: 24 }}>
        {words.map((word, i) => {
          const style = useWordDragIn(frame, fps, {
            index: i,
            stagger: 4,
            baseDelay: 8,
          });
          return (
            <span
              key={i}
              style={{
                ...style,
                fontSize: 100,
                fontWeight: 600,
                color: word.color,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Words fade and drag into place
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. Masked Rise
// =====================================================================
const MaskedRiseDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = useMaskedRise(frame, fps, { delay: 5 });
  const line2 = useMaskedRise(frame, fps, { delay: 15 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SectionLabel label="useMaskedRise" number={sectionNumber} category="Text" />

      <div style={line1.containerStyle}>
        <div
          style={{
            ...line1.contentStyle,
            fontSize: 100,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: -1,
          }}
        >
          Use Simplex for workflows
        </div>
      </div>

      <div style={line2.containerStyle}>
        <div
          style={{
            ...line2.contentStyle,
            fontSize: 56,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Headers and main titles rise into view
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. Gradient Fill
// =====================================================================
const GradientFillDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillStyle = useGradientFill(frame, fps, {
    delay: 5,
    color: "#111827",
    baseColor: "#E5E7EB",
  });

  const fillStyleIndigo = useGradientFill(frame, fps, {
    delay: 20,
    color: INDIGO,
    baseColor: "#C7D2FE",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useGradientFill" number={sectionNumber} category="Text" />

      <span
        style={{
          ...fillStyle,
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        Engineered for legacy portals
      </span>

      <span
        style={{
          ...fillStyleIndigo,
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: -0.5,
        }}
      >
        Color sweeps left to right
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. Wipe Reveal
// =====================================================================
const WipeRevealDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeLeft = useWipeReveal(frame, fps, { delay: 5, direction: "left" });
  const wipeRight = useWipeReveal(frame, fps, { delay: 20, direction: "right" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <SectionLabel label="useWipeReveal" number={sectionNumber} category="Text" />

      <div
        style={{
          ...wipeLeft,
          fontSize: 100,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: -1,
        }}
      >
        Use Simplex for workflows
      </div>

      <div
        style={{
          ...wipeRight,
          fontSize: 72,
          fontWeight: 600,
          color: INDIGO,
          letterSpacing: -0.5,
        }}
      >
        Content revealed by clip-path
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. Scale Pop
// =====================================================================
const ScalePopDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const icons = ["S", "W", "F", "C", "R"];
  const colors = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <SectionLabel label="useScalePop" number={sectionNumber} category="Text" />

      <span style={{ fontSize: 56, fontWeight: 600, color: "#374151" }}>
        Icons and small UI elements
      </span>

      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {icons.map((icon, i) => {
          const style = useScalePop(frame, fps, {
            index: i,
            stagger: 6,
            delay: 10,
          });
          return (
            <div
              key={i}
              style={{
                ...style,
                width: 120,
                height: 120,
                borderRadius: 28,
                backgroundColor: colors[i],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 48,
                fontWeight: 700,
                color: "white",
                boxShadow: `0 8px 30px ${colors[i]}40`,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 8. Growing Underline
// =====================================================================
const GrowingUnderlineDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const underlineCenter = useGrowingUnderline(frame, fps, {
    delay: 10,
    height: 4,
    color: INDIGO,
    direction: "center",
  });

  const underlineLeft = useGrowingUnderline(frame, fps, {
    delay: 25,
    height: 4,
    color: "#10B981",
    direction: "left",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 80,
      }}
    >
      <SectionLabel label="useGrowingUnderline" number={sectionNumber} category="Text" />

      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
        <span
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: INDIGO,
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          https://simplex.sh
        </span>
        <div style={{ marginTop: 4 }}>
          <div style={underlineCenter} />
        </div>
        <span style={{ fontSize: 24, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
          center-out
        </span>
      </div>

      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
        <span
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#10B981",
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          Use Simplex for workflows
        </span>
        <div style={{ marginTop: 4 }}>
          <div style={underlineLeft} />
        </div>
        <span style={{ fontSize: 24, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
          left-to-right
        </span>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 9. Floating Text
// =====================================================================
const FloatingTextDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordFloat = useFloatingText(frame, fps, {
    delay: 0,
    amplitude: 20,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
      }}
    >
      <SectionLabel label="useFloatingText" number={sectionNumber} category="Text" />

      <span
        style={{
          ...TEXT_FINISH,
          ...wordFloat,
          fontSize: 180,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: -2,
        }}
      >
        WAVE
      </span>

      <span
        style={{
          ...TEXT_FINISH,
          fontSize: 46,
          fontWeight: 500,
          color: "#6B7280",
        }}
      >
        {"Default loop is 0.7s: 0 -> -20px -> 0"}
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 10. Cursor Path
// =====================================================================
const CursorPathDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursor = useCursorPath(frame, fps, {
    from: { x: 400, y: 900 },
    to: { x: 1600, y: 500 },
    delay: 5,
    arcIntensity: 350,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 25, stiffness: 20, mass: 1.5 },
  });

  return (
    <AbsoluteFill>
      <SectionLabel label="useCursorPath" number={sectionNumber} category="Cursor" />

      <span
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "#374151",
          position: "absolute",
          top: 200,
          width: "100%",
          textAlign: "center",
        }}
      >
        Cursor follows a smooth curved arc
      </span>

      {/* Target marker */}
      <div
        style={{
          position: "absolute",
          left: 1600,
          top: 500,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: INDIGO,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 8px rgba(99, 102, 241, 0.15)",
        }}
      />

      {/* Start marker */}
      <div
        style={{
          position: "absolute",
          left: 400,
          top: 900,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#D1D5DB",
          transform: "translate(-50%, -50%)",
        }}
      />

      <Img
        src={staticFile("cursor.png")}
        style={{
          position: "absolute",
          left: cursor.x,
          top: cursor.y,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          objectFit: "contain",
          opacity: cursor.opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// 11. Cursor Click
// =====================================================================
const CursorClickDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorMove = useCursorPath(frame, fps, {
    from: { x: 1800, y: 400 },
    to: { x: 1536, y: 864 },
    delay: 5,
    arcIntensity: 120,
    cursorSize: CURSOR_SIZE,
  });

  const click = useCursorClick(frame, fps, { delay: 40 });

  const BUTTON_X = 1536;
  const BUTTON_Y = 864;

  return (
    <AbsoluteFill>
      <SectionLabel label="useCursorClick" number={sectionNumber} category="Cursor" />

      <span
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "#374151",
          position: "absolute",
          top: 200,
          width: "100%",
          textAlign: "center",
        }}
      >
        Click with press, release, and ripple
      </span>

      {/* Button target */}
      <div
        style={{
          position: "absolute",
          left: BUTTON_X,
          top: BUTTON_Y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 400,
            height: 80,
            borderRadius: 16,
            backgroundColor: INDIGO,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 600,
            color: "white",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
          }}
        >
          Use Simplex
        </div>
      </div>

      <div style={{ ...click.rippleStyle, left: BUTTON_X, top: BUTTON_Y }} />

      <Img
        src={staticFile("cursor.png")}
        style={{
          position: "absolute",
          left: cursorMove.x,
          top: cursorMove.y,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          objectFit: "contain",
          opacity: cursorMove.opacity,
          transform: `scale(${click.cursorScale})`,
          transformOrigin: "top left",
        }}
      />
    </AbsoluteFill>
  );
};

// =====================================================================
// 12. Text Selection
// =====================================================================
const TextSelectionDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlight1 = useTextSelection(frame, fps, {
    delay: 10,
    color: "rgba(96, 165, 250, 0.3)",
  });

  const highlight2 = useTextSelection(frame, fps, {
    delay: 30,
    color: "rgba(99, 102, 241, 0.25)",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 80,
      }}
    >
      <SectionLabel label="useTextSelection" number={sectionNumber} category="Cursor" />

      <div style={{ position: "relative", display: "inline-block", padding: "8px 12px" }}>
        <div style={highlight1} />
        <span
          style={{
            position: "relative",
            fontSize: 80,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: -1,
          }}
        >
          Use Simplex for workflows
        </span>
      </div>

      <div style={{ position: "relative", display: "inline-block", padding: "8px 12px" }}>
        <div style={highlight2} />
        <span
          style={{
            position: "relative",
            fontSize: 56,
            fontWeight: 500,
            color: "#6B7280",
          }}
        >
          Highlight sweeps across text from left
        </span>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 13. Multi-Cursor Swarm
// =====================================================================
const MultiCursorSwarmDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursors = useMultiCursorSwarm(frame, fps, {
    count: 12,
    target: { x: 1536, y: 864 },
    spread: 1200,
    delay: 5,
  });

  const swarmColors = [
    "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
    "#EF4444", "#14B8A6", "#F97316", "#06B6D4", "#A855F7", "#84CC16",
  ];

  return (
    <AbsoluteFill>
      <SectionLabel label="useMultiCursorSwarm" number={sectionNumber} category="Cursor" />

      <span
        style={{
          position: "absolute",
          top: 200,
          width: "100%",
          textAlign: "center",
          fontSize: 56,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        12 cursors converge on a single target
      </span>

      <div
        style={{
          position: "absolute",
          left: 1536,
          top: 864,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: INDIGO,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 12px rgba(99, 102, 241, 0.12)",
        }}
      />

      {cursors.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            opacity: c.opacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg width={28} height={36} viewBox="0 0 28 36">
            <path
              d="M2 2 L2 32 L12 24 L24 28 Z"
              fill={swarmColors[i % swarmColors.length]}
              stroke="white"
              strokeWidth={2}
            />
          </svg>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// 14. Panel Reveal
// =====================================================================
const PanelRevealDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelBottom = usePanelReveal(frame, fps, {
    delay: 5,
    from: "bottom",
    distance: 200,
  });

  const panelRight = usePanelReveal(frame, fps, {
    delay: 25,
    from: "right",
    distance: 160,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <SectionLabel label="usePanelReveal" number={sectionNumber} category="UI Transition" />

      <span
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "#374151",
          position: "absolute",
          top: 200,
        }}
      >
        Panels slide in with motion blur and shadow
      </span>

      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <div
          style={{
            ...panelBottom,
            width: 600,
            height: 400,
            borderRadius: 24,
            backgroundColor: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: INDIGO,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "white",
            }}
          >
            S
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#111827" }}>Code Editor</span>
          <span style={{ fontSize: 22, color: "#9CA3AF" }}>from: bottom</span>
        </div>

        <div
          style={{
            ...panelRight,
            width: 600,
            height: 400,
            borderRadius: 24,
            backgroundColor: "white",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#10B981",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "white",
            }}
          >
            D
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#111827" }}>Dashboard</span>
          <span style={{ fontSize: 22, color: "#9CA3AF" }}>from: right</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 15. Dynamic Resize
// =====================================================================
const DynamicResizeDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { foregroundStyle, backgroundStyle } = useDynamicResize(frame, fps, {
    delay: 10,
    fromScale: 0.6,
    toScale: 1,
    yOffset: 60,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <SectionLabel label="useDynamicResize" number={sectionNumber} category="UI Transition" />

      <span
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "#374151",
          position: "absolute",
          top: 200,
        }}
      >
        Foreground scales up, background fades
      </span>

      <div
        style={{
          ...backgroundStyle,
          position: "absolute",
          width: 1400,
          height: 700,
          borderRadius: 32,
          backgroundColor: "#F3F4F6",
          border: "1px solid #E5E7EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {["Workflow A", "Workflow B", "Workflow C"].map((label) => (
          <div
            key={label}
            style={{
              width: 300,
              height: 200,
              borderRadius: 20,
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 28,
              fontWeight: 500,
              color: "#6B7280",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          ...foregroundStyle,
          width: 800,
          height: 500,
          borderRadius: 28,
          backgroundColor: "white",
          border: `2px solid ${INDIGO}`,
          boxShadow: "0 24px 64px rgba(99, 102, 241, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: INDIGO,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 40,
            fontWeight: 700,
            color: "white",
          }}
        >
          S
        </div>
        <span style={{ fontSize: 40, fontWeight: 700, color: "#111827" }}>
          Workflow B — Expanded
        </span>
        <span style={{ fontSize: 24, color: "#9CA3AF" }}>
          Element scales up with spring overshoot
        </span>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 16. Power Wipe Transition
// =====================================================================
const PowerWipeTransitionDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { wipeStyle, incomingStyle } = usePowerWipeTransition(frame, fps, {
    delay: 6,
    durationInFrames: 22,
    color: "#EEEFFF",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <SectionLabel
        label="usePowerWipeTransition"
        number={sectionNumber}
        category="Scene Transition"
      />

      {/* Previous scene content (under wipe) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <span style={{ ...TEXT_FINISH, fontSize: 58, fontWeight: 600, color: "#6B7280" }}>
          Previous scene clears
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {["Browser", "SDK", "Agent"].map((item) => (
            <div
              key={item}
              style={{
                width: 340,
                height: 220,
                borderRadius: 26,
                border: "1px solid #E5E7EB",
                backgroundColor: "rgba(255,255,255,0.9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ ...TEXT_FINISH, fontSize: 42, fontWeight: 700, color: "#4B5563" }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New scene text (above wipe) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            ...incomingStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ ...TEXT_FINISH, fontSize: 118, fontWeight: 700, color: "#111827" }}>
            Integration Scene
          </span>
          <span style={{ ...TEXT_FINISH, fontSize: 36, color: "#6B7280", fontWeight: 500 }}>
            Full-screen wipe with exponential in-out timing
          </span>
        </div>
      </div>

      <div style={wipeStyle} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 17. Camera Pan Transition
// =====================================================================
const CameraPanTransitionDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { backgroundStyle, midgroundStyle, foregroundStyle } = useCameraPanTransition(
    frame,
    fps,
    {
      delay: 8,
      direction: "left",
      distance: 1120,
      backgroundParallax: 0.32,
      midgroundParallax: 0.62,
      foregroundParallax: 1,
      blurStrength: 28,
    },
  );

  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      <SectionLabel
        label="useCameraPanTransition"
        number={sectionNumber}
        category="Scene Transition"
      />

      <div
        style={{
          position: "absolute",
          top: 170,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <span style={{ ...TEXT_FINISH, fontSize: 54, fontWeight: 600, color: "#374151" }}>
          Simulated camera pan with parallax depth
        </span>
      </div>

      {/* Background parallax layer */}
      <div
        style={{
          ...backgroundStyle,
          position: "absolute",
          left: -300,
          top: 260,
          display: "flex",
          gap: 160,
          opacity: 0.45,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: i % 2 === 0 ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)",
            }}
          />
        ))}
      </div>

      {/* Midground rails */}
      <div
        style={{
          ...midgroundStyle,
          position: "absolute",
          left: -220,
          top: 520,
          display: "flex",
          gap: 60,
          opacity: 0.6,
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 420,
              height: 20,
              borderRadius: 10,
              backgroundColor: "rgba(148, 163, 184, 0.45)",
            }}
          />
        ))}
      </div>

      {/* Foreground UI layer */}
      <div
        style={{
          ...foregroundStyle,
          position: "absolute",
          left: 360,
          top: 460,
          display: "flex",
          gap: 160,
        }}
      >
        {[
          { title: "Editor", subtitle: "Step 1" },
          { title: "Review Panel", subtitle: "Step 2" },
        ].map((panel) => (
          <div
            key={panel.title}
            style={{
              width: 980,
              height: 640,
              borderRadius: 28,
              backgroundColor: "rgba(255,255,255,0.93)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              boxShadow: "0 30px 80px rgba(15, 23, 42, 0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ ...TEXT_FINISH, fontSize: 72, fontWeight: 700, color: "#111827" }}>
              {panel.title}
            </span>
            <span style={{ ...TEXT_FINISH, fontSize: 34, fontWeight: 500, color: "#6B7280" }}>
              {panel.subtitle}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 18. Focus Shift Transition
// =====================================================================
const FocusShiftTransitionDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { contextStyle, focusStyle } = useFocusShiftTransition(frame, fps, {
    delay: 8,
    zoomScale: 2.45,
    zoomTranslateX: -260,
    zoomTranslateY: -210,
    contextBlur: 18,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <SectionLabel
        label="useFocusShiftTransition"
        number={sectionNumber}
        category="Scene Transition"
      />

      <div
        style={{
          position: "absolute",
          top: 180,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <span style={{ ...TEXT_FINISH, fontSize: 54, fontWeight: 600, color: "#374151" }}>
          Zoom-and-blur focus shift into target detail
        </span>
      </div>

      {/* Context layer that zooms and blurs away */}
      <div
        style={{
          ...contextStyle,
          width: 1900,
          height: 1020,
          borderRadius: 30,
          border: "1px solid #CBD5E1",
          backgroundColor: "rgba(255,255,255,0.92)",
          position: "relative",
          overflow: "visible",
        }}
      >
        <div
          style={{
            height: 90,
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            padding: "0 36px",
            gap: 14,
          }}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: dot === 0 ? "#F87171" : dot === 1 ? "#FBBF24" : "#34D399",
              }}
            />
          ))}
          <div
            style={{
              marginLeft: 18,
              width: 1220,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#E2E8F0",
            }}
          />
        </div>

        <div style={{ padding: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 180,
                borderRadius: 20,
                border: "1px solid #E2E8F0",
                backgroundColor: i === 1 ? "rgba(99, 102, 241, 0.10)" : "white",
              }}
            />
          ))}
        </div>
      </div>

      {/* Sharp focused detail layer */}
      <div
        style={{
          ...focusStyle,
          position: "absolute",
          width: 1080,
          height: 280,
          borderRadius: 26,
          border: `2px solid ${INDIGO}`,
          backgroundColor: "white",
          boxShadow: "0 28px 80px rgba(99, 102, 241, 0.20)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ ...TEXT_FINISH, fontSize: 34, fontWeight: 500, color: "#6B7280" }}>
          Focus target
        </span>
        <span style={{ ...TEXT_FINISH, fontSize: 68, fontWeight: 700, color: "#111827" }}>
          simplex.sh/dashboard
        </span>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 19. Staggered Dissolve Exit
// =====================================================================
const StaggeredDissolveExitDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chips = [
    "Trigger Ready",
    "Queue Synced",
    "Worker Warm",
    "Logs Indexed",
    "Cache Primed",
    "Agent Linked",
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 56,
      }}
    >
      <SectionLabel
        label="useStaggeredDissolveExit"
        number={sectionNumber}
        category="Scene Transition"
      />

      <span style={{ ...TEXT_FINISH, fontSize: 56, fontWeight: 600, color: "#374151" }}>
        Reverse-entry exit with LIFO staggering
      </span>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", width: 1840 }}>
        {chips.map((chip, i) => {
          const dissolve = useStaggeredDissolveExit(frame, fps, {
            index: i,
            total: chips.length,
            delay: 18,
            stagger: 4,
            distance: 70,
            blur: 8,
          });

          return (
            <div key={chip} style={dissolve.containerStyle}>
              <div
                style={{
                  ...dissolve.contentStyle,
                  minWidth: 250,
                  height: 86,
                  borderRadius: 43,
                  padding: "0 34px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  boxShadow: "0 12px 30px rgba(99, 102, 241, 0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ ...TEXT_FINISH, fontSize: 30, fontWeight: 600, color: "#4338CA" }}>
                  {chip}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <span style={{ ...TEXT_FINISH, fontSize: 34, color: "#9CA3AF", fontWeight: 500 }}>
        Last-in elements dissolve first while sliding through a mask
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 20. Metallic Text
// =====================================================================
const MetallicTextDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const metallicStyle = useMetallicText(frame, fps, { delay: 8 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useMetallicText" number={sectionNumber} category="Finishing" />

      <span
        style={{
          ...metallicStyle,
          fontSize: 120,
          fontWeight: 600,
        }}
      >
        Engineered for
      </span>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Metallic silver gradient with shimmer sweep
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 21. Brand Gradient
// =====================================================================
const BrandGradientDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandStyle = useBrandGradient(frame, fps, { delay: 8 });
  const brandStyleWarm = useBrandGradient(frame, fps, {
    delay: 20,
    colors: ["#EC4899", "#F59E0B"],
    angle: 135,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <SectionLabel label="useBrandGradient" number={sectionNumber} category="Finishing" />

      <span
        style={{
          ...brandStyle,
          fontSize: 140,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        Simplex
      </span>

      <span
        style={{
          ...brandStyleWarm,
          fontSize: 80,
          fontWeight: 700,
        }}
      >
        Custom multi-stop gradients
      </span>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Brand gradient with scale-up entrance
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 22. Bloom
// =====================================================================
const BloomDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cranked up for demo visibility
  const bloomStyle = useBloom(frame, fps, {
    delay: 8,
    color: "#5E6BFF",
    blurRadius: 30,
    strength: 0.35,
  });

  const bloomStylePink = useBloom(frame, fps, {
    delay: 20,
    color: "#EC4899",
    blurRadius: 25,
    strength: 0.3,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <SectionLabel label="useBloom" number={sectionNumber} category="Finishing" />

      <span
        style={{
          ...bloomStyle,
          fontSize: 120,
          fontWeight: 800,
          color: "#5E6BFF",
          letterSpacing: -1,
        }}
      >
        control
      </span>

      <span
        style={{
          ...bloomStylePink,
          fontSize: 80,
          fontWeight: 700,
          color: "#EC4899",
        }}
      >
        reliability
      </span>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Soft outer glow via layered text-shadow
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 23. Inner Bevel
// =====================================================================
const InnerBevelDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exaggerated for demo: dramatic multi-layer bevel (top highlight + bottom shadow)
  const progress = spring({ frame, fps, config: { damping: 200, stiffness: 80 }, delay: 8 });
  const alpha = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bevelStyle: React.CSSProperties = {
    textShadow: [
      `0 -1px 1px rgba(255, 255, 255, ${alpha * 0.5})`,
      `0 -2px 3px rgba(255, 255, 255, ${alpha * 0.2})`,
      `0 1px 1px rgba(0, 0, 0, ${alpha * 0.12})`,
      `0 2px 4px rgba(0, 0, 0, ${alpha * 0.05})`,
    ].join(", "),
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
        backgroundColor: "#8B95A5",
      }}
    >
      <SectionLabel label="useInnerBevel" number={sectionNumber} category="Finishing" />

      {/* Without bevel */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 2 }}>
          Without bevel
        </span>
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#2D3748",
            letterSpacing: -1,
          }}
        >
          reliability
        </span>
      </div>

      {/* With bevel */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 2 }}>
          With bevel
        </span>
        <span
          style={{
            ...bevelStyle,
            fontSize: 120,
            fontWeight: 800,
            color: "#2D3748",
            letterSpacing: -1,
          }}
        >
          reliability
        </span>
      </div>

      <span style={{ fontSize: 36, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
        Top-edge highlight + bottom shadow for embossed depth
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 24. Floating Shadow
// =====================================================================
const FloatingShadowDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cranked up for demo visibility (production would use 0.06 strength)
  const shadowStyle = useFloatingShadow(frame, fps, {
    delay: 8,
    strength: 0.25,
    offsetY: 20,
    blur: 40,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <SectionLabel label="useFloatingShadow" number={sectionNumber} category="Finishing" />

      <span
        style={{
          ...shadowStyle,
          fontSize: 120,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: -1,
        }}
      >
        floating text
      </span>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Soft distant shadow — text appears to float above background
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 25. Subpixel Smooth
// =====================================================================
const SubpixelSmoothDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Using a higher amount (1.5px) for demo visibility
  // Production would use 0.3–0.5px
  const smoothStyle = useSubpixelSmooth(frame, fps, {
    delay: 30,
    amount: 0.94,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <SectionLabel label="useSubpixelSmooth" number={sectionNumber} category="Finishing" />

      {/* Before (sharp) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2 }}>
          Before (sharp)
        </span>
        <span
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -1,
          }}
        >
          Simplex Control
        </span>
      </div>

      {/* After (smoothed) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2 }}>
          After (smoothed)
        </span>
        <span
          style={{
            ...smoothStyle,
            fontSize: 100,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -1,
          }}
        >
          Simplex Control
        </span>
      </div>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Subtle Gaussian blur removes digital sharpness
      </span>
    </AbsoluteFill>
  );
};

// =====================================================================
// 26. Tracking
// =====================================================================
const TrackingDemo: React.FC<DemoProps> = ({ sectionNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trackingStyle = useTracking(frame, fps, {
    delay: 8,
    from: -0.04,
    to: 0.08,
  });

  const trackingStyleSubtle = useTracking(frame, fps, {
    delay: 20,
    from: 0,
    to: 0.04,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <SectionLabel label="useTracking" number={sectionNumber} category="Finishing" />

      <span
        style={{
          ...trackingStyle,
          fontSize: 120,
          fontWeight: 800,
          color: "#111827",
          textTransform: "uppercase",
        }}
      >
        SIMPLEX
      </span>

      <span
        style={{
          ...trackingStyleSubtle,
          fontSize: 56,
          fontWeight: 500,
          color: "#6B7280",
        }}
      >
        Letter spacing expands with spring
      </span>

      <span style={{ fontSize: 36, color: "#9CA3AF", fontWeight: 500 }}>
        Animated tracking from tight to airy
      </span>
    </AbsoluteFill>
  );
};
