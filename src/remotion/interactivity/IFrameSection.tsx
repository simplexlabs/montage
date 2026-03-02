import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY, useTypingAnimation, useWordDragIn } from "../shared/animations";

const INDIGO = "#6366F1";
const IFRAME_GREEN = "#4ADE80"; // green-400, matches indigo's vibrancy
const LOGO_SIZE = 200;

// Login form content
const EMAIL_VALUE = "marco@simplex.sh";
const PASSWORD_VALUE = "Password123";
const EMAIL_TYPING_DELAY = 40;
const PASSWORD_TYPING_DELAY = 100;

const LogoIcon: React.FC = () => (
  <div
    style={{
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      backgroundColor: INDIGO,
      WebkitMaskImage: `url(${staticFile("simplex-black.png")})`,
      maskImage: `url(${staticFile("simplex-black.png")})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    }}
  />
);

const InputField: React.FC<{
  label: string;
  value: string;
  isFocused: boolean;
  cursorOpacity: number;
  isPassword?: boolean;
}> = ({ label, value, isFocused, cursorOpacity, isPassword }) => {
  const displayValue = isPassword ? "\u2022".repeat(value.length) : value;
  const showCursor = isFocused && value.length >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 26,
          fontWeight: 500,
          color: "#374151",
          letterSpacing: -0.2,
        }}
      >
        {label}
      </label>
      <div
        style={{
          height: 80,
          borderRadius: 14,
          border: `2px solid ${isFocused ? INDIGO : "#D1D5DB"}`,
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 24,
          boxShadow: isFocused
            ? `0 0 0 4px rgba(99, 102, 241, 0.15)`
            : "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 30,
            color: value ? "#111827" : "#9CA3AF",
            letterSpacing: isPassword && value ? 4 : 0,
            whiteSpace: "nowrap",
          }}
        >
          {displayValue || (isPassword ? "Password" : "you@example.com")}
        </span>
        {showCursor && (
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 36,
              backgroundColor: INDIGO,
              marginLeft: 3,
              opacity: cursorOpacity,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const IFrameSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser chrome entrance
  const browserP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: 0,
  });
  const browserScale = interpolate(browserP, [0, 1], [0.9, 1]);
  const browserOpacity = interpolate(browserP, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // iframe label entrance (pops in after browser)
  const iframeLabelP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    delay: 15,
  });
  const iframeLabelScale = interpolate(iframeLabelP, [0, 1], [0.6, 1]);
  const iframeLabelOpacity = interpolate(iframeLabelP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Form card entrance (inside the iframe)
  const formP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: 25,
  });
  const formOpacity = interpolate(formP, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const formScale = interpolate(formP, [0, 1], [0.95, 1]);

  // Email typing
  const {
    typedText: emailText,
    cursorOpacity: emailCursor,
  } = useTypingAnimation(frame, fps, {
    text: EMAIL_VALUE,
    charFrames: 2,
    delay: EMAIL_TYPING_DELAY,
  });

  // Password typing
  const {
    typedText: passwordText,
    doneTyping: passwordDone,
    cursorOpacity: passwordCursor,
  } = useTypingAnimation(frame, fps, {
    text: PASSWORD_VALUE,
    charFrames: 2,
    delay: PASSWORD_TYPING_DELAY,
  });

  // Focus states
  const emailFocused = frame >= EMAIL_TYPING_DELAY && !passwordDone && frame < PASSWORD_TYPING_DELAY;
  const passwordFocused = frame >= PASSWORD_TYPING_DELAY;

  // Button pulse after both fields typed
  const buttonPulseP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200 },
    delay: PASSWORD_TYPING_DELAY + PASSWORD_VALUE.length * 2 + 8,
  });
  const buttonScale = interpolate(
    buttonPulseP,
    [0, 0.5, 1],
    [1, 1.03, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Heading text entrance
  const HEADING_WORDS = [
    { text: "Embed", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "Simplex", color: INDIGO },
    { text: " ", color: "transparent" },
    { text: "into", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "your", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "existing", color: "#111827" },
    { text: " ", color: "transparent" },
    { text: "application", color: "#111827" },
  ];

  // Marching ants: animate dash offset using frame count
  // 20px dash, 12px gap — offset moves 1.5px per frame for steady march
  const dashOffset = frame * 3;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Heading: "Embed Simplex into your existing application" */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          height: 80,
          opacity: browserOpacity,
        }}
      >
        {HEADING_WORDS.map((word, i) => {
          const isSpace = word.text === " ";
          if (isSpace) {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 18,
                }}
              />
            );
          }
          const realWordIndex = HEADING_WORDS.filter(
            (w, idx) => idx < i && w.text !== " ",
          ).length;
          const style = useWordDragIn(frame, fps, {
            index: realWordIndex,
            stagger: 3,
            baseDelay: 5,
            origin: "center bottom",
          });
          return (
            <span
              key={i}
              style={{
                ...style,
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: word.text === "Simplex" ? 700 : 500,
                color: word.color,
                letterSpacing: -0.5,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* Browser chrome wrapper */}
      <div
        style={{
          width: 1400,
          transform: `scale(${browserScale})`,
          opacity: browserOpacity,
          borderRadius: 24,
          overflow: "visible",
          boxShadow: "0 12px 60px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Browser title bar */}
        <div
          style={{
            height: 64,
            backgroundColor: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            paddingRight: 24,
            gap: 12,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Traffic light dots */}
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#FF5F56" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#FFBD2E" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#27C93F" }} />

          {/* URL bar — centered "Your Dashboard" */}
          <div
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 16,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 20,
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Your Dashboard
            </span>
          </div>
        </div>

        {/* Browser content area — this is the operator's page */}
        <div
          style={{
            position: "relative",
            padding: 32,
            minHeight: 900,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* iframe marching-ants border wrapper */}
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              padding: 40,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              opacity: iframeLabelOpacity,
            }}
          >
            {/* Marching ants SVG border — frame-driven animation */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                overflow: "visible",
              }}
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
            >
              {/* Glow layer behind the dashes */}
              <rect
                x="1"
                y="1"
                width="998"
                height="998"
                rx="20"
                ry="20"
                fill="none"
                stroke={IFRAME_GREEN}
                strokeWidth="10"
                strokeOpacity="0.25"
                vectorEffect="non-scaling-stroke"
              />
              {/* Main marching dashes */}
              <rect
                x="1"
                y="1"
                width="998"
                height="998"
                rx="20"
                ry="20"
                fill="none"
                stroke={IFRAME_GREEN}
                strokeWidth="5"
                strokeDasharray="28 16"
                strokeDashoffset={-dashOffset}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* iframe label — top-right corner */}
            <div
              style={{
                position: "absolute",
                top: -18,
                right: 32,
                backgroundColor: IFRAME_GREEN,
                color: "#064E3B",
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 700,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 8,
                letterSpacing: 1,
                transform: `scale(${iframeLabelScale})`,
                transformOrigin: "center center",
              }}
            >
              &lt;iframe&gt;
            </div>

            {/* Logo + Simplex */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                transform: `scale(${formScale})`,
                opacity: formOpacity,
              }}
            >
              <LogoIcon />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 64,
                  fontWeight: 700,
                  color: INDIGO,
                }}
              >
                Simplex
              </span>
            </div>

            {/* Login form inside iframe */}
            <div
              style={{
                width: 800,
                backgroundColor: "white",
                borderRadius: 28,
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 8px 40px rgba(0, 0, 0, 0.06)",
                padding: "60px 56px",
                display: "flex",
                flexDirection: "column",
                gap: 40,
                transform: `scale(${formScale})`,
                opacity: formOpacity,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
                <h2
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 48,
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                    letterSpacing: -0.5,
                  }}
                >
                  Sign in
                </h2>
                <p
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 26,
                    color: "#6B7280",
                    margin: 0,
                  }}
                >
                  Enter your credentials to continue
                </p>
              </div>

              {/* Email field */}
              <InputField
                label="Email"
                value={emailText}
                isFocused={emailFocused}
                cursorOpacity={emailCursor}
              />

              {/* Password field */}
              <InputField
                label="Password"
                value={passwordText}
                isFocused={passwordFocused}
                cursorOpacity={passwordCursor}
                isPassword
              />

              {/* Sign in button */}
              <button
                style={{
                  height: 80,
                  borderRadius: 14,
                  border: "none",
                  backgroundColor: INDIGO,
                  color: "white",
                  fontFamily: FONT_FAMILY,
                  fontSize: 28,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 4,
                  transform: `scale(${buttonScale})`,
                  letterSpacing: -0.2,
                }}
              >
                Sign in
              </button>

              {/* Forgot password link */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: FONT_FAMILY, fontSize: 22, color: "#9CA3AF" }}>
                  Forgot your password?{" "}
                </span>
                <span style={{ fontFamily: FONT_FAMILY, fontSize: 22, color: INDIGO, fontWeight: 500 }}>
                  Reset it
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
