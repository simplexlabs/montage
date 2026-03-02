import { AbsoluteFill, Img, staticFile } from "remotion";

const FONT_FAMILY = '"SF Pro Display", "Helvetica Neue", Arial, sans-serif';

const LOGO_SIZE = 120;

const Placeholder: React.FC<{ label: string; color: string }> = ({
  label,
  color,
}) => (
  <div
    style={{
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: 24,
      backgroundColor: color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: FONT_FAMILY,
      fontSize: 14,
      fontWeight: 700,
      color: "#fff",
    }}
  >
    {label}
  </div>
);

const Plus: React.FC = () => (
  <div
    style={{
      fontSize: 64,
      fontWeight: 700,
      color: "#1D1D1F",
      fontFamily: FONT_FAMILY,
      lineHeight: 1,
    }}
  >
    +
  </div>
);

export const LogoRow: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
        }}
      >
        <Img
          src={staticFile("remotion-logo.png")}
          style={{
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            objectFit: "contain",
          }}
        />
        <Plus />
        <Placeholder label="Claude" color="#D97757" />
        <Plus />
        <Placeholder label="OpenCode" color="#1A1A2E" />
      </div>
    </AbsoluteFill>
  );
};
