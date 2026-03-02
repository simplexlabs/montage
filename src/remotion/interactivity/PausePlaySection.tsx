import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { FONT_FAMILY, useWordDragIn } from "../shared/animations";

const INDIGO = "#6366F1";

// Syntax highlighting colors (One Dark)
const PURPLE = "#C678DD";
const GREEN = "#98C379";
const CYAN = "#61AFEF";
const YELLOW = "#E5C07B";
const GRAY = "#ABB2BF";
type Segment = { text: string; color: string };

// flow.py code with pause/resume calls
const CODE_LINES: Segment[][] = [
  // from simplex import Flow, pause
  [
    { text: "from", color: PURPLE },
    { text: " simplex ", color: GRAY },
    { text: "import", color: PURPLE },
    { text: " Flow, pause", color: YELLOW },
  ],
  // (empty line)
  [],
  // flow = Flow("onboarding")
  [
    { text: "flow", color: GRAY },
    { text: " = ", color: GRAY },
    { text: "Flow", color: YELLOW },
    { text: "(", color: GRAY },
    { text: "'onboarding'", color: GREEN },
    { text: ")", color: GRAY },
  ],
  // (empty line)
  [],
  // # Fill in form fields...
  [
    { text: "# Fill in form fields...", color: "#6C7086" },
  ],
  // await page.fill('#email', user.email)
  [
    { text: "await", color: PURPLE },
    { text: " page.", color: GRAY },
    { text: "fill", color: CYAN },
    { text: "(", color: GRAY },
    { text: "'#email'", color: GREEN },
    { text: ", user.email)", color: GRAY },
  ],
  // (empty line)
  [],
  // # Pause and wait for operator
  [
    { text: "# Pause and wait for operator", color: "#6C7086" },
  ],
  // await pause("review_submission")
  [
    { text: "await", color: PURPLE },
    { text: " ", color: GRAY },
    { text: "pause", color: CYAN },
    { text: "(", color: GRAY },
    { text: "'review_submission'", color: GREEN },
    { text: ")", color: GRAY },
  ],
  // (empty line)
  [],
  // # Continues after operator resumes
  [
    { text: "# Continues after operator resumes", color: "#6C7086" },
  ],
  // await page.click('#submit')
  [
    { text: "await", color: PURPLE },
    { text: " page.", color: GRAY },
    { text: "click", color: CYAN },
    { text: "(", color: GRAY },
    { text: "'#submit'", color: GREEN },
    { text: ")", color: GRAY },
  ],
];

// Pre-compute plain text lengths per line
const LINE_LENGTHS = CODE_LINES.map((segs) =>
  segs.reduce((sum, s) => sum + s.text.length, 0),
);

// Cumulative character count at the START of each line
const LINE_STARTS: number[] = [];
let _cum = 0;
for (let i = 0; i < CODE_LINES.length; i++) {
  LINE_STARTS.push(_cum);
  _cum += LINE_LENGTHS[i] + 1;
}
const TOTAL_CHARS = _cum - 1;

// Render a highlighted line, limited to charLimit visible characters
const renderLine = (segments: Segment[], charLimit: number) => {
  const result: React.ReactNode[] = [];
  let counted = 0;
  for (let i = 0; i < segments.length && counted < charLimit; i++) {
    const seg = segments[i];
    const remaining = charLimit - counted;
    const text = seg.text.slice(0, remaining);
    result.push(
      <span key={i} style={{ color: seg.color }}>
        {text}
      </span>,
    );
    counted += seg.text.length;
  }
  return result;
};

// The pause() line is at index 8
const PAUSE_LINE_INDEX = 8;
const PAUSE_LINE_END = LINE_STARTS[PAUSE_LINE_INDEX] + LINE_LENGTHS[PAUSE_LINE_INDEX];

// PlayCircle SVG icon (matching lucide-react PlayCircle)
const PlayCircleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#22C55E",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="10,8 16,12 10,16" fill={color} stroke="none" />
  </svg>
);

// PauseCircle SVG icon
const PauseCircleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#EAB308",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="10" y1="9" x2="10" y2="15" />
    <line x1="14" y1="9" x2="14" y2="15" />
  </svg>
);

