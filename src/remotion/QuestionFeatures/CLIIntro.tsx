import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_FAMILY,
  useMaskedRise,
  TEXT_FINISH,
  useWipeReveal,
  useFloatingText,
} from "../shared/animations";
const INDIGO = "#6366F1";
const LOGO_SIZE = 640;

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

const TITLE_TEXT = "Introducing Simplex";
const SUBHEADER_TEXT = "Browser automation agents for complex form filling";
const FEATURE_EYEBROW = "Feature Launch";
const FEATURE_HEADLINE = "Live Question Answering + Question Banks";

export const CLIIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 30, mass: 1.5 },
  });
  const logoEased = interpolate(
    logoProgress,
    [0, 0.15, 0.5, 1],
    [0, 0.02, 0.6, 1],
    { extrapolateRight: "clamp" },
  );
  const logoScale = interpolate(logoEased, [0, 1], [0, 1]);
  const logoRotate = interpolate(logoEased, [0, 1], [120, 0]);

  const shiftProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 130 },
    delay: 22,
    durationInFrames: 23,
  });
  // One move to the final top lockup position (no second lift phase).
  const logoShiftX = interpolate(shiftProgress, [0, 1], [0, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoShiftY = interpolate(shiftProgress, [0, 1], [0, -500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScaleDown = interpolate(shiftProgress, [0, 1], [1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockupScale = interpolate(shiftProgress, [0, 1], [1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleDelay = 27;
  const lockupOpacity = frame >= titleDelay ? 1 : 0;
  const { containerStyle: titleContainer, contentStyle: titleContent } =
    useMaskedRise(frame, fps, { delay: titleDelay, yOffset: 60 });

  const underlineP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: titleDelay + 15,
  });
  const underlineWidth = interpolate(underlineP, [0, 1], [0, 100]);

  const subheaderDelay = 34;
  const { containerStyle: subheaderContainer, contentStyle: subheaderContent } =
    useMaskedRise(frame, fps, {
      delay: subheaderDelay,
      yOffset: 36,
      springConfig: { damping: 200, stiffness: 120 },
    });

  const featureDelay = 58;

  const featureEyebrowWipeStyle = useWipeReveal(frame, fps, {
    delay: featureDelay,
    direction: "left",
  });

  const featureBlockP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 130 },
    delay: featureDelay,
  });
  const featureBlockOpacity = interpolate(featureBlockP, [0, 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const featureBlockY = interpolate(featureBlockP, [0, 1], [54, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const { containerStyle: featureContainer, contentStyle: featureContent } =
    useMaskedRise(frame, fps, {
      delay: featureDelay,
      yOffset: 68,
      springConfig: { damping: 20, stiffness: 100 },
    });

  const featureContainerStyle = {
    ...featureContainer,
    overflow: "visible",
  };

  const featureWipeStyle = useWipeReveal(frame, fps, {
    delay: featureDelay + 4,
    direction: "left",
  });
  const featureFloatStyle = useFloatingText(frame, fps, {
    delay: featureDelay + 4,
    cycleDurationInFrames: Math.round(1.7 * fps),
    centeredAroundZero: true,
  });
  const featureTransform = [
    typeof featureContent.transform === "string" ? featureContent.transform : "",
    typeof featureFloatStyle.transform === "string" ? featureFloatStyle.transform : "",
  ]
    .filter(Boolean)
    .join(" ");
  const featureHeadlineTransform = [featureTransform, "translateY(30px)"]
    .filter(Boolean)
    .join(" ");

  const fadeOutP = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 235,
  });
  const fadeOutOpacity = interpolate(fadeOutP, [0, 1], [1, 0]);
  const fadeOutScale = interpolate(fadeOutP, [0, 1], [1, 0.95]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        opacity: fadeOutOpacity,
        transform: `scale(${fadeOutScale})`,
      }}
    >
      {/* Logo */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateX(${logoShiftX}px) translateY(${logoShiftY}px) scale(${logoScale * logoScaleDown * lockupScale}) rotate(${logoRotate}deg)`,
            transformOrigin: "center center",
          }}
        >
          <LogoIcon />
        </div>
      </AbsoluteFill>

      {/* Title — rise up, no scale */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateX(-300px) translateY(${logoShiftY}px) scale(${lockupScale})`,
            opacity: lockupOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <div style={{ ...titleContainer, position: "relative", zIndex: 2 }}>
            <div
              style={{
                ...titleContent,
                fontFamily: FONT_FAMILY,
                fontSize: 176,
                fontWeight: 700,
                color: INDIGO,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                ...TEXT_FINISH,
              }}
            >
              {TITLE_TEXT}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 0,
              height: 8,
              backgroundColor: INDIGO,
              width: `${underlineWidth}%`,
              borderRadius: 5,
              marginTop: 15,
            }}
          />
          <div style={{ marginTop: 28, ...subheaderContainer, position: "relative", zIndex: 2 }}>
            <div
              style={{
                ...subheaderContent,
                fontFamily: FONT_FAMILY,
                fontSize: 66,
                fontWeight: 400,
                color: "#555555",
                whiteSpace: "nowrap",
                ...TEXT_FINISH,
              }}
            >
              {SUBHEADER_TEXT}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Feature launch headline (main event) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${featureBlockY}px)`,
            opacity: featureBlockOpacity,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 86,
                fontWeight: 400,
                textAlign: "center",
                ...featureEyebrowWipeStyle,
                marginBottom: 16,
                color: "#000000",
                ...TEXT_FINISH,
              }}
            >
              {FEATURE_EYEBROW}
            </div>
            <div style={featureContainerStyle}>
              <div
                style={{
                  ...featureContent,
                  ...featureWipeStyle,
                  ...featureFloatStyle,
                  transform: featureHeadlineTransform || undefined,
                  fontFamily: FONT_FAMILY,
                  fontSize: 146,
                  fontWeight: 700,
                  color: INDIGO,
                  whiteSpace: "nowrap",
                  position: "relative",
                  zIndex: 2,
                  ...TEXT_FINISH,
                  lineHeight: 1.08,
                  paddingBottom: 14,
                }}
              >
                {FEATURE_HEADLINE}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
