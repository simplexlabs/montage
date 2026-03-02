import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const INDIGO = "#6366F1";
const LOGO_SIZE = 576; // 192 * 3
const MOTION_BLUR_SAMPLES = 5;
const MOTION_BLUR_SPREAD = 1.5;

const getTransform = (progress: number) => {
  const eased = interpolate(progress, [0, 0.15, 0.5, 1], [0, 0.02, 0.6, 1], {
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(eased, [0, 1], [120, 0]);
  const translateY = interpolate(eased, [0, 1], [1000, 0]);
  const scale = interpolate(eased, [0, 1], [0.35, 1]);
  return { rotate, translateY, scale };
};

const SPRING_CONFIG = { damping: 10, stiffness: 30, mass: 1.5 } as const;

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

export const SimplexLogoAnimated: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIG,
    durationInFrames: 60,
  });

  const { rotate, translateY, scale } = getTransform(progress);

  const prevProgress = spring({
    frame: Math.max(0, frame - 1),
    fps,
    config: SPRING_CONFIG,
    durationInFrames: 60,
  });
  const velocity = Math.abs(progress - prevProgress);
  const blurIntensity = Math.min(1, velocity * 15);

  // Shift right at frame 31 to make room for text
  const shiftProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
    delay: 31,
  });
  const shiftX = interpolate(shiftProgress, [0, 1], [0, 550]);
  const shiftScale = interpolate(shiftProgress, [0, 1], [1, 0.8]);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Motion blur trails */}
      {Array.from({ length: MOTION_BLUR_SAMPLES }).map((_, i) => {
        const offset =
          ((i - (MOTION_BLUR_SAMPLES - 1) / 2) / MOTION_BLUR_SAMPLES) *
          MOTION_BLUR_SPREAD;
        const sampleProgress = spring({
          frame: Math.max(0, frame + offset),
          fps,
          config: SPRING_CONFIG,
          durationInFrames: 60,
        });
        const sample = getTransform(sampleProgress);
        const opacity = blurIntensity * (0.15 / MOTION_BLUR_SAMPLES);

        if (opacity < 0.001) return null;

        return (
          <AbsoluteFill
            key={i}
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: `translateX(${shiftX}px) translateY(${sample.translateY}px) rotate(${sample.rotate}deg) scale(${sample.scale * shiftScale})`,
              opacity,
            }}
          >
            <LogoIcon />
          </AbsoluteFill>
        );
      })}

      {/* Main logo */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${shiftX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale * shiftScale})`,
        }}
      >
        <LogoIcon />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