export const PausePlaySection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =====================
  // Panel entrances
  // =====================

  // Left code panel slides in from left
  const leftP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
    delay: 0,
  });
  const leftX = interpolate(leftP, [0, 1], [-120, 0]);
  const leftOpacity = interpolate(leftP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Right panel slides in from right
  const rightP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
    delay: 5,
  });
  const rightX = interpolate(rightP, [0, 1], [120, 0]);
  const rightOpacity = interpolate(rightP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // =====================
  // Code typing animation (3 chars/frame, starts at frame 10)
  // =====================
  const CHARS_PER_FRAME = 3;
  const CODE_DELAY = 10;
  const typingFrame = Math.max(0, frame - CODE_DELAY);
  const totalVisibleChars = Math.min(
    TOTAL_CHARS,
    typingFrame * CHARS_PER_FRAME,
  );

  // Blinking cursor
  const cursorBlink = interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Determine which line the cursor is on
  let cursorLineIdx = 0;
  for (let i = 0; i < CODE_LINES.length; i++) {
    if (totalVisibleChars >= LINE_STARTS[i]) cursorLineIdx = i;
  }

  // =====================
  // Pause state — triggers when the pause() line finishes typing
  // =====================
  const pauseLineTyped = totalVisibleChars >= PAUSE_LINE_END;

  // Pause indicator entrance (yellow flash)
  const pauseP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    delay: Math.ceil(PAUSE_LINE_END / CHARS_PER_FRAME) + CODE_DELAY + 2,
  });
  const pauseOpacity = interpolate(pauseP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const pauseScale = interpolate(pauseP, [0, 1], [0.6, 1]);

  // Resume button entrance (delayed after pause indicator)
  const resumeP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    delay: Math.ceil(PAUSE_LINE_END / CHARS_PER_FRAME) + CODE_DELAY + 12,
  });
  const resumeOpacity = interpolate(resumeP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const resumeScale = interpolate(resumeP, [0, 1], [0.6, 1]);

  // Resume "click" animation — happens later
  const RESUME_CLICK_DELAY = Math.ceil(PAUSE_LINE_END / CHARS_PER_FRAME) + CODE_DELAY + 50;
  const resumeClickP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: RESUME_CLICK_DELAY,
  });
  const resumeClickScale = interpolate(
    resumeClickP,
    [0, 0.5, 1],
    [1, 0.95, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // After resume click, show "Flow resumed" confirmation
  const resumedP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: RESUME_CLICK_DELAY + 5,
  });
  const resumedOpacity = interpolate(resumedP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const isResumed = frame >= RESUME_CLICK_DELAY + 5;

  // Code highlight glow on the pause line
  const pauseGlowP = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.ceil(PAUSE_LINE_END / CHARS_PER_FRAME) + CODE_DELAY,
  });
  const pauseGlowOpacity = interpolate(
    pauseGlowP,
    [0, 0.5, 1],
    [0, 0.5, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Heading words
  const HEADING_WORDS = [
    { text: "Allow", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "Simplex", color: INDIGO },
    { text: " ", color: "transparent" },
    { text: "to", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "pause", color: "#EAB308" },
    { text: " ", color: "transparent" },
    { text: "for", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "sensitive", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "operations", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "like", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "approval/login", color: "#111827" },
  ];

  // Heading entrance (reuse left panel spring for sync)
  const headingOpacity = interpolate(leftP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 36,
      }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          height: 70,
          opacity: headingOpacity,
        }}
      >
        {HEADING_WORDS.map((word, i) => {
          const isSpace = word.text === " ";
          if (isSpace) {
            return (
              <span key={i} style={{ display: "inline-block", width: 16 }} />
            );
          }
          const realWordIndex = HEADING_WORDS.filter(
            (w, idx) => idx < i && w.text !== " ",
          ).length;
          const style = useWordDragIn(frame, fps, {
            index: realWordIndex,
            stagger: 2,
            baseDelay: 3,
            origin: "center bottom",
          });
          return (
            <span
              key={i}
              style={{
                ...style,
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: word.text === "Simplex" || word.text === "pause" ? 700 : 500,
                color: word.color,
                letterSpacing: -0.5,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* Panels */}
      <div
        style={{
          display: "flex",
          gap: 40,
          width: 2600,
          height: 1000,
          position: "relative",
        }}
      >
        {/* =================== */}
        {/* LEFT — flow.py code editor */}
        {/* =================== */}
        <div
          style={{
            width: "55%",
            backgroundColor: "#1E1E2E",
            borderRadius: 24,
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
            boxShadow: "0 12px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              height: 60,
              backgroundColor: "#181825",
              display: "flex",
              alignItems: "center",
              paddingLeft: 24,
              paddingRight: 24,
              gap: 12,
              borderBottom: "1px solid #313244",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#FF5F56" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#FFBD2E" }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#27C93F" }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 20,
                color: "#6C7086",
                marginLeft: 14,
              }}
            >
              flow.py
            </span>
          </div>

          {/* Code content */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              fontFamily: "monospace",
              fontSize: 26,
              lineHeight: "44px",
              whiteSpace: "pre",
              position: "relative",
            }}
          >
            {CODE_LINES.map((segments, lineIdx) => {
              const lineStart = LINE_STARTS[lineIdx];
              const lineLen = LINE_LENGTHS[lineIdx];
              const charsOnLine = Math.max(
                0,
                Math.min(lineLen, totalVisibleChars - lineStart),
              );

              if (totalVisibleChars < lineStart) return null;

              const isPauseLine = lineIdx === PAUSE_LINE_INDEX;

              return (
                <div
                  key={lineIdx}
                  style={{
                    height: 44,
                    position: "relative",
                    backgroundColor: isPauseLine && pauseLineTyped
                      ? `rgba(234, 179, 8, ${pauseGlowOpacity * 0.15})`
                      : "transparent",
                    marginLeft: -28,
                    paddingLeft: 28,
                    marginRight: -28,
                    paddingRight: 28,
                    borderLeft: isPauseLine && pauseLineTyped
                      ? `3px solid rgba(234, 179, 8, ${pauseGlowOpacity})`
                      : "3px solid transparent",
                  }}
                >
                  {/* Line number */}
                  <span
                    style={{
                      display: "inline-block",
                      width: 36,
                      color: "#45475A",
                      textAlign: "right",
                      marginRight: 20,
                      userSelect: "none",
                      fontSize: 20,
                    }}
                  >
                    {lineIdx + 1}
                  </span>
                  {/* Code */}
                  {renderLine(segments, charsOnLine)}
                  {/* Cursor */}
                  {lineIdx === cursorLineIdx &&
                    totalVisibleChars < TOTAL_CHARS && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 3,
                          height: 28,
                          backgroundColor: "#CDD6F4",
                          verticalAlign: "text-bottom",
                          marginLeft: 1,
                          opacity: cursorBlink,
                        }}
                      />
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =================== */}
        {/* RIGHT — Operator Control Panel */}
        {/* =================== */}
        <div
          style={{
            width: "45%",
            backgroundColor: "#1E1E2E",
            borderRadius: 24,
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
            boxShadow: "0 12px 60px rgba(0, 0, 0, 0.3)",
            border: "1px solid #313244",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
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
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 700,
                color: "white",
              }}
            >
              S
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#CDD6F4",
                  letterSpacing: -0.3,
                }}
              >
                Operator Dashboard
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: "#6C7086",
                  marginTop: 2,
                }}
              >
                Session Control
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "#313244" }} />

          {/* Session info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                fontWeight: 600,
                color: "#6C7086",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Active Session
            </div>

            {/* Session row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 80,
                borderRadius: 14,
                border: "1px solid #313244",
                paddingLeft: 24,
                paddingRight: 24,
                backgroundColor: "#252536",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: pauseLineTyped && !isResumed ? "#EAB308" : "#10B981",
                    boxShadow: pauseLineTyped && !isResumed
                      ? "0 0 8px rgba(234, 179, 8, 0.5)"
                      : "0 0 6px rgba(16, 185, 129, 0.4)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#CDD6F4",
                  }}
                >
                  onboarding
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  fontWeight: 500,
                  color: pauseLineTyped && !isResumed ? "#EAB308" : "#10B981",
                }}
              >
                {pauseLineTyped && !isResumed ? "Paused" : "Running"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "#313244" }} />

          {/* Pause indicator — appears when pause() line finishes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              opacity: pauseOpacity,
              transform: `scale(${pauseScale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Paused message (yellow, matching curiosity-frontend) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 64,
                borderRadius: 14,
                border: "1px solid rgba(234, 179, 8, 0.3)",
                backgroundColor: "rgba(234, 179, 8, 0.08)",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <PauseCircleIcon size={28} color="#EAB308" />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#EAB308",
                }}
              >
                Flow paused:
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 22,
                  color: "#FBBF24",
                }}
              >
                review_submission
              </span>
            </div>

            {/* Resume button (green, matching curiosity-frontend buttonStyles.success) */}
            <div
              style={{
                opacity: resumeOpacity,
                transform: `scale(${resumeScale * resumeClickScale})`,
                transformOrigin: "center center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 56,
                  borderRadius: 14,
                  border: "1px solid rgba(34, 197, 94, 0.5)",
                  backgroundColor: isResumed
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(34, 197, 94, 0.2)",
                  paddingLeft: 24,
                  paddingRight: 24,
                  cursor: "pointer",
                }}
              >
                <PlayCircleIcon size={24} color="#22C55E" />
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#4ADE80",
                  }}
                >
                  {isResumed ? "Resumed" : "Resume"}
                </span>
              </div>
            </div>

            {/* Resumed confirmation (green checkmark, matching curiosity-frontend) */}
            {isResumed && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: resumedOpacity,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 22,
                    color: "#22C55E",
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 22,
                    color: "#4ADE80",
                  }}
                >
                  Flow resumed: review_submission
                </span>
              </div>
            )}
          </div>

          {/* Footer status */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: pauseLineTyped && !isResumed ? "#EAB308" : "#10B981",
              }}
            />
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                color: "#6C7086",
              }}
            >
              {pauseLineTyped && !isResumed
                ? "Waiting for operator action"
                : "Session active"}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
