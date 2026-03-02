import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY, TEXT_FINISH, usePanelReveal, useWordDragIn } from "../shared/animations";
import { IntakeQuestionnaireForm } from "./IntakeQuestionnaireForm";
import { IntakeScannerOverlay } from "./IntakeScannerOverlay";
import { OptionTextTransferOverlay } from "./OptionTextTransferOverlay";
import { SimplexFilesystemPanel } from "./SimplexFilesystemPanel";
import {
  FILESYSTEM_GAP,
  FILESYSTEM_PANEL_DELAY,
  FILESYSTEM_SHIFT_DURATION,
  FILESYSTEM_START,
  FILESYSTEM_WIDTH,
  FORM_HEIGHT,
  HEADING_TOP,
  LEFT_PANE_WIDTH,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const HEADING_WORDS = "Simplex's agents automatically scan for and store form details".split(" ");
const PURPLE_HEADING_WORDS = new Set(["scan", "for"]);

export const CLIInstallSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formReveal = usePanelReveal(frame, fps, {
    delay: 0,
    from: "bottom",
    distance: 140,
    springConfig: { damping: 200, stiffness: 120 },
  });
  const rightPanelReveal = usePanelReveal(frame, fps, {
    delay: FILESYSTEM_PANEL_DELAY,
    from: "right",
    distance: 220,
    springConfig: { damping: 200, stiffness: 130 },
  });
  const rightPanelOpacity =
    (typeof rightPanelReveal.opacity === "number" ? rightPanelReveal.opacity : 1) *
    (frame >= FILESYSTEM_PANEL_DELAY ? 1 : 0);
  const layoutShift = spring({
    frame,
    fps,
    delay: FILESYSTEM_START,
    durationInFrames: FILESYSTEM_SHIFT_DURATION,
    config: { damping: 200, stiffness: 140 },
  });
  const leftShiftX = interpolate(
    layoutShift,
    [0, 1],
    [(FILESYSTEM_WIDTH + FILESYSTEM_GAP) / 2, 0],
    clamp,
  );
  const leftScale = interpolate(layoutShift, [0, 1], [1, 0.9], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: HEADING_TOP,
        }}
      >
        <div
          style={{
            ...TEXT_FINISH,
            fontFamily: FONT_FAMILY,
            fontSize: 88,
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#000000",
            display: "flex",
            gap: "0.3em",
            whiteSpace: "nowrap",
          }}
        >
          {HEADING_WORDS.map((word, index) => {
            const wordStyle = useWordDragIn(frame, fps, { index, stagger: 3 });
            const normalizedWord = word.toLowerCase();
            const wordColor = PURPLE_HEADING_WORDS.has(normalizedWord) ? "#6366F1" : "#000000";

            return (
              <span key={`${word}-${index}`} style={{ ...wordStyle, color: wordColor }}>
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: LEFT_PANE_WIDTH + FILESYSTEM_GAP + FILESYSTEM_WIDTH,
            height: FORM_HEIGHT,
            display: "flex",
            alignItems: "center",
            gap: FILESYSTEM_GAP,
            position: "relative",
          }}
        >
          <div style={{ width: LEFT_PANE_WIDTH, ...formReveal }}>
            <div
              style={{
                transform: `translateX(${leftShiftX}px) scale(${leftScale})`,
                transformOrigin: "center center",
              }}
            >
              <IntakeQuestionnaireForm
                frame={frame}
                fps={fps}
                overlay={<IntakeScannerOverlay frame={frame} />}
              />
            </div>
          </div>

          <div
            style={{
              width: FILESYSTEM_WIDTH,
              ...rightPanelReveal,
              opacity: rightPanelOpacity,
            }}
          >
            <SimplexFilesystemPanel
              frame={frame}
              fps={fps}
              baseDelay={FILESYSTEM_START + 6}
              height={FORM_HEIGHT}
            />
          </div>

          <OptionTextTransferOverlay
            frame={frame}
            fps={fps}
            leftShiftX={leftShiftX}
            leftScale={leftScale}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
