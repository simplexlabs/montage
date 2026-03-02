import { interpolate, spring, staticFile } from "remotion";
import { FONT_FAMILY, TEXT_FINISH } from "../shared/animations";
import {
  FILESYSTEM_CODE_PADDING_X,
  FILESYSTEM_CODE_PADDING_Y,
  FILESYSTEM_CONTENT_PADDING,
  FILESYSTEM_TOP_BAR_HEIGHT,
  JSON_FONT_SIZE,
  JSON_LINE_HEIGHT_MULTIPLIER,
  MEDICAL_OPTIONS,
  TEXT_SQUISH_DURATION,
  TEXT_SQUISH_START,
} from "./xrayConstants";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type SimplexFilesystemPanelProps = {
  frame: number;
  fps: number;
  baseDelay: number;
  height: number;
};

export const SimplexFilesystemPanel: React.FC<SimplexFilesystemPanelProps> = ({
  frame,
  fps,
  baseDelay,
  height,
}) => {
  const logoP = spring({
    frame,
    fps,
    delay: baseDelay + 8,
    config: { damping: 14, stiffness: 180 },
  });
  const logoScale = interpolate(logoP, [0, 1], [0.84, 1], clamp);
  const logoGlow = interpolate(logoP, [0, 1], [0.28, 0.82], clamp);

  const squishP = spring({
    frame,
    fps,
    delay: TEXT_SQUISH_START,
    durationInFrames: TEXT_SQUISH_DURATION,
    config: { damping: 200, stiffness: 130 },
  });
  const codeOpacity = interpolate(squishP, [0.52, 1], [0, 1], clamp);
  const codeScale = interpolate(squishP, [0.52, 1], [1.03, 1], clamp);
  const codeY = interpolate(squishP, [0.52, 1], [16, 0], clamp);

  const jsonLines = [
    "{",
    '  "medical_conditions": {',
    '    "field_type": "checkbox",',
    '    "container": "#medical-conditions-field",',
    '    "options": [',
    ...MEDICAL_OPTIONS.map((option, index) =>
      `      "${option}"${index === MEDICAL_OPTIONS.length - 1 ? "" : ","}`,
    ),
    "    ]",
    "  }",
    "}",
  ];

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 26,
        border: "1px solid rgba(70, 86, 140, 0.44)",
        backgroundColor: "rgba(17, 20, 32, 0.96)",
        boxShadow: "0 26px 60px rgba(9, 13, 26, 0.46)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: FILESYSTEM_TOP_BAR_HEIGHT,
          borderBottom: "1px solid rgba(73, 88, 145, 0.4)",
          backgroundColor: "rgba(25, 30, 47, 0.98)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              backgroundColor: "#6366F1",
              WebkitMaskImage: `url(${staticFile("simplex-black.png")})`,
              maskImage: `url(${staticFile("simplex-black.png")})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              transform: `scale(${logoScale})`,
              boxShadow: `0 0 22px rgba(99, 102, 241, ${logoGlow})`,
            }}
          />
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 27,
              fontWeight: 700,
              color: "#EEF1FF",
              lineHeight: 1,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            SIMPLEX FILESYSTEM
          </span>
        </div>

        <div
          style={{
            height: 54,
            borderRadius: 12,
            border: "1px solid rgba(93, 109, 169, 0.35)",
            backgroundColor: "rgba(29, 36, 59, 0.9)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              border: "1px solid rgba(170, 186, 255, 0.5)",
              backgroundColor: "rgba(76, 92, 166, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#EAF0FF",
              fontFamily: "monospace",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {"{}"}
          </div>
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: "monospace",
              fontSize: 19,
              fontWeight: 600,
              color: "#DDE6FF",
              lineHeight: 1,
            }}
          >
            form_mapping.JSON
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: FILESYSTEM_CONTENT_PADDING,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
            border: "1px solid rgba(73, 88, 145, 0.42)",
            backgroundColor: "rgba(15, 19, 34, 0.98)",
            overflow: "hidden",
            padding: `${FILESYSTEM_CODE_PADDING_Y}px ${FILESYSTEM_CODE_PADDING_X}px`,
          }}
        >
          <div
            style={{
              opacity: codeOpacity,
              transform: `translateY(${codeY}px) scale(${codeScale})`,
              transformOrigin: "top left",
            }}
          >
            {jsonLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                style={{
                  ...TEXT_FINISH,
                  fontFamily: "monospace",
                  fontSize: JSON_FONT_SIZE,
                  fontWeight: 500,
                  lineHeight: JSON_LINE_HEIGHT_MULTIPLIER,
                  color:
                    index === 1 || index === 2 || index === 3 || index === 4
                      ? "#9FB2FF"
                      : index >= 5 && index < 5 + MEDICAL_OPTIONS.length
                        ? "#E8ECFF"
                        : "#CFD8FF",
                  whiteSpace: "pre",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
