import { FONT_FAMILY, TEXT_FINISH } from "../shared/animations";
import { interpolate, spring } from "remotion";
import {
  BROWSER_BAR_HEIGHT,
  FORM_HEIGHT,
  OPTIONS_REVEAL_START,
  QUESTION_REVEAL_START,
  XRAY_TOP,
} from "./xrayConstants";
import { IntakeOptionTexts } from "./IntakeOptionTexts";

type IntakeQuestionnaireFormProps = {
  frame: number;
  fps: number;
  overlay?: React.ReactNode;
};

export const IntakeQuestionnaireForm: React.FC<IntakeQuestionnaireFormProps> = ({
  frame,
  fps,
  overlay,
}) => {
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const questionReveal = spring({
    frame,
    fps,
    delay: QUESTION_REVEAL_START,
    durationInFrames: 18,
    config: { damping: 200, stiffness: 140 },
  });
  const questionOpacity = interpolate(questionReveal, [0, 1], [0, 1], clamp);
  const questionY = interpolate(questionReveal, [0, 1], [36, 0], clamp);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 26,
        border: "1px solid rgba(84, 95, 154, 0.18)",
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.16)",
        height: FORM_HEIGHT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: BROWSER_BAR_HEIGHT,
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          gap: 14,
          backgroundColor: "rgba(250, 252, 255, 0.95)",
        }}
      >
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: dot === 0 ? "#F87171" : dot === 1 ? "#FBBF24" : "#34D399",
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            height: 52,
            flex: 1,
            borderRadius: 26,
            backgroundColor: "#EEF2FF",
            border: "1px solid #D7DDFC",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 400,
              color: "#4A5383",
              ...TEXT_FINISH,
            }}
          >
            https://availity.com/prior-auth
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: BROWSER_BAR_HEIGHT + 62,
          left: 56,
          right: 56,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#111827",
            ...TEXT_FINISH,
          }}
        >
          Prior Authorization Request
        </h1>
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: XRAY_TOP,
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
        }}
      >
        <h3
          style={{
            fontFamily: "Geist, SF Pro Display, sans-serif",
            fontSize: 66,
            fontWeight: 500,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            ...TEXT_FINISH,
          }}
        >
          Do any of these health conditions apply to you?
        </h3>
        <IntakeOptionTexts
          frame={frame}
          fps={fps}
          revealStart={OPTIONS_REVEAL_START}
        />
      </div>

      {overlay}
    </div>
  );
};
