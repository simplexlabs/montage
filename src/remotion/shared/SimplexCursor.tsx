import { AbsoluteFill, Img, staticFile } from "remotion";

export const SimplexCursor: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 300, height: 300 }}>
        <Img
          src={staticFile("cursor.png")}
          style={{
            width: 300,
            height: 300,
            objectFit: "contain",
          }}
        />
        <Img
          src={staticFile("simplex_logo.png")}
          style={{
            position: "absolute",
            bottom: -20,
            left: 20,
            width: 360,
            height: 360,
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
