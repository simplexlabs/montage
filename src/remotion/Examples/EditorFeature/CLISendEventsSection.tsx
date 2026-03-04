import { AbsoluteFill } from "remotion";
import { AnimatedLines } from "../../shared/AnimatedLines";

const HEADING_LINES = [
  { text: "Feed structured form data into your", color: "#000000" },
  { text: "AI context engine,", color: "#818CF8" },
  { text: "or match it to internal schemas", color: "#000000" },
];

export const CLISendEventsSection: React.FC = () => {
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 64,
        }}
      >
        <AnimatedLines
          lines={HEADING_LINES}
          animation="wordDragIn"
          stagger={10}
          delay={0}
          fontSize={128}
          fontWeight={400}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
