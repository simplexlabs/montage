import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  useGradientFill,
  useLetterPopIn,
  useMaskedRise,
} from "./animations";

const WORD = "Simplex";

export const SimplexText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = useMaskedRise(frame, fps, {
    delay: 0,
    yOffset: 110,
    springConfig: { damping: 18, stiffness: 120 },
  });
  const letterGradient = useGradientFill(frame, fps, {
    delay: 6,
    color: "#4D58F2",
    baseColor: "#BDC4FF",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: "translateX(-280px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={rise.containerStyle}>
          <div
            style={{
              ...rise.contentStyle,
              fontFamily: FONT_FAMILY,
              fontSize: 288,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              display: "flex",
            }}
          >
            {WORD.split("").map((letter, index) => {
              const letterMotion = useLetterPopIn(frame, fps, {
                index,
                stagger: 2,
                springConfig: { damping: 17, stiffness: 220 },
              });

              return (
                <span
                  key={index}
                  style={{
                    ...letterMotion,
                    ...TEXT_FINISH,
                    ...letterGradient,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
