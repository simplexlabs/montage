import { AbsoluteFill, Img, staticFile } from "remotion";

export const Cursor: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("cursor.png")}
        style={{
          width: 400,
          height: 400,
          objectFit: "contain",
        }}
      />
    </AbsoluteFill>
  );
};
