import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SimplexLogoAnimated } from "./SimplexLogoAnimated";
import { SimplexText } from "./SimplexText";
import { TaglineText } from "./TaglineText";
import { Outro } from "./Outro";

const LOGO_TEXT_DELAY = 30;
const TAGLINE_DELAY = 68;
const BRAND_FADE_DELAY = 170;

export const SimplexOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomRaw = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 5.5 },
    delay: 38,
  });
  const zoom = interpolate(zoomRaw, [0, 1], [1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOutProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: BRAND_FADE_DELAY,
  });
  const contentOpacity = interpolate(fadeOutProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentScale = interpolate(fadeOutProgress, [0, 1], [1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <AbsoluteFill
        style={{
          opacity: contentOpacity,
          transform: `scale(${contentScale})`,
        }}
      >
        <Sequence from={0} premountFor={1 * fps}>
          <SimplexLogoAnimated />
        </Sequence>

        <Sequence from={LOGO_TEXT_DELAY} premountFor={1 * fps}>
          <SimplexText />
        </Sequence>

        <Sequence from={TAGLINE_DELAY} premountFor={1 * fps}>
          <TaglineText />
        </Sequence>
      </AbsoluteFill>

      <Sequence from={BRAND_FADE_DELAY} premountFor={1 * fps}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
