import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { usePanelReveal } from "../../shared/animations";
import { CLITerminal, CommandBlock } from "./CLITerminal";

const COMMANDS: CommandBlock[] = [
  {
    command: "pip install simplex",
    delay: 8,
    outputDelay: 11,
    output: [
      { text: "" },
      { text: "Successfully installed simplex-3.0.4", color: "#5AF78E" },
    ],
  },
  {
    command: 'simplex editor -n "My Workflow" -u "https://example.com"',
    delay: 60,
    outputDelay: 11,
    output: [
      { text: "" },
      {
        text: "╭──────────────────────── Session Started ────────────────────────╮",
        color: "#BD93F9",
      },
      {
        text: "│                                                                 │",
        color: "#BD93F9",
      },
      {
        text: "│  Workflow  https://simplex.sh/workflow/8db8d54c-0e40...          │",
        color: "#E0E0E0",
      },
      {
        text: "│  Session   191edfd5-3060-4217-beef-ac8b25d17b18                  │",
        color: "#E0E0E0",
      },
      {
        text: "│  VNC       https://ta-01kje5d6rwwk7ej9tnjgssce9s-6080...         │",
        color: "#E0E0E0",
      },
      {
        text: "│                                                                 │",
        color: "#BD93F9",
      },
      {
        text: "╰──────────── Use 'simplex send' and 'simplex connect' ───────────╯",
        color: "#BD93F9",
      },
    ],
  },
];

export const CLIInstallSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelStyle = usePanelReveal(frame, fps, {
    from: "bottom",
    distance: 240,
    delay: 0,
    springConfig: { damping: 200, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={panelStyle}>
        <CLITerminal commands={COMMANDS} />
      </div>
    </AbsoluteFill>
  );
};
