import { interpolate, interpolateColors, spring } from "remotion";
import { TEXT_FINISH } from "../../shared/animations";
import {
  FILESYSTEM_CODE_PADDING_X,
  FILESYSTEM_CODE_PADDING_Y,
  FILESYSTEM_CONTENT_PADDING,
  FILESYSTEM_GAP,
  FILESYSTEM_TOP_BAR_HEIGHT,
  FILESYSTEM_WIDTH,
  FORM_HEIGHT,
  JSON_FONT_SIZE,
  JSON_LINE_HEIGHT_MULTIPLIER,
  JSON_OPTIONS_START_LINE_INDEX,
  LEFT_PANE_WIDTH,
  MEDICAL_OPTIONS,
  OPTION_GAP,
  OPTION_HEIGHT,
  TEXT_SQUISH_DURATION,
  TEXT_SQUISH_START,
  TEXT_TRANSFER_DURATION,
  TEXT_TRANSFER_STAGGER,
  TEXT_TRANSFER_START,
  XRAY_TOP,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const FORM_SOURCE_TEXT_X = 152;
const FORM_SOURCE_TEXT_Y_START = XRAY_TOP + 154;
const PANEL_LEFT = LEFT_PANE_WIDTH + FILESYSTEM_GAP;
const FINAL_OPTION_X = PANEL_LEFT + FILESYSTEM_CONTENT_PADDING + FILESYSTEM_CODE_PADDING_X;
const FINAL_OPTION_Y_START =
  FILESYSTEM_TOP_BAR_HEIGHT +
  FILESYSTEM_CONTENT_PADDING +
  FILESYSTEM_CODE_PADDING_Y +
  JSON_OPTIONS_START_LINE_INDEX * JSON_FONT_SIZE * JSON_LINE_HEIGHT_MULTIPLIER;
const FINAL_OPTION_Y_GAP = JSON_FONT_SIZE * JSON_LINE_HEIGHT_MULTIPLIER;

type OptionTextTransferOverlayProps = {
  frame: number;
  fps: number;
  leftShiftX: number;
  leftScale: number;
};

export const OptionTextTransferOverlay: React.FC<OptionTextTransferOverlayProps> = ({
  frame,
  fps,
  leftShiftX,
  leftScale,
}) => {
  const formCenterX = LEFT_PANE_WIDTH / 2;
  const formCenterY = FORM_HEIGHT / 2;
  const squishP = spring({
    frame,
    fps,
    delay: TEXT_SQUISH_START,
    durationInFrames: TEXT_SQUISH_DURATION,
    config: { damping: 200, stiffness: 130 },
  });
  const overlayFade = interpolate(squishP, [0, 0.86, 1], [1, 1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        width: LEFT_PANE_WIDTH + FILESYSTEM_GAP + FILESYSTEM_WIDTH,
        height: FORM_HEIGHT,
      }}
    >
      {MEDICAL_OPTIONS.map((option, index) => {
        const sourceRowY = FORM_SOURCE_TEXT_Y_START + index * (OPTION_HEIGHT + OPTION_GAP);
        const finalY = FINAL_OPTION_Y_START + index * FINAL_OPTION_Y_GAP;
        const transferP = spring({
          frame,
          fps,
          delay: TEXT_TRANSFER_START + index * TEXT_TRANSFER_STAGGER,
          durationInFrames: TEXT_TRANSFER_DURATION,
          config: { damping: 200, stiffness: 150 },
        });
        const transferOpacity = interpolate(transferP, [0, 0.16, 1], [0, 1, 1], clamp);
        const sourceX =
          formCenterX + (FORM_SOURCE_TEXT_X - formCenterX) * leftScale + leftShiftX;
        const sourceY = formCenterY + (sourceRowY - formCenterY) * leftScale;
        const transferX = interpolate(transferP, [0, 1], [sourceX, FINAL_OPTION_X], clamp);
        const transferY = sourceY;
        const x = interpolate(squishP, [0, 1], [transferX, FINAL_OPTION_X], clamp);
        const y = interpolate(squishP, [0, 1], [transferY, finalY], clamp);
        const fontSize = interpolate(squishP, [0, 1], [24, JSON_FONT_SIZE], clamp);
        const lineOpacity = transferOpacity * overlayFade;
        const transferColor = interpolateColors(transferP, [0, 1], ["#111827", "#569CD6"]);
        const displayText =
          squishP > 0.25
            ? `      "${option}"${index === MEDICAL_OPTIONS.length - 1 ? "" : ","}`
            : option;

        return (
          <span
            key={option}
            style={{
              ...TEXT_FINISH,
              position: "absolute",
              left: x,
              top: y,
              fontFamily: "monospace",
              fontSize,
              fontWeight: 500,
              lineHeight: JSON_LINE_HEIGHT_MULTIPLIER,
              color: transferColor,
              opacity: lineOpacity,
              whiteSpace: "pre",
              textShadow: "0 0 12px rgba(86, 156, 214, 0.26)",
            }}
          >
            {displayText}
          </span>
        );
      })}
    </div>
  );
};
