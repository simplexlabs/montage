import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  useGradientFill,
  useMaskedRise,
  usePanelReveal,
  useScalePop,
  useTextSelection,
  useTypingAnimation,
  useWipeReveal,
  useWordDragIn,
} from "../shared/animations";

const INDIGO = "#6366F1";
const CODE_DELAY = 12;
const CHAR_FRAMES = 0.5;

const SCRIPT_LINES = [
  "await page.goto('github.com/login')",
  "",
  "await page.fill('#login', vault.get('username'))",
  "",
  "await page.fill('#password', vault.get('password'))",
  "",
  "await page.click('[type=\"submit\"]')",
];
const SCRIPT_TEXT = SCRIPT_LINES.join("\n");
const USER_TOKEN = "vault.get('username')";
const PASS_TOKEN = "vault.get('password')";
const CLICK_TOKEN = "page.click";

const USER_START = SCRIPT_TEXT.indexOf(USER_TOKEN);
const PASS_START = SCRIPT_TEXT.indexOf(PASS_TOKEN);
const CLICK_START = SCRIPT_TEXT.indexOf(CLICK_TOKEN);

const valueProgress = (chars: number, start: number, span: number) => {
  if (chars <= start) return 0;
  if (chars >= start + span) return 1;
  return (chars - start) / span;
};

const FieldRow: React.FC<{
  label: string;
  value: string;
  isPassword?: boolean;
  highlightStyle: React.CSSProperties;
  checkStyle: React.CSSProperties;
}> = ({ label, value, isPassword, highlightStyle, checkStyle }) => {
  const shown = isPassword ? "\u2022".repeat(value.length) : value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        style={{
          ...TEXT_FINISH,
          fontFamily: FONT_FAMILY,
          fontSize: 24,
          fontWeight: 500,
          color: "#3C456C",
          lineHeight: 1,
        }}
      >
        {label}
      </span>

      <div style={{ position: "relative", height: 82 }}>
        <div style={{ ...highlightStyle, borderRadius: 14 }} />
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: 14,
            border: "1px solid rgba(107, 121, 194, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
          }}
        >
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 400,
              color: shown ? "#151C35" : "#98A1C2",
              letterSpacing: isPassword && shown ? 4 : 0,
              lineHeight: 1,
            }}
          >
            {shown || (isPassword ? "Password" : "Username")}
          </span>

          <span
            style={{
              ...checkStyle,
              fontSize: 24,
              color: "#2EB87A",
              lineHeight: 1,
            }}
          >
            ✓
          </span>
        </div>
      </div>
    </div>
  );
};

