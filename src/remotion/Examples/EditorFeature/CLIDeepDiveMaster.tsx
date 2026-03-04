import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useEffect, useState } from "react";
import { BrowserGrid } from "./BrowserGrid";
import { CLIIntro } from "./CLIIntro";
import { SimplexOutro } from "../../shared/SimplexOutro";
import { FilmGrainOverlay } from "../../shared/FilmGrainOverlay";
import {
  SCENE_PALETTES,
  TEXT_FINISH_SHADOW,
  TEXT_LAYOUT_DEFAULTS,
  useCornerGlow,
  useRadialVignette,
  useTemporalShift,
} from "../../shared/animations";

const INTRO_DURATION = 868;
const SECTION2_START = INTRO_DURATION;
const SECTION2_DURATION = 270;
const OUTRO_SECTION_START = SECTION2_START + SECTION2_DURATION;
const OUTRO_SECTION_DURATION = 398;

export const CLI_TOTAL_FRAMES =
  OUTRO_SECTION_START + OUTRO_SECTION_DURATION;


export const CLIDeepDiveMaster: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [fontHandle] = useState(() =>
    delayRender("Loading SF Pro Display fonts"),
  );
  useEffect(() => {
    const light = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Light.otf")})`,
      { weight: "300" },
    );
    const regular = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Regular.otf")})`,
      { weight: "400" },
    );
    const bold = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Bold.otf")})`,
      { weight: "700" },
    );
    Promise.all([light.load(), regular.load(), bold.load()])
      .then(([l, r, b]) => {
        document.fonts.add(l);
        document.fonts.add(r);
        document.fonts.add(b);
        continueRender(fontHandle);
      })
      .catch((error) => {
        console.error("Failed to load SF Pro Display fonts", error);
        continueRender(fontHandle);
      });
  }, [fontHandle]);

  /* Background palette morphing across scene boundaries */
  const palette = useTemporalShift(frame, fps, {
    keyframes: [
      0,
      SECTION2_START,
      OUTRO_SECTION_START,
      CLI_TOTAL_FRAMES - 1,
    ],
    palettes: [
      SCENE_PALETTES.intro,
      SCENE_PALETTES.intro,
      SCENE_PALETTES.intro,
      SCENE_PALETTES.intro,
    ],
  });
  const bgStyle = useRadialVignette(frame, fps, { colors: palette });
  const glowTopLeft = useCornerGlow(frame, fps, {
    position: "top-left",
    targetOpacity: 0.06,
  });
  const glowBottomRight = useCornerGlow(frame, fps, {
    delay: 6,
    position: "bottom-right",
    targetOpacity: 0.03,
  });

  return (
    <AbsoluteFill style={{ ...TEXT_LAYOUT_DEFAULTS, ...TEXT_FINISH_SHADOW }}>
      {/* Background stack */}
      <div style={{ ...bgStyle, opacity: 1 }} />
      <FilmGrainOverlay intensity={15} />
      <div style={glowTopLeft} />
      <div style={glowBottomRight} />

      {/* Content sequences */}
      <Sequence durationInFrames={INTRO_DURATION} premountFor={fps}>
        <CLIIntro />
      </Sequence>

      <Sequence
        from={SECTION2_START}
        durationInFrames={SECTION2_DURATION}
        premountFor={fps}
      >
        <BrowserGrid />
      </Sequence>

      <Sequence
        from={OUTRO_SECTION_START}
        durationInFrames={OUTRO_SECTION_DURATION}
        premountFor={fps}
      >
        <SimplexOutro />
      </Sequence>

    </AbsoluteFill>
  );
};
