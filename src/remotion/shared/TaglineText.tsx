import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  useGradientFill,
  useGrowingUnderline,
  useMaskedRise,
  useWipeReveal,
  useWordDragIn,
} from "./animations";

const TOP_WORDS = ["Automate", "web", "workflows", "for", "your", "customers"];
const BOTTOM_WORDS = ["Try", "Simplex", "at"];

export const TaglineText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topRise = useMaskedRise(frame, fps, {
    delay: 0,
    yOffset: 52,
    springConfig: { damping: 200, stiffness: 120 },
  });
  const bottomRise = useMaskedRise(frame, fps, {
    delay: 18,
    yOffset: 54,
    springConfig: { damping: 200, stiffness: 120 },
  });
  const urlWipe = useWipeReveal(frame, fps, { delay: 26, direction: "left" });
  const urlFill = useGradientFill(frame, fps, {
    delay: 30,
    color: "#6366F1",
    baseColor: "#B6BEFF",
  });
  const underline = useGrowingUnderline(frame, fps, {
    delay: 34,
    height: 5,
    color: "#6366F1",
    direction: "center",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 2640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 312,
        }}
      >
        <div
          style={{
            ...topRise.containerStyle,
            transform: "translateY(-60px)",
          }}
        >
          <div
            style={{
              ...topRise.contentStyle,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.28em",
              fontFamily: FONT_FAMILY,
              fontSize: 122,
              lineHeight: 1,
            }}
          >
            {TOP_WORDS.map((word, index) => {
              const motion = useWordDragIn(frame, fps, {
                index,
                stagger: 3,
                baseDelay: 2,
              });
              return (
                <span
                  key={word}
                  style={{
                    ...motion,
                    ...TEXT_FINISH,
                    fontWeight: word === "Automate" ? 600 : 400,
                    color: word === "Automate" ? "#5A63F0" : "#1E2440",
                  }}
                >
                  {word}
                </span>
              );
            })}
            <span
              style={{
                ...useWordDragIn(frame, fps, {
                  index: TOP_WORDS.length,
                  stagger: 3,
                  baseDelay: 2,
                }),
                ...TEXT_FINISH,
                ...urlFill,
                fontWeight: 600,
              }}
            >
              with Simplex
            </span>
          </div>
        </div>

        <div
          style={{
            ...bottomRise.containerStyle,
            transform: "translateY(60px)",
          }}
        >
          <div
            style={{
              ...bottomRise.contentStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              fontFamily: FONT_FAMILY,
              fontSize: 114,
              lineHeight: 1,
            }}
          >
            <div style={{ display: "flex", gap: "0.28em" }}>
              {BOTTOM_WORDS.map((word, index) => {
                const motion = useWordDragIn(frame, fps, {
                  index,
                  stagger: 3,
                  baseDelay: 22,
                  origin: "center top",
                });
                return (
                  <span
                    key={word}
                    style={{
                      ...motion,
                      ...TEXT_FINISH,
                      color: "#1E2440",
                      fontWeight: 400,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            <div style={{ ...urlWipe, display: "inline-flex", flexDirection: "column" }}>
              <span
                style={{
                  ...TEXT_FINISH,
                  ...urlFill,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                https://simplex.sh
              </span>
              <div style={{ marginTop: 8 }}>
                <div style={underline} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