export const AgentBlind: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeTyping = useTypingAnimation(frame, fps, {
    text: SCRIPT_TEXT,
    charFrames: CHAR_FRAMES,
    delay: CODE_DELAY,
  });
  const visibleLines = codeTyping.typedText.split("\n");
  const typedChars = codeTyping.typedText.length;

  const usernameProgress = valueProgress(typedChars, USER_START, 18);
  const passwordProgress = valueProgress(typedChars, PASS_START, 18);
  const clickProgress = valueProgress(typedChars, CLICK_START, 14);

  const usernameValue = "marco@simplex.sh".slice(
    0,
    Math.floor(usernameProgress * "marco@simplex.sh".length),
  );
  const passwordValue = "Password123".slice(
    0,
    Math.floor(passwordProgress * "Password123".length),
  );

  const usernameEventFrame = CODE_DELAY + Math.ceil((USER_START + 18) * CHAR_FRAMES);
  const passwordEventFrame = CODE_DELAY + Math.ceil((PASS_START + 18) * CHAR_FRAMES);
  const clickEventFrame = CODE_DELAY + Math.ceil((CLICK_START + 14) * CHAR_FRAMES);

  const leftPanel = usePanelReveal(frame, fps, {
    delay: 0,
    from: "left",
    distance: 160,
  });
  const rightPanel = usePanelReveal(frame, fps, {
    delay: 6,
    from: "right",
    distance: 160,
  });

  const userHighlight = useTextSelection(frame, fps, {
    delay: usernameEventFrame - 8,
    color: "rgba(99, 102, 241, 0.16)",
  });
  const passHighlight = useTextSelection(frame, fps, {
    delay: passwordEventFrame - 8,
    color: "rgba(99, 102, 241, 0.16)",
  });
  const userCheck = useScalePop(frame, fps, {
    delay: usernameEventFrame + 4,
    springConfig: { damping: 14, stiffness: 190 },
  });
  const passCheck = useScalePop(frame, fps, {
    delay: passwordEventFrame + 4,
    springConfig: { damping: 14, stiffness: 190 },
  });
  const buttonPop = useScalePop(frame, fps, {
    delay: clickEventFrame + 2,
    springConfig: { damping: 14, stiffness: 210 },
  });

  const calloutRise = useMaskedRise(frame, fps, {
    delay: 114,
    yOffset: 34,
  });
  const calloutWipe = useWipeReveal(frame, fps, {
    delay: 116,
    direction: "left",
  });
  const calloutFill = useGradientFill(frame, fps, {
    delay: 120,
    color: INDIGO,
    baseColor: "#AEB8FF",
  });

  const fadeOut = spring({
    frame,
    fps,
    delay: 160,
    config: { damping: 200 },
  });
  const sectionOpacity = interpolate(fadeOut, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sectionScale = interpolate(fadeOut, [0, 1], [1, 0.97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sectionOpacity,
        transform: `scale(${sectionScale})`,
      }}
    >
      <div
        style={{
          width: 2580,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <div style={{ display: "flex", gap: 34, height: 980 }}>
          <div
            style={{
              ...leftPanel,
              width: 1420,
              borderRadius: 26,
              border: "1px solid rgba(106, 121, 196, 0.2)",
              backgroundColor: "rgba(20, 26, 46, 0.9)",
              padding: "28px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 500,
                color: "#95A3DD",
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              What the agent sees
            </span>

            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(111, 124, 192, 0.2)",
                backgroundColor: "rgba(10, 14, 29, 0.65)",
                padding: "20px 18px",
                height: 860,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 28,
                lineHeight: "48px",
                color: "#D9E0FF",
              }}
            >
              {SCRIPT_LINES.map((_, index) => {
                const line = visibleLines[index] ?? "";
                const isLastLine =
                  !codeTyping.doneTyping && index === visibleLines.length - 1;
                return (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        width: 44,
                        color: "#5A648D",
                        textAlign: "right",
                        marginRight: 16,
                        fontSize: 22,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span>{line}</span>
                    {isLastLine ? (
                      <span
                        style={{
                          width: 3,
                          height: 30,
                          backgroundColor: "#BFCBFF",
                          marginLeft: 2,
                          opacity: codeTyping.cursorOpacity,
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              ...rightPanel,
              width: 1126,
              borderRadius: 26,
              border: "1px solid rgba(89, 104, 169, 0.16)",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              padding: "34px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 500,
                color: "#6670A1",
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              What the browser executes
            </span>

            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 52,
                fontWeight: 600,
                color: "#1D2546",
                lineHeight: 1,
              }}
            >
              Sign in to GitHub
            </span>

            <FieldRow
              label="Username or email"
              value={usernameValue}
              highlightStyle={userHighlight}
              checkStyle={userCheck}
            />

            <FieldRow
              label="Password"
              value={passwordValue}
              isPassword
              highlightStyle={passHighlight}
              checkStyle={passCheck}
            />

            <button
              style={{
                ...buttonPop,
                marginTop: 8,
                height: 86,
                borderRadius: 14,
                border: "none",
                backgroundColor: clickProgress >= 1 ? "#22A25F" : "#6FAF88",
                color: "white",
                fontFamily: FONT_FAMILY,
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: -0.2,
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </div>
        </div>

        <div
          style={{
            ...calloutRise.containerStyle,
            ...calloutWipe,
            alignSelf: "center",
          }}
        >
          <div
            style={{
              ...calloutRise.contentStyle,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: FONT_FAMILY,
              fontSize: 58,
              lineHeight: 1,
            }}
          >
            {["The", "agent", "never", "sees", "your", "credentials"].map(
              (word, index) => {
                const motion = useWordDragIn(frame, fps, {
                  index,
                  stagger: 4,
                  baseDelay: 118,
                });
                return (
                  <span
                    key={word}
                    style={{
                      ...motion,
                      ...TEXT_FINISH,
                      ...(word === "never" ? calloutFill : {}),
                      fontWeight: word === "never" ? 700 : 500,
                      color: word === "never" ? undefined : "#20284A",
                    }}
                  >
                    {word}
                  </span>
                );
              },
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
