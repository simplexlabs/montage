import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import {
  useRadialVignette,
  useCornerGlow,
  SCENE_PALETTES,
  TEXT_FINISH,
  FONT_FAMILY,
} from "./animations";
import { FilmGrainOverlay } from "./FilmGrainOverlay";

// ─── Color palette (matching the dark IDE theme) ─────────────────────
const COLORS = {
  bg: "#0D1117",
  sidebar: "#161B22",
  sidebarBorder: "#21262D",
  tabBar: "#1C2128",
  tabActive: "#0D1117",
  tabBorder: "#30363D",
  editorBg: "#0D1117",
  chatBg: "#161B22",
  accent: "#58A6FF",
  accentDim: "#388BFD66",
  text: "#C9D1D9",
  textMuted: "#8B949E",
  textDim: "#484F58",
  green: "#3FB950",
  yellow: "#D29922",
  purple: "#BC8CFF",
  red: "#F85149",
  orange: "#F0883E",
  folderIcon: "#54AEFF",
  fileIcon: "#8B949E",
};

// ─── Chat messages (shown in sidebar) ────────────────────────────────
const CHAT_MESSAGES = [
  { role: "user" as const, text: "Build a landing page for the product" },
  {
    role: "assistant" as const,
    text: "I'll create a responsive landing page with a hero section, features grid, and CTA.",
  },
  {
    role: "tool" as const,
    text: "Created index.html — hero section with gradient background",
  },
  {
    role: "tool" as const,
    text: "Created styles.css — responsive layout and typography",
  },
  {
    role: "assistant" as const,
    text: "The landing page is ready. Check the browser preview.",
  },
];

// ─── Tabs for the main editor area ───────────────────────────────────
const TABS = [
  { name: "Browser", icon: "globe", active: true },
  { name: "index.html", icon: "file", active: false },
  { name: "styles.css", icon: "file", active: false },
];

// ─── Sub-components ──────────────────────────────────────────────────

