import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { usePanelReveal } from "../shared/animations";
import { AnimatedLines } from "../shared/AnimatedLines";
import { CLITerminal, CommandBlock } from "./CLITerminal";

const HEADING_LINES = [
  { text: "Run workflows", color: "#000000" },
  { text: "at scale", color: "#818CF8" },
];

const COMMANDS: CommandBlock[] = [
  {
    command: "simplex run 8db8d54c --watch",
    delay: 20,
    outputDelay: 12,
    output: [
      { text: "Session ID │ 68db06e1-fba8-4e2d-915b-44530a5cf805", color: "#E0E0E0" },
      { text: "VNC URL    │ https://ta-01kje5crfphtj7n627b25m5xnb-6080...", color: "#A0A0A0" },
      { text: "Logs URL   │ https://ta-01kje5crfphtj7n627b25m5xnb-7777...", color: "#A0A0A0" },
    ],
  },
  {
    command: "simplex workflows list",
    delay: 88,
    outputDelay: 12,
    output: [
      { text: "┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┓", color: "#BD93F9" },
      { text: "┃ ID           ┃ Name                      ┃ Metadata   ┃", color: "#BD93F9" },
      { text: "┡━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━┩", color: "#BD93F9" },
      { text: "│ 8db8d54c-0e4 │ CLI Demo                  │ {}         │", color: "#E0E0E0" },
      { text: "│ 3d1890d5-534 │ RT Example GL Form        │ {}         │", color: "#E0E0E0" },
      { text: "│ 932671eb-405 │ ServproMock                │ {}         │", color: "#E0E0E0" },
      { text: "│ cb76e123-dab │ Netsuite Example           │ {}         │", color: "#E0E0E0" },
      { text: "└──────────────┴───────────────────────────┴────────────┘", color: "#BD93F9" },
    ],
  },
];

export const CLIRunSection: React.FC = () => {
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
          animation="wordDragIn"
          stagger={10}
          delay={0}
          fontSize={128}
          fontWeight={400}
        />
      </AbsoluteFill>

      {/* Terminal — slides in from right */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 160,
        }}
      >
        <div style={usePanelReveal(frame, fps, { from: "right", distance: 192, delay: 8, springConfig: { damping: 20, stiffness: 100 } })}>
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
