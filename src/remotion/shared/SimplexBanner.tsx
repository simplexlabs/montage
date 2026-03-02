import { AbsoluteFill, staticFile } from "remotion";

const FONT_FAMILY = '"SF Pro Display", "Helvetica Neue", Arial, sans-serif';

const INDIGO = "#6366F1";

export const SimplexBanner: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
          <span
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: INDIGO,
              letterSpacing: "-0.05em",
              marginRight: 12,
            }}
          >
            Simplex
          </span>
          <div
            style={{
              width: 192,
              height: 192,
              backgroundColor: INDIGO,
              WebkitMaskImage: `url(${staticFile("simplex-black.png")})`,
              maskImage: `url(${staticFile("simplex-black.png")})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
      </div>
    </AbsoluteFill>
  );
};
