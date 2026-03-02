import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const COMMAND = "npx skills add remotion-dev/skills";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const DELAY_SECONDS = 0.8;
const POST_TYPING_PAUSE = 0.6;

const OUTPUT_LINES = [
  { text: "" },
  { text: "███████╗██╗  ██╗██╗██╗     ██╗     ███████╗", color: "#888" },
  { text: "██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝", color: "#888" },
  { text: "███████╗█████╔╝ ██║██║     ██║     ███████╗", color: "#777" },
  { text: "╚════██║██╔═██╗ ██║██║     ██║     ╚════██║", color: "#666" },
  { text: "███████║██║  ██╗██║███████╗███████╗███████║", color: "#555" },
  { text: "╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝", color: "#444" },
  { text: "" },
  { text: "┌  skills", color: "#A0A0A0" },
  { text: "│", color: "#A0A0A0" },
  { text: "◇  Source: github.com/remotion-dev/skills.git", color: "#5AF78E" },
  { text: "│", color: "#A0A0A0" },
  { text: "◇  Repository cloned", color: "#5AF78E" },
  { text: "│", color: "#A0A0A0" },
  { text: "◇  Found 1 skill", color: "#5AF78E" },
  { text: "│", color: "#A0A0A0" },
  { text: "●  Skill: remotion-best-practices", color: "#BD93F9" },
  { text: "│", color: "#A0A0A0" },
  { text: "│  Best practices for Remotion - Video creation in React", color: "#E0E0E0" },
  { text: "│", color: "#A0A0A0" },
  { text: "◇  41 agents detected", color: "#5AF78E" },
  { text: "│", color: "#A0A0A0" },
  { text: "◆  Which agents do you want to install to?", color: "#BD93F9" },
  { text: "│", color: "#A0A0A0" },
  { text: "│  ── Universal (.agents/skills) ── always included ──", color: "#A0A0A0" },
  { text: "│    • Amp", color: "#E0E0E0" },
  { text: "│    • Cursor", color: "#E0E0E0" },
  { text: "│    • Claude Code", color: "#E0E0E0" },
  { text: "│    • GitHub Copilot", color: "#E0E0E0" },
  { text: "│    • Gemini CLI", color: "#E0E0E0" },
];

const LINE_STAGGER_SECONDS = 0.05;

const OUTPUT_FONT_SIZE = 29;
const OUTPUT_LINE_HEIGHT = 1.4;

export const TerminalContent: React.FC<{ fontFamily: string }> = ({
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(fps * DELAY_SECONDS);
  const typingFrame = Math.max(0, frame - delayFrames);
  const typedChars = Math.min(
    COMMAND.length,
    Math.floor(typingFrame / CHAR_FRAMES),
  );
  const typedText = COMMAND.slice(0, typedChars);
  const doneTyping = typedChars >= COMMAND.length;

  // Frame when typing finishes
  const typingEndFrame = delayFrames + COMMAND.length * CHAR_FRAMES;
  const postTypingPauseFrames = Math.round(fps * POST_TYPING_PAUSE);
  const outputStartFrame = typingEndFrame + postTypingPauseFrames;

  // Calculate which output lines are visible (uniform 50ms stagger)
  const staggerFrames = Math.round(fps * LINE_STAGGER_SECONDS);
  const visibleLines: Array<{ text: string; color: string }> = [];

  if (frame >= outputStartFrame) {
    const outputFrame = frame - outputStartFrame;
    for (let i = 0; i < OUTPUT_LINES.length; i++) {
      if (outputFrame >= i * staggerFrames) {
        visibleLines.push({
          text: OUTPUT_LINES[i].text,
          color: OUTPUT_LINES[i].color ?? "#E0E0E0",
        });
      }
    }
  }

  const showCursorOnPrompt = !doneTyping;

  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        fontFamily,
        color: "#E0E0E0",
      }}
    >
      {/* Command line */}
      <div style={{ fontSize: 67, lineHeight: 1.5 }}>
        <span style={{ color: "#5AF78E" }}>&#10095;</span>{" "}
        <span>{typedText}</span>
        {showCursorOnPrompt && (
          <span
            style={{
              display: "inline-block",
              width: 32,
              height: 77,
              backgroundColor: "#E0E0E0",
              verticalAlign: "text-bottom",
              marginLeft: 2,
            }}
          />
        )}
      </div>

      {/* Output lines */}
      {visibleLines.length > 0 && (
        <div style={{ marginTop: 26, fontSize: OUTPUT_FONT_SIZE, lineHeight: OUTPUT_LINE_HEIGHT }}>
          {visibleLines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.color,
                whiteSpace: "pre",
                minHeight: OUTPUT_FONT_SIZE * OUTPUT_LINE_HEIGHT,
              }}
            >
              {line.text}
            </div>
          ))}
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 32,
              backgroundColor: "#E0E0E0",
              verticalAlign: "text-bottom",
              opacity: cursorOpacity,
            }}
          />
        </div>
      )}
    </div>
  );
};
