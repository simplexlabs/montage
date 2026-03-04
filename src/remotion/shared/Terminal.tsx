import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { AbsoluteFill } from "remotion";
import { TerminalContent } from "../Examples/cli-deep-dive/TerminalContent";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const TERMINAL_PADDING = 56;
const TITLE_BAR_HEIGHT = 52;

const TrafficLight: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  />
);

export const Terminal: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <div
          style={{
            width: 1280 - TERMINAL_PADDING * 2,
            height: 750,
            borderRadius: 12,
            overflow: "visible",
            boxShadow:
              "0 22px 70px 4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              height: TITLE_BAR_HEIGHT,
              backgroundColor: "#2D2D2D",
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              paddingRight: 20,
              gap: 8,
              borderBottom: "1px solid #1A1A1A",
              flexShrink: 0,
            }}
          >
            <TrafficLight color="#FF5F57" />
            <TrafficLight color="#FEBC2E" />
            <TrafficLight color="#28C840" />
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: monoFont,
                fontSize: 18,
                color: "#9E9E9E",
                fontWeight: 500,
                marginRight: 54,
              }}
            >
              Terminal
            </div>
          </div>

          {/* Terminal body */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1E1E1E",
              padding: 28,
            }}
          >
            <TerminalContent fontFamily={monoFont} />
          </div>
        </div>
    </AbsoluteFill>
  );
};
