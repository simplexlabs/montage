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
import { CLIIntro } from "./CLIIntro";
import { CLIInstallSection } from "./CLIInstallSection";
import { CLISendEventsSection } from "./CLISendEventsSection";
import { CLIPauseResumeSection } from "./CLIPauseResumeSection";
import { CLIRunSection } from "./CLIRunSection";
import { SimplexOutro } from "../shared/SimplexOutro";
import { FilmGrainOverlay } from "../shared/FilmGrainOverlay";
import {
  SCENE_PALETTES,
  TEXT_FINISH_SHADOW,
  TEXT_LAYOUT_DEFAULTS,
  useCornerGlow,
  useRadialVignette,
  useTemporalShift,
} from "../shared/animations";

const INTRO_DURATION = 145;
const INSTALL_START = INTRO_DURATION;
const INSTALL_DURATION = 430;
const SEND_EVENTS_START = INSTALL_START + INSTALL_DURATION;
const SEND_EVENTS_DURATION = 265;
const PAUSE_RESUME_START = SEND_EVENTS_START + SEND_EVENTS_DURATION;
const PAUSE_RESUME_DURATION = 235;
const RUN_START = PAUSE_RESUME_START + PAUSE_RESUME_DURATION;
const RUN_DURATION = 178;
const OUTRO_SECTION_START = RUN_START + RUN_DURATION;
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
      INSTALL_START,
      SEND_EVENTS_START,
      PAUSE_RESUME_START,
      RUN_START,
      OUTRO_SECTION_START,
      CLI_TOTAL_FRAMES - 1,
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
        from={INSTALL_START}
        durationInFrames={INSTALL_DURATION}
        premountFor={fps}
      >
        <CLIInstallSection />
      </Sequence>

      <Sequence
        from={SEND_EVENTS_START}
        durationInFrames={SEND_EVENTS_DURATION}
        premountFor={fps}
      >
        <CLISendEventsSection />
      </Sequence>

      <Sequence
        from={PAUSE_RESUME_START}
        durationInFrames={PAUSE_RESUME_DURATION}
        premountFor={fps}
      >
        <CLIPauseResumeSection />
      </Sequence>

      <Sequence
        from={RUN_START}
        durationInFrames={RUN_DURATION}
        premountFor={fps}
      >
        <CLIRunSection />
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
