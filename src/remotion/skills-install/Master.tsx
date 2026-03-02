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
import { AgentBlind } from "./AgentBlind";
import { BrowserSection } from "./BrowserSection";
import { FilmGrainOverlay } from "../shared/FilmGrainOverlay";
import { Intro } from "./Intro";
import { SDKSection } from "./SDKSection";
import { SimplexOutro } from "../shared/SimplexOutro";
import {
  SCENE_PALETTES,
  TEXT_FINISH_SHADOW,
  TEXT_LAYOUT_DEFAULTS,
  useCornerGlow,
  useRadialVignette,
  useTemporalShift,
} from "../shared/animations";

const INTRO_START = 0;
const INTRO_DURATION = 310;
const BROWSER_START = INTRO_START + INTRO_DURATION;
const BROWSER_DURATION = 180;
const SDK_START = BROWSER_START + BROWSER_DURATION;
const SDK_DURATION = 180;
const AGENT_START = SDK_START + SDK_DURATION;
const AGENT_DURATION = 180;
const OUTRO_SECTION_START = AGENT_START + AGENT_DURATION;
const OUTRO_SECTION_DURATION = 398;
const TOTAL_FRAMES = OUTRO_SECTION_START + OUTRO_SECTION_DURATION;

export const Master: React.FC = () => {
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

  const palette = useTemporalShift(frame, fps, {
    keyframes: [
      0,
      BROWSER_START,
      SDK_START,
      AGENT_START,
      OUTRO_SECTION_START,
      OUTRO_SECTION_START + 170,
      TOTAL_FRAMES - 1,
    ],
    palettes: [
      SCENE_PALETTES.intro,
      SCENE_PALETTES.integration,
      SCENE_PALETTES.feature,
      SCENE_PALETTES.integration,
      SCENE_PALETTES.feature,
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
      <div style={bgStyle} />
      <FilmGrainOverlay intensity={15} />
      <div style={glowTopLeft} />
      <div style={glowBottomRight} />

      <Sequence
        from={INTRO_START}
        durationInFrames={INTRO_DURATION}
        premountFor={1 * fps}
      >
        <Intro />
      </Sequence>

      <Sequence
        from={BROWSER_START}
        durationInFrames={BROWSER_DURATION}
        premountFor={1 * fps}
      >
        <BrowserSection />
      </Sequence>

      <Sequence
        from={SDK_START}
        durationInFrames={SDK_DURATION}
        premountFor={1 * fps}
      >
        <SDKSection />
      </Sequence>

      <Sequence
        from={AGENT_START}
        durationInFrames={AGENT_DURATION}
        premountFor={1 * fps}
      >
        <AgentBlind />
      </Sequence>

      <Sequence
        from={OUTRO_SECTION_START}
        durationInFrames={OUTRO_SECTION_DURATION}
        premountFor={1 * fps}
      >
        <SimplexOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
