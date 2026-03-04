import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY, useMaskedRise, TEXT_FINISH } from "../../shared/animations";
import { AnimatedLines } from "../../shared/AnimatedLines";
const MONO_FONT = "JetBrains Mono, monospace";
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

const TITLE_TEXT = "Introducing Simplex CLI";
const TAGLINE_LINES = [
  { text: "Build, run, and manage browser automations", color: "#555555" },
  { text: "— from your terminal.", color: "#555555" },
];

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
    config: { damping: 20, stiffness: 200 },
    delay: 25,
  });
  const logoShiftX = interpolate(shiftProgress, [0, 1], [0, 928]);
  const logoShiftY = interpolate(shiftProgress, [0, 1], [0, -96]);
  const logoScaleDown = interpolate(shiftProgress, [0, 1], [1, 0.55]);

  const titleDelay = 30;
  const { containerStyle: titleContainer, contentStyle: titleContent } =
    useMaskedRise(frame, fps, { delay: titleDelay, yOffset: 60 });

  const underlineP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: titleDelay + 15,
  });
  const underlineWidth = interpolate(underlineP, [0, 1], [0, 100]);

  const taglineDelay = 80;

  const terminalDelay = 110;
  const terminalP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: terminalDelay,
  });
  const terminalOpacity = interpolate(terminalP, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const terminalY = interpolate(terminalP, [0, 1], [48, 0]);

  const INSTALL_CMD = "pip install simplex";
  const typingStart = terminalDelay + 10;
  const typedChars = Math.min(
    INSTALL_CMD.length,
    Math.max(0, Math.floor((frame - typingStart) / 2)),
  );
  const typedText = INSTALL_CMD.slice(0, typedChars);
  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
            transform: `translateX(${logoShiftX}px) translateY(${logoShiftY}px) scale(${logoScale * logoScaleDown}) rotate(${logoRotate}deg)`,
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
            transform: `translateX(-368px) translateY(${logoShiftY}px)`,
            opacity: interpolate(shiftProgress, [0, 0.3], [0, 1], {
              extrapolateRight: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={titleContainer}>
            <div
              style={{
                ...titleContent,
                fontFamily: FONT_FAMILY,
                fontSize: 192,
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
              height: 8,
              backgroundColor: INDIGO,
              width: `${underlineWidth}%`,
              borderRadius: 5,
              marginTop: 13,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Tagline */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: "translateY(256px)" }}>
          <AnimatedLines
            lines={TAGLINE_LINES}
            animation="maskedRise"
            stagger={10}
            delay={taglineDelay}
            fontSize={77}
            fontWeight={400}
          />
        </div>
      </AbsoluteFill>

      {/* Mini terminal: pip install simplex */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(496px) translateY(${terminalY}px)`,
            opacity: terminalOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: 19,
              padding: "26px 45px",
              boxShadow:
                "0 19px 64px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: 19,
            }}
          >
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 45,
                color: "#5AF78E",
              }}
            >
              ❯
            </span>
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 45,
                color: "#E0E0E0",
              }}
            >
              {typedText}
            </span>
            {typedChars < INSTALL_CMD.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 22,
                  height: 48,
                  backgroundColor: "#E0E0E0",
                  verticalAlign: "text-bottom",
                  opacity: cursorOpacity,
                }}
              />
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