function ChatMessage({
  msg,
  index,
  frame,
  fps,
  baseDelay,
}: {
  msg: (typeof CHAT_MESSAGES)[number];
  index: number;
  frame: number;
  fps: number;
  baseDelay: number;
}) {
  const delay = baseDelay + index * 15;
  const progress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 140 },
    delay,
  });

  const y = interpolate(progress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isUser = msg.role === "user";
  const isTool = msg.role === "tool";

  return (
    <div
      style={{
        transform: `translateY(${y}px)`,
        opacity,
        padding: "22px 26px",
        borderRadius: 14,
        backgroundColor: isUser
          ? COLORS.accentDim
          : isTool
            ? "rgba(63, 185, 80, 0.08)"
            : "rgba(139, 148, 158, 0.06)",
        borderLeft: isTool ? `4px solid ${COLORS.green}` : "none",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          fontSize: 19,
          fontWeight: 600,
          color: isUser
            ? COLORS.accent
            : isTool
              ? COLORS.green
              : COLORS.purple,
          marginBottom: 6,
          fontFamily: FONT_FAMILY,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {isUser ? "You" : isTool ? "Tool Call" : "Assistant"}
      </div>
      <div
        style={{
          fontSize: 22,
          color: COLORS.text,
          fontFamily: FONT_FAMILY,
          lineHeight: 1.45,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ─── Mock browser page content ───────────────────────────────────────
function BrowserContent({
  frame,
  fps,
  delay,
}: {
  frame: number;
  fps: number;
  delay: number;
}) {
  const contentProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay,
  });

  const contentOpacity = interpolate(contentProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentY = interpolate(contentProgress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Staggered feature cards
  const featureCards = [
    { icon: "⚡", title: "Lightning Fast", desc: "Sub-second response times" },
    { icon: "🔒", title: "Secure by Default", desc: "Enterprise-grade encryption" },
    { icon: "🌐", title: "Global Scale", desc: "Deploy anywhere instantly" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #0F0F23 0%, #1A1A3E 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        overflow: "hidden",
      }}
    >
      {/* Nav bar */}
      <div
        style={{
          width: "100%",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Img
            src={staticFile("simplex_logo.png")}
            style={{ width: 32, height: 32, borderRadius: 6 }}
          />
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: FONT_FAMILY,
              letterSpacing: "-0.02em",
            }}
          >
            Simplex
          </span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Features", "Pricing", "Docs"].map((item) => (
            <span
              key={item}
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 16,
                fontFamily: FONT_FAMILY,
              }}
            >
              {item}
            </span>
          ))}
          <div
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #5E6BFF, #8B5CF6)",
              color: "#FFF",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: FONT_FAMILY,
            }}
          >
            Get Started
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          gap: 20,
        }}
      >
        {/* Badge */}
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            border: "1px solid rgba(94, 107, 255, 0.3)",
            background: "rgba(94, 107, 255, 0.1)",
            color: "#8B9AFF",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: FONT_FAMILY,
          }}
        >
          Now in Public Beta
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#FFFFFF",
            fontFamily: FONT_FAMILY,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 700,
          }}
        >
          Build workflows that
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #5E6BFF, #A78BFA, #EC4899)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            think for themselves
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
            fontFamily: FONT_FAMILY,
            textAlign: "center",
            maxWidth: 520,
            lineHeight: 1.5,
          }}
        >
          AI-powered automation that understands your business logic.
          Ship faster with intelligent agents.
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #5E6BFF, #7C3AED)",
              color: "#FFF",
              fontSize: 17,
              fontWeight: 600,
              fontFamily: FONT_FAMILY,
            }}
          >
            Start Building Free
          </div>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 17,
              fontWeight: 500,
              fontFamily: FONT_FAMILY,
            }}
          >
            View Demo
          </div>
        </div>

        {/* Feature cards row */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 20,
          }}
        >
          {featureCards.map((card, i) => {
            const cardProgress = spring({
              frame,
              fps,
              config: { damping: 200, stiffness: 140 },
              delay: delay + 20 + i * 8,
            });
            const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const cardY = interpolate(cardProgress, [0, 1], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  width: 210,
                  padding: "20px 22px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    fontFamily: FONT_FAMILY,
                    marginBottom: 4,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: FONT_FAMILY,
                    lineHeight: 1.4,
                  }}
                >
                  {card.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main composition ────────────────────────────────────────────────
export const EditorShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background
  const bgStyle = useRadialVignette(frame, fps, {
    colors: SCENE_PALETTES.feature,
  });
  const glowTL = useCornerGlow(frame, fps, { position: "top-left" });
  const glowBR = useCornerGlow(frame, fps, {
    position: "bottom-right",
    targetOpacity: 0.03,
  });

  // ─── Phase 1: IDE shell entrance ────────────────────────────────
  const shellDelay = 5;
  const shellProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120 },
    delay: shellDelay,
  });

  const shellScale = interpolate(shellProgress, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shellOpacity = interpolate(shellProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shellY = interpolate(shellProgress, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Phase 2: Sidebar reveal ───────────────────────────────────
  const sidebarDelay = shellDelay + 10;
  const sidebarProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: sidebarDelay,
  });
  const sidebarWidth = interpolate(sidebarProgress, [0, 1], [0, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sidebar tabs
  const sidebarTabDelay = sidebarDelay + 8;
  const sidebarTabProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: sidebarTabDelay,
  });
  const sidebarTabOpacity = interpolate(sidebarTabProgress, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Phase 3: Tab bar ──────────────────────────────────────────
  const tabDelay = shellDelay + 20;

  // ─── Phase 4: Browser content ──────────────────────────────────
  const browserDelay = shellDelay + 35;
  const browserProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 140 },
    delay: browserDelay,
  });
  const browserOpacity = interpolate(browserProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Phase 5: Chat messages in sidebar ─────────────────────────
  const chatDelay = shellDelay + 25;

  // IDE dimensions
  const ideWidth = width * 0.94;
  const ideHeight = height * 0.90;
  const titleBarHeight = 72;
  const tabHeight = 72;
  const sidebarTabHeight = 68;
  const urlBarHeight = 62;

  return (
    <AbsoluteFill>
      {/* Background layers */}
      <div style={bgStyle} />
      <FilmGrainOverlay intensity={15} />
      <div style={glowTL} />
      <div style={glowBR} />

      {/* IDE container */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: ideWidth,
            height: ideHeight,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: COLORS.bg,
            boxShadow:
              "0 50px 100px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
            transform: `translateY(${shellY}px) scale(${shellScale})`,
            opacity: shellOpacity,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ═══ Title bar with browser-style URL ═══ */}
          <div
            style={{
              height: titleBarHeight,
              backgroundColor: COLORS.tabBar,
              borderBottom: `1px solid ${COLORS.tabBorder}`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 30,
              paddingRight: 30,
              gap: 14,
              flexShrink: 0,
            }}
          >
            {/* Traffic lights */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#FEBC2E",
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#28C840",
              }}
            />

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                backgroundColor: "#FFFFFF",
                border: "1px solid #D4D4D4",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                marginLeft: 16,
                gap: 10,
              }}
            >
              {/* Lock icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 12 12"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              >
                <rect x="2" y="5" width="8" height="6" rx="1" />
                <path d="M4 5V3.5a2 2 0 014 0V5" />
              </svg>
              <span
                style={{
                  fontSize: 21,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#1A1A1A",
                }}
              >
                <span style={{ color: "#1A1A1A" }}>simplex.sh</span>
                <span style={{ color: "#737373" }}>/workflow/6d80bb22-0afc-4966-8d55-127f34b0b504/editor</span>
              </span>
            </div>
          </div>

          {/* ═══ Main content area ═══ */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* ─── Sidebar (Chat active) ─── */}
            <div
              style={{
                width: sidebarWidth,
                backgroundColor: COLORS.sidebar,
                borderRight: `1px solid ${COLORS.sidebarBorder}`,
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Sidebar tab headers — Chat is active */}
              <div
                style={{
                  height: sidebarTabHeight,
                  display: "flex",
                  borderBottom: `1px solid ${COLORS.sidebarBorder}`,
                  opacity: sidebarTabOpacity,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: COLORS.textMuted,
                    fontFamily: FONT_FAMILY,
                    borderBottom: `3px solid ${COLORS.accent}`,
                  }}
                >
                  Chat
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: COLORS.textDim,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Files
                </div>
              </div>

              {/* Agent status bar */}
              <div
                style={{
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 24px",
                  borderBottom: `1px solid ${COLORS.sidebarBorder}`,
                  opacity: sidebarTabOpacity,
                  flexShrink: 0,
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    backgroundColor: COLORS.green,
                  }}
                />
                <span
                  style={{
                    fontSize: 20,
                    color: COLORS.green,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 500,
                  }}
                >
                  Agent Active
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 18,
                    color: COLORS.textDim,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  3 tool calls
                </span>
              </div>

              {/* Chat messages */}
              <div
                style={{
                  flex: 1,
                  padding: 22,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {CHAT_MESSAGES.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    msg={msg}
                    index={i}
                    frame={frame}
                    fps={fps}
                    baseDelay={chatDelay}
                  />
                ))}
              </div>

              {/* Chat input */}
              <div
                style={{
                  height: 80,
                  borderTop: `1px solid ${COLORS.sidebarBorder}`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 22px",
                  opacity: sidebarTabOpacity,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: "rgba(139, 148, 158, 0.08)",
                    border: `1px solid ${COLORS.tabBorder}`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 21,
                      color: COLORS.textDim,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Ask the agent...
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Editor area (Browser active) ─── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Tab bar */}
              <div
                style={{
                  height: tabHeight,
                  backgroundColor: COLORS.tabBar,
                  borderBottom: `1px solid ${COLORS.tabBorder}`,
                  display: "flex",
                  alignItems: "stretch",
                  flexShrink: 0,
                }}
              >
                {TABS.map((tab, i) => {
                  const tDelay = tabDelay + i * 5;
                  const tProgress = spring({
                    frame,
                    fps,
                    config: { damping: 200, stiffness: 180 },
                    delay: tDelay,
                  });
                  const tOpacity = interpolate(tProgress, [0, 0.3], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const tY = interpolate(tProgress, [0, 1], [-10, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 28px",
                        gap: 14,
                        minWidth: tab.name === "Browser" ? 320 : 200,
                        backgroundColor: tab.active
                          ? COLORS.tabActive
                          : "transparent",
                        borderBottom: tab.active
                          ? `3px solid ${COLORS.accent}`
                          : "3px solid transparent",
                        borderRight: `1px solid ${COLORS.tabBorder}`,
                        opacity: tOpacity,
                        transform: `translateY(${tY}px)`,
                      }}
                    >
                      {tab.icon === "globe" ? (
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke={COLORS.accent}
                          strokeWidth="1.5"
                        >
                          <circle cx="8" cy="8" r="6.5" />
                          <path d="M1.5 8h13M8 1.5c-2 2.5-2 9.5 0 13M8 1.5c2 2.5 2 9.5 0 13" />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 14 14"
                          fill={COLORS.fileIcon}
                        >
                          <path d="M2 1.5A1.5 1.5 0 013.5 0h4.586a1.5 1.5 0 011.06.44l2.415 2.414A1.5 1.5 0 0112 3.914V12.5A1.5 1.5 0 0110.5 14h-7A1.5 1.5 0 012 12.5v-11z" />
                        </svg>
                      )}
                      <span
                        style={{
                          fontSize: 24,
                          color: tab.active ? COLORS.text : COLORS.textMuted,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: tab.active ? 500 : 400,
                        }}
                      >
                        {tab.name}
                      </span>
                      {/* Browser tab extras: status dot + running label */}
                      {tab.name === "Browser" && tab.active && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginLeft: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: COLORS.green,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 20,
                              color: COLORS.textMuted,
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            Running
                          </span>
                        </div>
                      )}
                      {tab.icon !== "globe" && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke={COLORS.textDim}
                          strokeWidth="1.5"
                          style={{ marginLeft: 8, opacity: 0.5 }}
                        >
                          <path d="M3 3l6 6M9 3l-6 6" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Browser viewport */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: browserOpacity,
                }}
              >
                {/* URL bar */}
                <div
                  style={{
                    height: urlBarHeight,
                    backgroundColor: COLORS.tabBar,
                    borderBottom: `1px solid ${COLORS.tabBorder}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  {/* Nav buttons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke={COLORS.textDim}
                      strokeWidth="1.5"
                    >
                      <path d="M10 3L5 8l5 5" />
                    </svg>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke={COLORS.textDim}
                      strokeWidth="1.5"
                    >
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke={COLORS.textDim}
                      strokeWidth="1.5"
                    >
                      <path d="M3 8h10M8 3l5 5-5 5" />
                    </svg>
                  </div>

                  {/* URL input */}
                  <div
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: "rgba(139, 148, 158, 0.08)",
                      border: `1px solid ${COLORS.tabBorder}`,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 16,
                      gap: 10,
                    }}
                  >
                    {/* Lock icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={COLORS.green}
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="5" width="8" height="6" rx="1" />
                      <path d="M4 5V3.5a2 2 0 014 0V5" />
                    </svg>
                    <span
                      style={{
                        fontSize: 22,
                        color: COLORS.textMuted,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      https://app.simplex.dev
                    </span>
                  </div>
                </div>

                {/* Page content */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <BrowserContent
                    frame={frame}
                    fps={fps}
                    delay={browserDelay + 5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
