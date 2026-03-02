import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  FONT_FAMILY,
  useMaskedRise,
  useWipeReveal,
  useGradientFill,
  useWordDragIn,
  TEXT_FINISH,
  TEXT_LAYOUT_DEFAULTS,
  TEXT_LAYOUT_BODY_DEFAULTS,
} from "./animations";

type Animation = "maskedRise" | "wipeReveal" | "gradientFill" | "wordDragIn";

type LineConfig = {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  density?: "display" | "body";
};

const AnimatedLine: React.FC<{
  line: LineConfig;
  animation: Animation;
  delay: number;
  style?: React.CSSProperties;
}> = ({ line, animation, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  if (animation === "maskedRise") {
    const { containerStyle, contentStyle } = useMaskedRise(adjustedFrame, fps, {
      delay: 0,
      yOffset: 40,
    });
    return (
      <div style={{ ...containerStyle, ...style }}>
        <div style={{ ...contentStyle, color: line.color }}>
          {line.text}
        </div>
      </div>
    );
  }

  if (animation === "wipeReveal") {
    const wipeStyle = useWipeReveal(adjustedFrame, fps, {
      delay: 0,
      direction: "left",
    });
    return (
      <div style={{ ...wipeStyle, color: line.color, ...style }}>
        {line.text}
      </div>
    );
  }

  if (animation === "gradientFill") {
    const gradientStyle = useGradientFill(adjustedFrame, fps, {
      delay: 0,
      color: line.color ?? "#000000",
      baseColor: "rgba(0,0,0,0.12)",
    });
    return (
      <div style={{ ...gradientStyle, ...style }}>
        {line.text}
      </div>
    );
  }

  if (animation === "wordDragIn") {
    const words = line.text.split(" ");
    return (
      <div style={{ display: "flex", gap: "0.3em", ...style }}>
        {words.map((word, i) => {
          const wordStyle = useWordDragIn(adjustedFrame, fps, {
            index: i,
            stagger: 3,
          });
          return (
            <span key={i} style={{ ...wordStyle, color: line.color }}>
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  return <div style={{ color: line.color, ...style }}>{line.text}</div>;
};

export const AnimatedLines: React.FC<{
  lines: (string | LineConfig)[];
  animation?: Animation;
  stagger?: number;
  delay?: number;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  color?: string;
  style?: React.CSSProperties;
}> = ({
  lines,
  animation = "maskedRise",
  stagger = 8,
  delay = 0,
  fontSize = 72,
  fontWeight = 700,
  fontFamily = FONT_FAMILY,
  lineHeight = 1.15,
  textAlign = "center",
  color = "#000000",
  style,
}) => {
  const normalizedLines: LineConfig[] = lines.map((line) =>
    typeof line === "string"
      ? { text: line, color, fontSize, fontWeight }
      : { color, fontSize, fontWeight, ...line },
  );

  const getSpacingDefaults = (line: LineConfig): React.CSSProperties => {
    const resolvedFontSize = line.fontSize ?? fontSize;
    const resolvedDensity =
      line.density ?? (resolvedFontSize <= 48 ? "body" : "display");
    return resolvedDensity === "body"
      ? TEXT_LAYOUT_BODY_DEFAULTS
      : TEXT_LAYOUT_DEFAULTS;
  };

  return (
    <div
      style={{
        ...TEXT_FINISH,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        textAlign,
        display: "flex",
        flexDirection: "column",
        alignItems: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
        ...style,
      }}
    >
      {normalizedLines.map((line, i) => {
        const spacingDefaults = getSpacingDefaults(line);
        return (
        <AnimatedLine
          key={i}
          line={line}
          animation={animation}
          delay={delay + i * stagger}
          style={{
            ...spacingDefaults,
            fontSize: line.fontSize,
            fontWeight: line.fontWeight,
          }}
        />
        );
      })}
    </div>
  );
};
