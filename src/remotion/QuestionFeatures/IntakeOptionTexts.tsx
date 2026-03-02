import { TEXT_FINISH } from "../shared/animations";
import { interpolate, spring } from "remotion";
import {
  MEDICAL_OPTIONS,
  OPTION_REVEAL_STAGGER,
  OPTION_GAP,
  OPTION_HEIGHT,
} from "./xrayConstants";

const IntakeOptionText: React.FC<{ label: string }> = ({ label }) => {
  return (
    <span
      style={{
        fontFamily: "Geist, SF Pro Display, sans-serif",
        fontSize: 44,
        fontWeight: 400,
        lineHeight: 1.22,
        color: "#374151",
        ...TEXT_FINISH,
      }}
    >
      {label}
    </span>
  );
};

type IntakeOptionTextsProps = {
  frame: number;
  fps: number;
  revealStart: number;
};

export const IntakeOptionTexts: React.FC<IntakeOptionTextsProps> = ({
  frame,
  fps,
  revealStart,
}) => {
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;

  return (
    <div style={{ marginTop: 28 }}>
      {MEDICAL_OPTIONS.map((label, index) => {
        const rowP = spring({
          frame,
          fps,
          delay: revealStart + index * OPTION_REVEAL_STAGGER,
          durationInFrames: 18,
          config: { damping: 200, stiffness: 150 },
        });
        const rowOpacity = interpolate(rowP, [0, 1], [0, 1], clamp);
        const rowY = interpolate(rowP, [0, 1], [26, 0], clamp);

        return (
          <div
            key={label}
            style={{
              minHeight: OPTION_HEIGHT,
              borderRadius: 12,
              border: "2px solid rgba(0, 0, 0, 0.18)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              padding: "0 28px",
              marginBottom: index === MEDICAL_OPTIONS.length - 1 ? 0 : OPTION_GAP,
              opacity: rowOpacity,
              transform: `translateY(${rowY}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 6,
                border: "4px solid #6366F1",
                marginRight: 20,
                backgroundColor: "#ffffff",
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.7)",
              }}
            />
            <IntakeOptionText label={label} />
          </div>
        );
      })}
    </div>
  );
};
