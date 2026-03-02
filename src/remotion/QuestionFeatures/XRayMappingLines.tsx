import { AbsoluteFill, interpolate, spring } from "remotion";
import {
  FORM_TOP_GAP,
  LEFT_TOP_BAR_HEIGHT,
  LEFT_PANE_WIDTH,
  LINE_DURATION,
  MAPPING_START,
  MAPPING_STAGGER,
  MEDICAL_OPTIONS,
  OPTION_GAP,
  OPTION_HEIGHT,
  OPTIONS_TOP,
  PANE_GAP,
  XRAY_TOP,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type XRayMappingLinesProps = {
  frame: number;
  fps: number;
  mainLeft: number;
  formTop: number;
  leftPaneShiftX: number;
  rightPaneTranslateX: number;
  rightPaneOpacity: number;
};

export const XRayMappingLines: React.FC<XRayMappingLinesProps> = ({
  frame,
  fps,
  mainLeft,
  formTop,
  leftPaneShiftX,
  rightPaneTranslateX,
  rightPaneOpacity,
}) => {
  const sourceX = mainLeft + leftPaneShiftX + LEFT_PANE_WIDTH - 84;
  const targetX =
    mainLeft + LEFT_PANE_WIDTH + PANE_GAP + rightPaneTranslateX + 80;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        {MEDICAL_OPTIONS.map((option, index) => {
          const mapDelay = MAPPING_START + index * MAPPING_STAGGER;
          const mapP = spring({
            frame,
            fps,
            delay: mapDelay,
            durationInFrames: LINE_DURATION,
            config: { damping: 200, stiffness: 180 },
          });
          const drawP = interpolate(mapP, [0, 1], [0, 1], clamp);

          const y =
            formTop +
            LEFT_TOP_BAR_HEIGHT +
            FORM_TOP_GAP +
            XRAY_TOP +
            OPTIONS_TOP +
            index * (OPTION_HEIGHT + OPTION_GAP) +
            OPTION_HEIGHT / 2;

          const length = Math.max(1, targetX - sourceX);
          const opacity = interpolate(drawP, [0, 0.25, 1], [0, 0.85, 1], clamp);
          const dashOffset = length * (1 - drawP);

          return (
            <g key={option} opacity={opacity * rightPaneOpacity}>
              <line
                x1={sourceX}
                y1={y}
                x2={targetX}
                y2={y}
                stroke="#6366F1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={dashOffset}
              />
              <line
                x1={sourceX}
                y1={y}
                x2={targetX}
                y2={y}
                stroke="rgba(99, 102, 241, 0.45)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={dashOffset}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
