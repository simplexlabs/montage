import { interpolate, spring } from "remotion";
import { FONT_FAMILY, TEXT_FINISH } from "../../shared/animations";
import {
  LINE_DURATION,
  JSON_ROWS_TOP,
  MAPPING_START,
  MAPPING_STAGGER,
  MEDICAL_OPTIONS,
  OPTION_GAP,
  OPTION_HEIGHT,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type StructuredDataPanelProps = {
  frame: number;
  fps: number;
  opacity: number;
  translateX: number;
  scale: number;
  marginTop: number;
  width: number;
};

export const StructuredDataPanel: React.FC<StructuredDataPanelProps> = ({
  frame,
  fps,
  opacity,
  translateX,
  scale,
  marginTop,
  width,
}) => {
  return (
    <div
      style={{
        width,
        marginTop,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformOrigin: "left top",
      }}
    >
      <div
        style={{
          borderRadius: 18,
          border: "2px solid rgba(255, 255, 255, 0.12)",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 26px 52px rgba(0, 0, 0, 0.25)",
          padding: "30px 30px 34px 30px",
          position: "relative",
          minHeight: 770,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8b949e",
            ...TEXT_FINISH,
          }}
        >
          Structured Data
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 25,
            lineHeight: 1.34,
            color: "#8b949e",
            marginTop: 18,
          }}
        >
          {"{"}
          <br />
          {"  "}
          <span style={{ color: "#7ee787" }}>"medical_conditions"</span>
          {": {"}
          <br />
          {"    "}
          <span style={{ color: "#7ee787" }}>"field_type"</span>
          {': '}
          <span style={{ color: "#a5d6ff" }}>"checkbox"</span>
          {","}
          <br />
          {"    "}
          <span style={{ color: "#7ee787" }}>"container"</span>
          {': '}
          <span style={{ color: "#a5d6ff" }}>"#medical-conditions-field"</span>
          {","}
          <br />
          {"    "}
          <span style={{ color: "#7ee787" }}>"options"</span>
          {": ["}
        </div>

        <div style={{ marginTop: JSON_ROWS_TOP }}>
          {MEDICAL_OPTIONS.map((option, index) => {
            const transferDelay =
              MAPPING_START + index * MAPPING_STAGGER + LINE_DURATION - 2;
            const transferP = spring({
              frame,
              fps,
              delay: transferDelay,
              durationInFrames: 12,
              config: { damping: 200, stiffness: 180 },
            });
            const rowOpacity = interpolate(transferP, [0, 0.2, 1], [0, 1, 1], clamp);
            const rowX = interpolate(transferP, [0, 1], [-12, 0], clamp);

            return (
              <div
                key={option}
                style={{
                  minHeight: OPTION_HEIGHT,
                  marginBottom: index === MEDICAL_OPTIONS.length - 1 ? 0 : OPTION_GAP,
                  fontFamily: "monospace",
                  fontSize: 25,
                  lineHeight: 1.3,
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  color: "#a5d6ff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#8b949e", marginRight: 10 }}>{"      "}</span>
                <span>{`"${option}"`}</span>
                <span style={{ color: "#8b949e" }}>
                  {index === MEDICAL_OPTIONS.length - 1 ? "" : ","}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: "monospace",
            fontSize: 25,
            lineHeight: 1.34,
            color: "#8b949e",
          }}
        >
          {"    ]"}
          <br />
          {"  }"}
          <br />
          {"}"}
        </div>
      </div>
    </div>
  );
};
