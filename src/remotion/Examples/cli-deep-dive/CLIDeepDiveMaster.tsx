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
import { SimplexOutro } from "../../shared/SimplexOutro";
import { FilmGrainOverlay } from "../../shared/FilmGrainOverlay";
import {
  interpolate,
  spring,
} from "remotion";
import {
  SCENE_PALETTES,
  TEXT_FINISH_SHADOW,
  TEXT_LAYOUT_DEFAULTS,
  useCornerGlow,
  useFocusShiftTransition,
  usePowerWipeTransition,
  useRadialVignette,
  useTemporalShift,
} from "../../shared/animations";

const INTRO_DURATION = 280;
const INSTALL_START = INTRO_DURATION;
const INSTALL_DURATION = 265;
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

const TRANSITION_DURATION = 20;

/* Inline transition overlay components */
const PowerWipeOverlay: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wipeStyle, progress } = usePowerWipeTransition(frame, fps, {
    delay,
    durationInFrames: TRANSITION_DURATION,
  });
  // Bell-curve opacity so the wipe sweeps through without a full whiteout
  const wipeOpacity = progress <= 0.5
    ? progress * 2 * 0.45
    : (1 - progress) * 2 * 0.45;
  return <div style={{ ...wipeStyle, opacity: wipeOpacity }} />;
};

/** Wraps a section to wipe-reveal it from one edge with parallax + motion blur. */
const WipeIn: React.FC<{
  children: React.ReactNode;
  enterFrom: "left" | "right";
  transitionFrames?: number;
}> = ({ children, enterFrom, transitionFrames = TRANSITION_DURATION }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: transitionFrames,
  });

  const clipPct = interpolate(progress, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle parallax shift during reveal
  const shiftX = interpolate(
    progress,
    [0, 1],
    [enterFrom === "left" ? -60 : 60, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Brief motion blur peaks mid-transition
  const blurPx = interpolate(progress, [0, 0.3, 0.7, 1], [0, 3, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // enterFrom="right" → reveal from right edge; "left" → reveal from left edge
  const clipPath =
    enterFrom === "right"
      ? `inset(0 0 0 ${clipPct}%)`
      : `inset(0 ${clipPct}% 0 0)`;

  return (
    <AbsoluteFill
      style={{
        clipPath,
        transform: `translateX(${shiftX}px)`,
        filter: blurPx > 0.5 ? `blur(${blurPx}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const FocusShiftOverlay: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contextStyle } = useFocusShiftTransition(frame, fps, {
    delay,
    durationInFrames: TRANSITION_DURATION,
    zoomScale: 1.3,
    contextBlur: 8,
  });
  return (
    <AbsoluteFill
      style={{
        ...contextStyle,
        background:
          "radial-gradient(ellipse 120% 120% at 50% 50%, rgba(200,200,240,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 40,
      }}
    />
  );
};

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
      <div style={bgStyle} />
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
        <WipeIn enterFrom="right">
          <CLISendEventsSection />
        </WipeIn>
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
        <WipeIn enterFrom="left">
          <CLIRunSection />
        </WipeIn>
      </Sequence>

      <Sequence
        from={OUTRO_SECTION_START}
        durationInFrames={OUTRO_SECTION_DURATION}
        premountFor={fps}
      >
        <SimplexOutro />
      </Sequence>

      {/* Scene transition overlays */}
      <Sequence
        from={INSTALL_START - 10}
        durationInFrames={TRANSITION_DURATION + 10}
      >
        <PowerWipeOverlay delay={10} />
      </Sequence>

      <Sequence
        from={PAUSE_RESUME_START - 10}
        durationInFrames={TRANSITION_DURATION + 10}
      >
        <FocusShiftOverlay delay={10} />
      </Sequence>
    </AbsoluteFill>
  );
};
