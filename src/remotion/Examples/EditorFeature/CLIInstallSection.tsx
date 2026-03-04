import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  useGradientFill,
  useMaskedRise,
  usePanelReveal,
  useWipeReveal,
} from "../../shared/animations";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const HEADING_TEXT = "Prompt Simplex's agent to create reusable browser automation code";

export const CLIInstallSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingDelay = 20;
  const { containerStyle: headingContainer, contentStyle: headingContent } =
    useMaskedRise(frame, fps, {
      delay: headingDelay,
      yOffset: 58,
      springConfig: { damping: 20, stiffness: 110 },
    });
  const headingWipe = useWipeReveal(frame, fps, {
    delay: headingDelay + 4,
    direction: "left",
  });
  const headingGradient = useGradientFill(frame, fps, {
    delay: headingDelay + 8,
    color: "#111111",
    baseColor: "#8E91C6",
    springConfig: { damping: 200, stiffness: 90 },
  });

  const editorReveal = usePanelReveal(frame, fps, {
    delay: -10,
    from: "bottom",
    distance: 220,
    springConfig: { damping: 200, stiffness: 140 },
  });
  const editorRevealOpacity =
    typeof editorReveal.opacity === "number" ? editorReveal.opacity : 1;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 132,
        }}
      >
        <div style={headingContainer}>
          <div
            style={{
              ...headingContent,
              ...headingWipe,
              ...headingGradient,
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 94,
              fontWeight: 400,
              lineHeight: 1.1,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {HEADING_TEXT}
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 184,
        }}
      >
        <div
          style={{
            ...editorReveal,
            opacity: Math.max(0.28, editorRevealOpacity),
            width: 2290,
            height: 1100,
            borderRadius: 42,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(246,247,255,0.72) 100%)",
            border: "3px solid rgba(99, 102, 241, 0.35)",
            boxShadow:
              "0 52px 130px rgba(56, 57, 130, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 62,
              left: 76,
              right: 76,
              height: 2,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              borderRadius: 999,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
