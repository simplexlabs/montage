import { Easing, interpolate } from "remotion";
import {
  FORM_HEIGHT,
  LEFT_PANE_WIDTH,
  SCAN_START,
  SCAN_DURATION,
  XRAY_HEIGHT,
  XRAY_TOP,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const IntakeScannerOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const scanEnd = SCAN_START + SCAN_DURATION;
  const scanProgress = interpolate(
    frame,
    [SCAN_START, scanEnd],
    [0, 1],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const scannerY = interpolate(scanProgress, [0, 1], [0, FORM_HEIGHT - 8], clamp);
  const scannerOpacity =
    frame < SCAN_START
      ? 0
      : interpolate(frame, [SCAN_START, scanEnd, scanEnd + 10], [1, 1, 0], clamp);

  const targetTop = XRAY_TOP - 45;
  const targetHeight = XRAY_HEIGHT;
  const antsProgress = interpolate(
    scannerY,
    [targetTop, targetTop + targetHeight],
    [0, 1],
    clamp,
  );
  const antsOpacity = frame < SCAN_START ? 0 : interpolate(antsProgress, [0, 0.05, 1], [0, 0.92, 0.98], clamp);
  const antsHeight = targetHeight * antsProgress;
  const antsOffset = frame < SCAN_START ? 0 : -7 * (frame - SCAN_START);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: scannerY,
          width: "100%",
          height: 8,
          backgroundColor: "#6366F1",
          boxShadow: "0 0 24px 10px rgba(99, 102, 241, 0.36)",
          opacity: scannerOpacity,
          zIndex: 100,
        }}
      />

      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: LEFT_PANE_WIDTH,
          height: FORM_HEIGHT,
          opacity: antsOpacity,
          zIndex: 101,
        }}
      >
        <rect
          x={14}
          y={targetTop}
          width={LEFT_PANE_WIDTH - 28}
          height={Math.max(1, antsHeight)}
          rx={10}
          fill="rgba(99, 102, 241, 0.08)"
          stroke="#6366F1"
          strokeWidth={6}
          strokeDasharray="24 8"
          strokeDashoffset={antsOffset}
        />
      </svg>
    </div>
  );
};
