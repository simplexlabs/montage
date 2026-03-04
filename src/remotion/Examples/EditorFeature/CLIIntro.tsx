import {
  AbsoluteFill,
  Easing,
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
} from "../../shared/animations";
import { EditorPeek } from "./EditorPeek";

const INDIGO = "#6366F1";
const LOGO_SIZE = 640;
const FRAME_WIDTH = 3072;
const FRAME_HEIGHT = 1728;
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

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
const FEATURE_HEADLINE = "Simplex Editor";
const TAGLINE = "Prompt Simplex's agent to create reusable browser automation code";

export const CLIIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Phase 1: Logo spin-in ────────────────────────────────────
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

  // ─── Phase 2: Logo shift to lockup ───────────────────────────
  const shiftProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 130 },
    delay: 22,
    durationInFrames: 23,
  });
  const logoShiftX = interpolate(shiftProgress, [0, 1], [0, 760], clamp);
  const logoShiftY = interpolate(shiftProgress, [0, 1], [0, -500], clamp);
  const logoScaleDown = interpolate(shiftProgress, [0, 1], [1, 0.5], clamp);
  const lockupScale = interpolate(shiftProgress, [0, 1], [1, 0.95], clamp);

  // ─── Phase 3: Title / subheader ──────────────────────────────
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

  // ─── Phase 4: Feature headline ───────────────────────────────
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
  const featureBlockOpacity = interpolate(
    featureBlockP,
    [0, 0.35],
    [0, 1],
    clamp,
  );
  const featureBlockY = interpolate(featureBlockP, [0, 1], [54, 0], clamp);

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
    typeof featureContent.transform === "string"
      ? featureContent.transform
      : "",
    typeof featureFloatStyle.transform === "string"
      ? featureFloatStyle.transform
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const featureHeadlineTransform = [featureTransform, "translateY(30px)"]
    .filter(Boolean)
    .join(" ");

  // ─── Phase 5 + 6: Editor peek pushes content up ──────────────
  const ideWidth = FRAME_WIDTH * 0.8;
  const ideHeight = FRAME_HEIGHT * 0.76;
  const editorLeft = (FRAME_WIDTH - ideWidth) / 2;
  const editorFinalTop = 260;

  // Slow peek — editor top rises into view (delayed 1.5s = 45 frames)
  const peekDelay = 90;
  const peekP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 50 },
    delay: peekDelay,
  });
  const peekTop = interpolate(
    peekP,
    [0, 1],
    [FRAME_HEIGHT, FRAME_HEIGHT - 650],
    clamp,
  );

  // Continue rising to final position as intro content swipes away
  const riseP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    delay: peekDelay + 60,
  });
  const riseOffset = interpolate(
    riseP,
    [0, 1],
    [0, -(FRAME_HEIGHT - 650 - editorFinalTop)],
    clamp,
  );

  const editorTop = peekTop + riseOffset;

  // Content gets pushed up only during the second rise (not the peek)
  const riseDistance = FRAME_HEIGHT - 650 - editorFinalTop; // total rise distance
  const contentSwipeY = interpolate(riseP, [0, 1], [0, -riseDistance * 0.7], clamp);
  const contentSwipeOpacity = interpolate(riseP, [0, 0.6], [1, 0], clamp);

  // ─── Phase 7: Tagline above editor ───────────────────────────
  const taglineDelay = 180;
  const { containerStyle: taglineContainer, contentStyle: taglineContent } =
    useMaskedRise(frame, fps, {
      delay: taglineDelay,
      yOffset: 40,
      springConfig: { damping: 200, stiffness: 120 },
    });
  const taglineWipe = useWipeReveal(frame, fps, {
    delay: taglineDelay + 4,
    direction: "left",
  });

  // ─── Phase 7b: Tagline flip — old exits up, new enters up ────────
  const taglineFlipDelay = 600;
  const taglineFlipP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay: taglineFlipDelay,
  });
  const oldTaglineX = interpolate(taglineFlipP, [0, 1], [0, 300], clamp);
  const oldTaglineOpacity = interpolate(taglineFlipP, [0, 0.4], [1, 0], clamp);

  const newTaglineDelay = taglineFlipDelay + 8;
  const newTagSlideP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay: newTaglineDelay,
  });
  const newTaglineX = interpolate(newTagSlideP, [0, 1], [-300, 0], clamp);
  const newTaglineOpacity = interpolate(newTagSlideP, [0, 0.3], [0, 1], clamp);
  const newTagWipe = useWipeReveal(frame, fps, {
    delay: newTaglineDelay + 4,
    direction: "left",
  });

  // ─── Phase 9: Zoom into flow.py tab + fade everything else ───────
  const tabZoomDelay = 808;
  const tabZoomDuration = 40; // ~1.5x faster, no spring deceleration
  const tabZoomP = interpolate(
    frame,
    [tabZoomDelay, tabZoomDelay + tabZoomDuration],
    [0, 1],
    { easing: Easing.bezier(0.3, 0, 1, 1), ...clamp },
  );

  // flow.py tab center in editor-local coords:
  // sidebar(560) + Browser tab(~320) + half flow.py tab(~100) = 980
  // titleBar(72) + half tabHeight(36) = 108
  const flowTabLocalX = 980;
  const flowTabLocalY = 108;
  // Convert to screen coords
  const flowTabScreenX = editorLeft + flowTabLocalX;
  const flowTabScreenY = editorFinalTop + flowTabLocalY;
  // Zoom target: scale up so tab is prominent but still visible in context
  const tabZoomScale = 5;
  // Translate so flow.py tab lands at screen center
  const tabZoomTx = interpolate(tabZoomP, [0, 1], [0, FRAME_WIDTH / 2 - flowTabScreenX], clamp);
  const tabZoomTy = interpolate(tabZoomP, [0, 1], [0, FRAME_HEIGHT / 2 - flowTabScreenY], clamp);
  const tabZoomS = interpolate(tabZoomP, [0, 1], [1, tabZoomScale], clamp);

  // Fade out taglines during zoom (3x faster)
  const taglineFadeP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 234 },
    delay: tabZoomDelay,
  });
  const taglineZoomFade = interpolate(taglineFadeP, [0, 1], [1, 0], clamp);

  // New header after zoom completes (20 frames earlier)
  const runHeaderDelay = tabZoomDelay + 10;
  const {
    containerStyle: runHeaderContainer,
    contentStyle: runHeaderContent,
  } = useMaskedRise(frame, fps, {
    delay: runHeaderDelay,
    yOffset: 40,
    springConfig: { damping: 200, stiffness: 120 },
  });
  const runHeaderWipe = useWipeReveal(frame, fps, {
    delay: runHeaderDelay + 4,
    direction: "left",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Intro content — swipes up and fades out */}
      <AbsoluteFill
        style={{
          transform: `translateY(${contentSwipeY}px)`,
          opacity: contentSwipeOpacity,
        }}
      >
        {/* Logo */}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              transform: `translateX(${logoShiftX}px) translateY(${logoShiftY}px) scale(${logoScale * logoScaleDown * lockupScale}) rotate(${logoRotate}deg)`,
              transformOrigin: "center center",
            }}
          >
            <LogoIcon />
          </div>
        </AbsoluteFill>

        {/* Title lockup */}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
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
            <div
              style={{ ...titleContainer, position: "relative", zIndex: 2 }}
            >
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
            <div
              style={{
                marginTop: 28,
                ...subheaderContainer,
                position: "relative",
                zIndex: 2,
              }}
            >
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

        {/* Feature headline */}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
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

      {/* Editor — peeks from bottom, shakes, then rises to fill */}
      <div
        style={{
          position: "absolute",
          left: editorLeft,
          top: editorTop,
          width: ideWidth,
          height: ideHeight,
          zIndex: 10,
          borderRadius: 20,
          overflow: "hidden",
          transformOrigin: `${flowTabLocalX}px ${flowTabLocalY}px`,
          transform: `translate(${tabZoomTx}px, ${tabZoomTy}px) scale(${tabZoomS})`,
        }}
      >
        <EditorPeek
          baseDelay={135}
          containerWidth={ideWidth}
          containerHeight={ideHeight}
          pythonTabDelay={716}
          contentFadeDelay={818}
        />
      </div>

      {/* Tagline — appears once editor is prominent, flips to new text at frame 555 */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 80,
          zIndex: 20,
          pointerEvents: "none",
          opacity: taglineZoomFade,
        }}
      >
        {/* Old tagline — exits right at flip */}
        <div
          style={{
            ...taglineContainer,
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            transform: `translateX(${oldTaglineX}px)`,
            opacity: oldTaglineOpacity,
          }}
        >
          <div
            style={{
              ...taglineContent,
              ...taglineWipe,
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 400,
              color: "#333333",
              textAlign: "center",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
              ...TEXT_FINISH,
            }}
          >
            Prompt Simplex's agent to create{" "}
            <span style={{ color: INDIGO }}>
              reusable browser automation code
            </span>
          </div>
        </div>

        {/* New tagline — enters from left after flip */}
        {frame >= taglineFlipDelay && (
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              transform: `translateX(${newTaglineX}px)`,
              opacity: newTaglineOpacity,
            }}
          >
            <div>
              <div
                style={{
                  ...newTagWipe,
                  fontFamily: FONT_FAMILY,
                  fontSize: 72,
                  fontWeight: 400,
                  color: "#333333",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                  ...TEXT_FINISH,
                }}
              >
                Browser automation code is stored in{" "}
                <span style={{ color: INDIGO, fontWeight: 600 }}>
                  a python file you can edit
                </span>
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* New header — appears after zoom into flow.py tab */}
      {frame >= runHeaderDelay - 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 80,
            zIndex: 40,
            pointerEvents: "none",
          }}
        >
          <div style={runHeaderContainer}>
            <div
              style={{
                ...runHeaderContent,
                ...runHeaderWipe,
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 400,
                color: "#333333",
                textAlign: "center",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                ...TEXT_FINISH,
              }}
            >
              Run your browser automation{" "}
              <span style={{ color: INDIGO, fontWeight: 600 }}>
                reliably for future sessions
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
