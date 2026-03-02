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
  useGrowingUnderline,
  useMaskedRise,
  useScalePop,
  useWipeReveal,
} from "./animations";

const URL_TEXT = "https://simplex.sh";
const CURSOR_SIZE = 110;
const CLICK_POINT = { x: 1850, y: 872 };

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const urlRise = useMaskedRise(frame, fps, {
    delay: 0,
    yOffset: 320,
    springConfig: { damping: 200, stiffness: 120 },
  });
  const urlWipe = useWipeReveal(frame, fps, {
    delay: 2,
    direction: "left",
  });
  const urlFill = useGradientFill(frame, fps, {
    delay: 8,
    color: "#6366F1",
    baseColor: "#BCC4FF",
  });
  const underline = useGrowingUnderline(frame, fps, {
    delay: 12,
    height: 5,
    color: "#6366F1",
    direction: "center",
  });

  const cursorPath = useCursorPath(frame, fps, {
    from: { x: 2640, y: 1370 },
    to: CLICK_POINT,
    delay: 52,
    arcIntensity: 360,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 22, stiffness: 28, mass: 1.25 },
  });
  const clickDelay = 104;
  const { cursorScale, rippleStyle } = useCursorClick(frame, fps, {
    delay: clickDelay,
  });

  const urlPulse = spring({
    frame,
    fps,
    delay: clickDelay + 2,
    config: { damping: 14, stiffness: 220 },
  });
  const urlScale = interpolate(urlPulse, [0, 0.5, 1], [1, 1.035, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgePop = useScalePop(frame, fps, {
    delay: clickDelay + 10,
    springConfig: { damping: 14, stiffness: 180 },
  });

  const ctaFade = spring({
    frame,
    fps,
    delay: 116,
    config: { damping: 200, stiffness: 100 },
  });
  const ctaOpacity = interpolate(ctaFade, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 2200, height: 980 }}>
        <div
          style={{
            ...urlRise.containerStyle,
            ...urlWipe,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${urlScale})`,
          }}
        >
          <div
            style={{
              ...urlRise.contentStyle,
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                ...urlFill,
                fontFamily: FONT_FAMILY,
                fontSize: 124,
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {URL_TEXT}
            </span>
            <div style={{ marginTop: 10, width: "100%" }}>
              <div style={underline} />
            </div>
          </div>
        </div>

        <div
          style={{
            ...badgePop,
            position: "absolute",
            left: "50%",
            top: 660,
            transform: `translateX(-50%) ${badgePop.transform ?? ""}`.trim(),
            padding: "14px 22px",
            borderRadius: 999,
            border: "1px solid rgba(99, 102, 241, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.72)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: ctaOpacity,
          }}
        >
          <span style={{ fontSize: 24 }}>→</span>
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              fontWeight: 500,
              color: "#3A45CB",
              lineHeight: 1,
            }}
          >
            Start your first workflow
          </span>
        </div>
      </div>

      <div
        style={{
          ...rippleStyle,
          left: CLICK_POINT.x,
          top: CLICK_POINT.y,
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
