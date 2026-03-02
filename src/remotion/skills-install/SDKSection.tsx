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
  useDynamicResize,
  usePanelReveal,
  useScalePop,
  useWipeReveal,
  useWordDragIn,
} from "../shared/animations";

const INDIGO = "#6366F1";

const SERVICES = [
  { name: "GitHub", icon: "GH", color: "#24292F" },
  { name: "Slack", icon: "SL", color: "#4A154B" },
  { name: "AWS", icon: "AWS", color: "#FF9900" },
] as const;

const PARTICLES = [
  { delay: 54, y: -44 },
  { delay: 62, y: -12 },
  { delay: 70, y: 20 },
  { delay: 78, y: 48 },
] as const;

export const SDKSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftPanel = usePanelReveal(frame, fps, {
    delay: 0,
    from: "left",
    distance: 180,
  });
  const rightPanel = usePanelReveal(frame, fps, {
    delay: 8,
    from: "right",
    distance: 180,
  });
  const bridgeWipe = useWipeReveal(frame, fps, {
    delay: 34,
    direction: "left",
  });

  const bridgeGlow = spring({
    frame,
    fps,
    delay: 58,
    config: { damping: 200, stiffness: 80 },
  });
  const bridgeGlowOpacity = interpolate(bridgeGlow, [0, 1], [0.08, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const focusTransition = useDynamicResize(frame, fps, {
    delay: 112,
    fromScale: 0.96,
    toScale: 1,
    yOffset: 18,
  });

  const fadeOut = spring({
    frame,
    fps,
    delay: 154,
    config: { damping: 200 },
  });
  const sectionOpacity = interpolate(fadeOut, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sectionScale = interpolate(fadeOut, [0, 1], [1, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sectionOpacity,
        transform: `scale(${sectionScale})`,
      }}
    >
      <div
        style={{
          width: 2580,
          height: 1160,
          position: "relative",
          ...focusTransition.backgroundStyle,
        }}
      >
        <div
          style={{
            ...leftPanel,
            position: "absolute",
            left: 0,
            top: 0,
            width: 1520,
            height: 1160,
            borderRadius: 30,
            border: "1px solid rgba(37, 45, 76, 0.28)",
            backgroundColor: "rgba(18, 24, 46, 0.86)",
            padding: "42px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 500,
                color: "#93A0D9",
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              SDK control plane
            </span>
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 54,
                fontWeight: 600,
                color: "#EEF1FF",
                lineHeight: 1,
              }}
            >
              Credential vault
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {SERVICES.map((service, index) => {
              const rowStyle = useScalePop(frame, fps, {
                index,
                delay: 22,
                stagger: 8,
                springConfig: { damping: 16, stiffness: 170 },
              });
              const badgeStyle = useScalePop(frame, fps, {
                index,
                delay: 44,
                stagger: 8,
                springConfig: { damping: 14, stiffness: 200 },
              });

              return (
                <div
                  key={service.name}
                  style={{
                    ...rowStyle,
                    height: 112,
                    borderRadius: 18,
                    border: "1px solid rgba(126, 141, 214, 0.24)",
                    backgroundColor: "rgba(34, 43, 76, 0.74)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        backgroundColor: service.color,
                        color: "white",
                        fontFamily: FONT_FAMILY,
                        fontSize: 24,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {service.icon}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span
                        style={{
                          ...TEXT_FINISH,
                          fontFamily: FONT_FAMILY,
                          fontSize: 36,
                          fontWeight: 600,
                          color: "#EEF1FF",
                          lineHeight: 1,
                        }}
                      >
                        {service.name}
                      </span>
                      <span
                        style={{
                          ...TEXT_FINISH,
                          fontFamily: FONT_FAMILY,
                          fontSize: 24,
                          fontWeight: 400,
                          color: "#99A5DC",
                          lineHeight: 1,
                        }}
                      >
                        API token ••••••••
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      ...badgeStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      height: 44,
                      borderRadius: 999,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      padding: "0 16px",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🔒</span>
                    <span
                      style={{
                        ...TEXT_FINISH,
                        fontFamily: FONT_FAMILY,
                        fontSize: 20,
                        fontWeight: 500,
                        color: "#38DCA0",
                        lineHeight: 1,
                      }}
                    >
                      Encrypted
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            ...rightPanel,
            position: "absolute",
            right: 0,
            top: 60,
            width: 980,
            height: 1040,
            borderRadius: 30,
            border: "1px solid rgba(80, 93, 156, 0.18)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "42px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 500,
              color: "#6670A1",
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: 1.2,
            }}
          >
            Runtime integration
          </span>
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 50,
              fontWeight: 600,
              color: "#1D2442",
              lineHeight: 1,
            }}
          >
            Simplex backend
          </span>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {SERVICES.map((service, index) => {
              const statusStyle = useWordDragIn(frame, fps, {
                index,
                stagger: 5,
                baseDelay: 82,
              });

              return (
                <div
                  key={service.name}
                  style={{
                    ...statusStyle,
                    height: 96,
                    borderRadius: 16,
                    border: "1px solid rgba(106, 119, 183, 0.18)",
                    backgroundColor: "rgba(245, 247, 255, 0.95)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 22px",
                  }}
                >
                  <span
                    style={{
                      ...TEXT_FINISH,
                      fontFamily: FONT_FAMILY,
                      fontSize: 34,
                      fontWeight: 500,
                      color: "#232C53",
                      lineHeight: 1,
                    }}
                  >
                    {service.name}
                  </span>
                  <span
                    style={{
                      ...TEXT_FINISH,
                      fontFamily: FONT_FAMILY,
                      fontSize: 24,
                      fontWeight: 500,
                      color: "#2FB97D",
                      lineHeight: 1,
                    }}
                  >
                    Connected
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            ...bridgeWipe,
            position: "absolute",
            left: 1490,
            top: "50%",
            width: 130,
            height: 8,
            borderRadius: 999,
            transform: "translateY(-50%)",
            backgroundColor: `rgba(99, 102, 241, ${bridgeGlowOpacity})`,
            boxShadow: `0 0 24px rgba(99, 102, 241, ${bridgeGlowOpacity})`,
          }}
        />

        {PARTICLES.map((particle, index) => {
          const flow = spring({
            frame,
            fps,
            delay: particle.delay,
            config: { damping: 200, stiffness: 80 },
          });
          const flowX = interpolate(flow, [0, 1], [1510, 1600], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const flowOpacity = interpolate(
            flow,
            [0, 0.15, 0.85, 1],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: flowX,
                top: "50%",
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: INDIGO,
                transform: `translateY(${particle.y}px)`,
                opacity: flowOpacity,
                boxShadow: "0 0 12px rgba(99, 102, 241, 0.9)",
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          ...focusTransition.foregroundStyle,
          position: "absolute",
          top: 265,
          left: "50%",
          transform: `translateX(-50%) ${focusTransition.foregroundStyle.transform ?? ""}`.trim(),
          borderRadius: 22,
          border: "1px solid rgba(79, 70, 229, 0.22)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "22px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span style={{ fontSize: 28 }}>🛡️</span>
        <span
          style={{
            ...TEXT_FINISH,
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 600,
            color: "#2F36A9",
            lineHeight: 1,
          }}
        >
          Vault relay keeps secrets out of agent context
        </span>
      </div>
    </AbsoluteFill>
  );
};
