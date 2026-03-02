import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  useCursorClick,
  useCursorPath,
  useGradientFill,
  useMaskedRise,
  usePanelReveal,
  useScalePop,
  useTypingAnimation,
  useWipeReveal,
} from "../shared/animations";

const INDIGO = "#6366F1";
const LOGO_SIZE = 180;
const CURSOR_SIZE = 105;
const EMAIL_VALUE = "marco@simplex.sh";
const PASSWORD_VALUE = "Password123";
const EMAIL_DELAY = 42;
const PASSWORD_DELAY = 92;
const CARD_WIDTH = 980;

const InputRow: React.FC<{
  label: string;
  value: string;
  isFocused: boolean;
  cursorOpacity: number;
  isPassword?: boolean;
}> = ({ label, value, isFocused, cursorOpacity, isPassword }) => {
  const display = isPassword ? "\u2022".repeat(value.length) : value;
  const placeholder = isPassword ? "Password" : "you@example.com";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span
        style={{
          ...TEXT_FINISH,
          fontFamily: FONT_FAMILY,
          fontSize: 28,
          fontWeight: 500,
          color: "#3A436B",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: 92,
          borderRadius: 16,
          border: `2px solid ${isFocused ? INDIGO : "#CFD6F3"}`,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: isFocused
            ? "0 0 0 4px rgba(99, 102, 241, 0.14)"
            : "0 4px 12px rgba(15, 23, 42, 0.06)",
        }}
      >
        <span
          style={{
            ...TEXT_FINISH,
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 400,
            color: value ? "#171D34" : "#98A1C2",
            letterSpacing: isPassword && value ? 4 : 0,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {display || placeholder}
        </span>
        {isFocused ? (
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 42,
              marginLeft: 4,
              backgroundColor: INDIGO,
              opacity: cursorOpacity,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const LogoMark: React.FC = () => (
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

export const BrowserSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingRise = useMaskedRise(frame, fps, {
    delay: 6,
    yOffset: 90,
    springConfig: { damping: 200, stiffness: 110 },
  });
  const headingWipe = useWipeReveal(frame, fps, {
    delay: 7,
    direction: "left",
  });
  const headingFill = useGradientFill(frame, fps, {
    delay: 11,
    color: INDIGO,
    baseColor: "#AFB8FF",
  });

  const logoStyle = useScalePop(frame, fps, {
    delay: 0,
    springConfig: { damping: 14, stiffness: 150 },
  });
  const cardReveal = usePanelReveal(frame, fps, {
    delay: 24,
    from: "bottom",
    distance: 150,
  });

  const emailTyping = useTypingAnimation(frame, fps, {
    text: EMAIL_VALUE,
    charFrames: 2,
    delay: EMAIL_DELAY,
  });
  const passwordTyping = useTypingAnimation(frame, fps, {
    text: PASSWORD_VALUE,
    charFrames: 2,
    delay: PASSWORD_DELAY,
  });

  const emailFocused =
    frame >= EMAIL_DELAY && frame < emailTyping.typingEndFrame + 6;
  const passwordFocused = frame >= PASSWORD_DELAY && !passwordTyping.doneTyping;

  const buttonPop = useScalePop(frame, fps, {
    delay: passwordTyping.typingEndFrame + 10,
    springConfig: { damping: 12, stiffness: 220 },
  });
  const clickDelay = passwordTyping.typingEndFrame + 24;
  const clicked = frame >= clickDelay;

  const cursorPath = useCursorPath(frame, fps, {
    from: { x: 2480, y: 1320 },
    to: { x: 1536, y: 1088 },
    delay: passwordTyping.typingEndFrame + 6,
    arcIntensity: 320,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 24, stiffness: 26, mass: 1.25 },
  });
  const { cursorScale, rippleStyle } = useCursorClick(frame, fps, {
    delay: clickDelay,
  });

  const successBadge = useScalePop(frame, fps, {
    delay: clickDelay + 10,
    springConfig: { damping: 14, stiffness: 180 },
  });

  const fadeOut = spring({
    frame,
    fps,
    delay: 156,
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
      }}
    >
      <div
        style={{
          opacity: sectionOpacity,
          transform: `scale(${sectionScale})`,
          width: 2400,
          height: 1260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ ...headingRise.containerStyle, ...headingWipe }}>
          <div
            style={{
              ...headingRise.contentStyle,
              display: "flex",
              gap: 26,
              alignItems: "baseline",
              fontFamily: FONT_FAMILY,
              fontSize: 88,
              lineHeight: 1,
            }}
          >
            <span style={{ ...TEXT_FINISH, fontWeight: 400, color: "#1A2037" }}>
              Browser login,
            </span>
            <span style={{ ...TEXT_FINISH, ...headingFill, fontWeight: 700 }}>
              now interactive
            </span>
          </div>
        </div>

        <div
          style={{
            ...logoStyle,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <LogoMark />
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 700,
              color: INDIGO,
              lineHeight: 1,
            }}
          >
            Simplex
          </span>
        </div>

        <div
          style={{
            ...cardReveal,
            width: CARD_WIDTH,
            borderRadius: 30,
            border: "1px solid rgba(84, 95, 154, 0.16)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            padding: "60px 60px 54px",
            display: "flex",
            flexDirection: "column",
            gap: 36,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2
              style={{
                ...TEXT_FINISH,
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 600,
                color: "#1A2037",
                lineHeight: 1,
              }}
            >
              Sign in
            </h2>
            <p
              style={{
                ...TEXT_FINISH,
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontSize: 30,
                fontWeight: 400,
                color: "#57618B",
                lineHeight: 1,
              }}
            >
              Credentials are streamed only to your secure browser session.
            </p>
          </div>

          <InputRow
            label="Email"
            value={emailTyping.typedText}
            isFocused={emailFocused}
            cursorOpacity={emailTyping.cursorOpacity}
          />

          <InputRow
            label="Password"
            value={passwordTyping.typedText}
            isPassword
            isFocused={passwordFocused}
            cursorOpacity={passwordTyping.cursorOpacity}
          />

          <button
            style={{
              ...buttonPop,
              height: 92,
              borderRadius: 16,
              border: "none",
              backgroundColor: clicked ? "#4F46E5" : INDIGO,
              color: "white",
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: -0.2,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>

          <div
            style={{
              ...successBadge,
              alignSelf: "center",
              padding: "12px 20px",
              borderRadius: 999,
              border: "1px solid rgba(79, 70, 229, 0.2)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 24 }}>✓</span>
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 26,
                fontWeight: 500,
                color: "#3F45C8",
                lineHeight: 1,
              }}
            >
              Session authorized
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          ...rippleStyle,
          left: 1536,
          top: 1088,
        }}
      />
      <Img
        src={staticFile("cursor.png")}
        style={{
          position: "absolute",
          left: cursorPath.x,
          top: cursorPath.y,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          opacity: cursorPath.opacity,
          transform: `scale(${cursorScale})`,
          transformOrigin: "top left",
        }}
      />
    </AbsoluteFill>
  );
};
