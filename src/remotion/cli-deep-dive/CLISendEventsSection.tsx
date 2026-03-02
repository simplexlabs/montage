import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { usePanelReveal } from "../shared/animations";
import { AnimatedLines } from "../shared/AnimatedLines";
import { CLITerminal, CommandBlock } from "./CLITerminal";
const INDIGO = "#6366F1";

const HEADING_LINES = [
  { text: "Control the browser with", color: "#000000" },
  { text: "natural language", color: INDIGO },
];

const COMMANDS: CommandBlock[] = [
  {
    command: 'simplex send 8db8d54c "Click the login button"',
    delay: 24,
    outputDelay: 11,
    output: [
      { text: "Message sent.", color: "#5AF78E" },
    ],
  },
  {
    command: "simplex sessions events 8db8d54c",
    delay: 92,
    outputDelay: 12,
    output: [
      { text: "" },
      { text: "Prompt: Click the login button", color: "#BD93F9" },
      { text: "Agent started", color: "#61AFEF" },
      { text: "" },
      { text: "  > mcp__custom-browser__screenshot", color: "#A0A0A0" },
      { text: "The page shows the Example Domain placeholder", color: "#E0E0E0" },
      { text: "page at https://example.com/. It contains:", color: "#E0E0E0" },
      { text: "" },
      { text: '- A heading: "Example Domain"', color: "#E0E0E0" },
      { text: '- A "Learn more" link', color: "#E0E0E0" },
      { text: "Completed", color: "#5AF78E" },
      { text: "" },
      { text: "Next Index │ 9    ", color: "#A0A0A0" },
      { text: "Total      │ 9    ", color: "#A0A0A0" },
      { text: "Has More   │ False", color: "#A0A0A0" },
    ],
  },
];

export const CLISendEventsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Heading */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 64,
        }}
      >
        <AnimatedLines
          lines={HEADING_LINES}
          animation="maskedRise"
          stagger={8}
          delay={0}
          fontSize={115}
        />
      </AbsoluteFill>

      {/* Terminal — slides in from left */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 160,
        }}
      >
        <div style={usePanelReveal(frame, fps, { from: "left", distance: 192, delay: 8, springConfig: { damping: 20, stiffness: 100 } })}>
          <CLITerminal
            commands={COMMANDS}
            width={2720}
            height={1248}
            fontSize={54}
            outputFontSize={34}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
