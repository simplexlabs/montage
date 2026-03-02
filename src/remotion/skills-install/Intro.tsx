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
  useTypingAnimation,
  useWipeReveal,
} from "../shared/animations";

const INDIGO = "#6366F1";
const LOGO_SIZE = 300;
const CURSOR_SIZE = 120;
const LOCK_CENTER = { x: 1180, y: 905 };

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

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleRise = useMaskedRise(frame, fps, {
    delay: 8,
    yOffset: 120,
    springConfig: { damping: 20, stiffness: 90 },
  });
  const titleWipe = useWipeReveal(frame, fps, {
    delay: 10,
    direction: "left",
  });
  const titleFill = useGradientFill(frame, fps, {
    delay: 12,
    color: INDIGO,
    baseColor: "#B8C0FF",
  });

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.9 },
  });
  const logoScale = interpolate(logoEntrance, [0, 1], [0.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoRotate = interpolate(logoEntrance, [0, 1], [55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splitProgress = spring({
    frame,
    fps,
    delay: 28,
    config: { damping: 20, stiffness: 160 },
  });
  const logoShiftX = interpolate(splitProgress, [0, 1], [0, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleShiftX = interpolate(splitProgress, [0, 1], [0, -320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const liftProgress = spring({
    frame,
    fps,
    delay: 50,
    config: { damping: 200, stiffness: 120 },
  });
  const liftY = interpolate(liftProgress, [0, 1], [0, -210], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleTyping = useTypingAnimation(frame, fps, {
    text: "Pause & Resume for Operators",
    charFrames: 2,
    delay: 70,
  });
  const subtitleRise = useMaskedRise(frame, fps, {
    delay: 66,
    yOffset: 36,
    springConfig: { damping: 200, stiffness: 140 },
  });
  const subtitleWipe = useWipeReveal(frame, fps, {
    delay: 68,
    direction: "left",
  });

  const credentialPanel = usePanelReveal(frame, fps, {
    delay: 98,
    from: "bottom",
    distance: 120,
  });

  const lockPulseP = spring({
    frame,
    fps,
    delay: 132,
    config: { damping: 14, stiffness: 220 },
  });
  const lockScale = interpolate(lockPulseP, [0, 0.5, 1], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorPath = useCursorPath(frame, fps, {
    from: { x: 2640, y: 1360 },
    to: LOCK_CENTER,
    delay: 104,
    arcIntensity: 340,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 22, stiffness: 28, mass: 1.2 },
  });
  const { cursorScale, rippleStyle } = useCursorClick(frame, fps, { delay: 132 });
  const cursorExit = spring({
    frame,
    fps,
    delay: 150,
    config: { damping: 200, stiffness: 120 },
  });
  const cursorExitOpacity = interpolate(cursorExit, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = spring({
    frame,
    fps,
    delay: 250,
    config: { damping: 200 },
  });
  const sectionOpacity = interpolate(fadeOut, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sectionScale = interpolate(fadeOut, [0, 1], [1, 0.96], {
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
      <div style={{ position: "relative", width: 2600, height: 1300 }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 360,
            transform: `translateX(-50%) translateY(${liftY}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 72 }}>
            <div
              style={{
                transform: `translateX(${logoShiftX}px) scale(${logoScale}) rotate(${logoRotate}deg)`,
                transformOrigin: "center center",
              }}
            >
              <LogoMark />
            </div>

            <div style={{ transform: `translateX(${titleShiftX}px)` }}>
              <div style={{ ...titleRise.containerStyle, ...titleWipe }}>
                <div
                  style={{
                    ...titleRise.contentStyle,
                    display: "flex",
                    gap: 34,
                    alignItems: "baseline",
                    whiteSpace: "nowrap",
                    fontFamily: FONT_FAMILY,
                    fontSize: 122,
                    lineHeight: 1,
                  }}
                >
                  <span style={{ ...TEXT_FINISH, fontWeight: 400, color: "#131729" }}>
                    Introducing
                  </span>
                  <span
                    style={{
                      ...TEXT_FINISH,
                      ...titleFill,
                      fontWeight: 700,
                    }}
                  >
                    Interactivity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 660,
            transform: `translateX(-50%) translateY(${liftY}px)`,
          }}
        >
          <div style={{ ...subtitleRise.containerStyle, ...subtitleWipe }}>
            <div
              style={{
                ...subtitleRise.contentStyle,
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 76,
                fontWeight: 600,
                color: INDIGO,
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {subtitleTyping.typedText}
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 66,
                  backgroundColor: INDIGO,
                  marginLeft: 8,
                  verticalAlign: "text-bottom",
                  opacity: subtitleTyping.doneTyping ? subtitleTyping.cursorOpacity : 1,
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            ...credentialPanel,
            position: "absolute",
            left: "50%",
            top: 820,
            width: 900,
            height: 190,
            transform: `translateX(-50%) translateY(${liftY}px) ${credentialPanel.transform ?? ""}`.trim(),
            borderRadius: 30,
            border: "1px solid rgba(99, 102, 241, 0.22)",
            backgroundColor: "rgba(255, 255, 255, 0.84)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 52px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 24,
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${lockScale})`,
              }}
            >
              <Img
                src={staticFile("simplex-lock.png")}
                style={{ width: 64, height: 64, objectFit: "contain" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  ...TEXT_FINISH,
                  fontFamily: FONT_FAMILY,
                  fontSize: 44,
                  fontWeight: 600,
                  color: "#151A2E",
                  lineHeight: 1,
                }}
              >
                Vault-backed credentials
              </span>
              <span
                style={{
                  ...TEXT_FINISH,
                  fontFamily: FONT_FAMILY,
                  fontSize: 30,
                  fontWeight: 400,
                  color: "#4D557D",
                  lineHeight: 1,
                }}
              >
                Operators pause and resume safely
              </span>
            </div>
          </div>

          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 600,
              color: INDIGO,
              lineHeight: 1,
            }}
          >
            Encrypted
          </span>
        </div>

        <div
          style={{
            ...rippleStyle,
            left: LOCK_CENTER.x,
            top: LOCK_CENTER.y,
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
            opacity: cursorPath.opacity * cursorExitOpacity,
            transform: `scale(${cursorScale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
