import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const TITLE_BAR_HEIGHT = 83;
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const LINE_STAGGER_FRAMES = 2;

const TrafficLight: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  />
);

export type OutputLine = {
  text: string;
  color?: string;
};

export type CommandBlock = {
  command: string;
  delay: number;
  output: OutputLine[];
  outputDelay?: number;
};

export const CLITerminal: React.FC<{
  commands: CommandBlock[];
  width?: number;
  height?: number;
  fontSize?: number;
  outputFontSize?: number;
}> = ({
  commands,
  width = 2880,
  height = 1440,
  fontSize = 58,
  outputFontSize = 35,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const renderedBlocks: React.ReactNode[] = [];

  let activeCommandIndex = -1;
  for (let i = commands.length - 1; i >= 0; i--) {
    if (frame >= commands[i].delay) {
      activeCommandIndex = i;
      break;
    }
  }

  for (let bi = 0; bi <= activeCommandIndex; bi++) {
    const block = commands[bi];
    const blockFrame = frame - block.delay;
    if (blockFrame < 0) continue;

    const typedChars = Math.min(
      block.command.length,
      Math.floor(blockFrame / CHAR_FRAMES),
    );
    const typedText = block.command.slice(0, typedChars);
    const doneTyping = typedChars >= block.command.length;
    const isCurrentBlock = bi === activeCommandIndex;

    const typingEndFrame = block.command.length * CHAR_FRAMES;
    const outputPause = block.outputDelay ?? Math.round(fps * 0.4);
    const outputStartFrame = block.delay + typingEndFrame + outputPause;

    const visibleLines: OutputLine[] = [];
    if (frame >= outputStartFrame) {
      const outputFrame = frame - outputStartFrame;
      for (let i = 0; i < block.output.length; i++) {
        if (outputFrame >= i * LINE_STAGGER_FRAMES) {
          visibleLines.push(block.output[i]);
        }
      }
    }

    renderedBlocks.push(
      <div key={bi} style={{ marginBottom: 19 }}>
        <div style={{ fontSize, lineHeight: 1.5 }}>
          <span style={{ color: "#5AF78E" }}>&#10095;</span>{" "}
          <span>{typedText}</span>
          {isCurrentBlock && !doneTyping && (
            <span
              style={{
                display: "inline-block",
                width: Math.round(fontSize * 0.45),
                height: Math.round(fontSize * 1.1),
                backgroundColor: "#E0E0E0",
                verticalAlign: "text-bottom",
                marginLeft: 3,
              }}
            />
          )}
        </div>
        {visibleLines.length > 0 && (
          <div
            style={{
              marginTop: 13,
              fontSize: outputFontSize,
              lineHeight: 1.5,
            }}
          >
            {visibleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.color ?? "#E0E0E0",
                  whiteSpace: "pre",
                  minHeight: outputFontSize * 1.5,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        )}
        {isCurrentBlock && doneTyping && visibleLines.length > 0 && (
          <span
            style={{
              display: "inline-block",
              width: Math.round(outputFontSize * 0.5),
              height: Math.round(outputFontSize * 1.1),
              backgroundColor: "#E0E0E0",
              verticalAlign: "text-bottom",
              opacity: cursorOpacity,
              marginTop: 6,
            }}
          />
        )}
      </div>,
    );
  }

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 26,
        overflow: "visible",
        boxShadow:
          "0 35px 112px 6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: TITLE_BAR_HEIGHT,
          backgroundColor: "#2D2D2D",
          display: "flex",
          alignItems: "center",
          paddingLeft: 32,
          paddingRight: 32,
          gap: 13,
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
            fontSize: 29,
            color: "#9E9E9E",
            fontWeight: 500,
            marginRight: 86,
          }}
        >
          Terminal
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#1E1E1E",
          padding: 45,
          fontFamily: monoFont,
          color: "#E0E0E0",
          overflow: "visible",
        }}
      >
        {renderedBlocks}
      </div>
    </div>
  );
};

export const CLITerminalSection: React.FC<{
  commands: CommandBlock[];
  width?: number;
  height?: number;
  fontSize?: number;
  outputFontSize?: number;
}> = (props) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CLITerminal {...props} />
    </AbsoluteFill>
  );
};
