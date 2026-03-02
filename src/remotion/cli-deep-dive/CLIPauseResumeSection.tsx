import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useScalePop } from "../shared/animations";
import { AnimatedLines } from "../shared/AnimatedLines";
import { CLITerminal, CommandBlock } from "./CLITerminal";

const HEADING_LINES = [
  { text: "Stay in control", color: "#000000", fontSize: 128, fontWeight: 700 },
  { text: "Pause, inspect, and resume at any point", color: "#666666", fontSize: 61, fontWeight: 400 },
];

const COMMANDS: CommandBlock[] = [
  {
    command: "simplex pause 8db8d54c",
    delay: 24,
    outputDelay: 11,
    output: [
      { text: "Session paused.", color: "#EAB308" },
      { text: "Pause Key │ external_pause_cc9d1091", color: "#A0A0A0" },
    ],
  },
  {
    command: "simplex sessions status 191edfd5",
    delay: 82,
    outputDelay: 9,
    output: [
      { text: "In Progress │ True ", color: "#E0E0E0" },
      { text: "Success     │ None ", color: "#E0E0E0" },
      { text: "Paused      │ True ", color: "#EAB308" },
    ],
  },
  {
    command: "simplex resume 8db8d54c",
    delay: 140,
    outputDelay: 11,
    output: [
      { text: "Session resumed.", color: "#5AF78E" },
      { text: "Pause Type │ external", color: "#A0A0A0" },
    ],
  },
];

export const CLIPauseResumeSection: React.FC = () => {
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
          animation="wipeReveal"
          stagger={10}
          delay={0}
          style={{ gap: 19 }}
        />
      </AbsoluteFill>

      {/* Terminal — scale pop entrance */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 192,
        }}
      >
        <div style={useScalePop(frame, fps, { delay: 10, springConfig: { damping: 14, stiffness: 120, mass: 0.8 } })}>
          <CLITerminal
            commands={COMMANDS}
            width={2560}
            height={1120}
            fontSize={54}
            outputFontSize={35}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
