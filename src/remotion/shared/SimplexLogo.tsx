import { AbsoluteFill, staticFile } from "remotion";

export const SimplexLogo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 600,
          height: 600,
          backgroundColor: "#6366F1",
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
    </AbsoluteFill>
  );
};
