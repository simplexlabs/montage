import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// ─── VS Code Dark+ token colors ─────────────────────────────────────
const C = {
  keyword: "#C586C0",
  string: "#CE9178",
  func: "#DCDCAA",
  decorator: "#DCDCAA",
  comment: "#6A9955",
  module: "#4EC9B0",
  param: "#9CDCFE",
  builtin: "#569CD6",
  text: "#D4D4D4",
  paren: "#FFD700",
  paren2: "#DA70D6",
  lineNum: "#858585",
  bg: "#1E1E2E",
  gutterBg: "#1E1E2E",
  tabBg: "#2D2D3D",
  tabActive: "#1E1E2E",
  tabBorder: "#3E3E52",
  titleBar: "#323244",
};

type Token = { t: string; c: string };
const k = (t: string): Token => ({ t, c: C.keyword });
const s = (t: string): Token => ({ t, c: C.string });
const f = (t: string): Token => ({ t, c: C.func });
const d = (t: string): Token => ({ t, c: C.decorator });
const m = (t: string): Token => ({ t, c: C.module });
const p = (t: string): Token => ({ t, c: C.param });
const b = (t: string): Token => ({ t, c: C.builtin });
const x = (t: string): Token => ({ t, c: C.text });
const cm = (t: string): Token => ({ t, c: C.comment });
const p1 = (t: string): Token => ({ t, c: C.paren });
const p2 = (t: string): Token => ({ t, c: C.paren2 });

// ─── Simplified Python code (action wrapper removed) ─────────────────
const CODE_LINES: Token[][] = [
  [k("import"), x(" "), m("asyncio")],
  [k("from"), x(" "), m("servers.browser_tools"), x(" "), k("import"), x(" "), p1("(")],
  [x("    "), f("click"), x(", "), f("type"), x(", "), f("type_secret"), x(", "), f("navigate"), x(",")],
  [x("    "), f("scroll"), x(", "), f("screenshot"), x(", "), f("select_option")],
  [p1(")")],
  [k("from"), x(" "), m("flow_helpers"), x(" "), k("import"), x(" "), f("section"), x(", "), f("run_flow"), x(", "), f("pause")],
  [],
  [],
  [d("@section"), p2("("), s('"Login"'), p2(")")],
  [k("async"), x(" "), k("def"), x(" "), f("login"), p1("("), p("v"), p1(")"), x(":")],
  [x("    "), k("await"), x(" "), f("click"), p1("("), s('"input#username"'), p1(")")],
  [x("    "), k("await"), x(" "), f("type"), p1("("), p("v"), x("["), s('"credentials"'), x("]["), s('"username"'), x("]"), p1(")")],
  [x("    "), k("await"), x(" "), f("click"), p1("("), s('"button[type=\'submit\']"'), p1(")")],
  [x("    "), k("await"), x(" "), m("asyncio"), x("."), f("sleep"), p1("("), x("2"), p1(")")],
  [],
  [],
  [d("@section"), p2("("), s('"Fill Form"'), p2(")")],
  [k("async"), x(" "), k("def"), x(" "), f("fill_form"), p1("("), p("v"), p1(")"), x(":")],
  [x("    "), k("await"), x(" "), f("click"), p1("("), s('"input#name"'), p1(")")],
  [x("    "), k("await"), x(" "), f("type"), p1("("), p("v"), x("["), s('"member"'), x("]["), s('"name"'), x("]"), p1(")")],
  [],
  [x("    "), k("if"), x(" "), p("v"), x("."), f("get"), p1("("), s('"has_extra_fields"'), p1(")"), x(":")],
  [x("        "), k("await"), x(" "), f("click"), p1("("), s('"input#extra"'), p1(")")],
  [x("        "), k("await"), x(" "), f("type"), p1("("), p("v"), x("["), s('"extra"'), x("]"), p1(")")],
  [],
  [],
  [k("if"), x(" "), b("__name__"), x(" == "), s('"__main__"'), x(":")],
  [x("    "), m("asyncio"), x("."), f("run"), p1("("), f("run_flow"), p1("("), p1(")"), p1(")")],
];

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const MONO = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";
const FONT_FAMILY = "'SF Pro Display', 'Inter', system-ui, sans-serif";

// ─── Component ──────────────────────────────────────────────────────
interface PythonFilePreviewProps {
  delay?: number;
  width?: number;
  height?: number;
}

export const PythonFilePreview: React.FC<PythonFilePreviewProps> = ({
  delay = 0,
  width = 1800,
  height = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window entrance
  const enterP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
    delay,
  });
  const windowScale = interpolate(enterP, [0, 1], [0.88, 1], clamp);
  const windowOpacity = interpolate(enterP, [0, 0.25], [0, 1], clamp);
  const windowY = interpolate(enterP, [0, 1], [80, 0], clamp);

  const lineHeight = 36;
  const fontSize = 24;
  const gutterWidth = 62;
  const tabBarHeight = 48;
  const padTop = 16;
  const padLeft = 20;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: C.bg,
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.5), 0 15px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
        transform: `translateY(${windowY}px) scale(${windowScale})`,
        opacity: windowOpacity,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══ Tab bar ═══ */}
      <div
        style={{
          height: tabBarHeight,
          backgroundColor: C.tabBg,
          borderBottom: `1px solid ${C.tabBorder}`,
          display: "flex",
          alignItems: "stretch",
          flexShrink: 0,
        }}
      >
        {/* Active tab — flow.py */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 20px",
            backgroundColor: C.tabActive,
            borderBottom: "2px solid #6366F1",
            borderRight: `1px solid ${C.tabBorder}`,
          }}
        >
          {/* Python icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 6 4.02 6 5.5V8h6v1H5.5C3.02 9 2 11.02 2 13.5S3.02 18 5.5 18H8v-2.5C8 13.02 9.52 11 12 11h4c1.66 0 3-1.34 3-3V5.5C19 3.02 17.48 2 15 2h-3z"
              fill="#3572A5"
            />
            <path
              d="M12 22c5.52 0 6-2.02 6-3.5V16h-6v-1h6.5c2.48 0 3.5-2.02 3.5-4.5S20.98 6 18.5 6H16v2.5c0 2.48-1.52 4.5-4 4.5h-4c-1.66 0-3 1.34-3 3v2.5C5 20.98 6.52 22 9 22h3z"
              fill="#FFD43B"
            />
            <circle cx="9" cy="5.5" r="1.2" fill="#FFF" />
            <circle cx="15" cy="18.5" r="1.2" fill="#FFF" />
          </svg>
          <span
            style={{
              fontSize: 17,
              color: "#D4D4D4",
              fontFamily: MONO,
              fontWeight: 500,
            }}
          >
            flow.py
          </span>
          {/* Close icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            stroke="#858585"
            strokeWidth="1.5"
            style={{ marginLeft: 6, opacity: 0.5 }}
          >
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </div>
      </div>

      {/* ═══ Editor body ═══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Gutter (line numbers) */}
        <div
          style={{
            width: gutterWidth,
            backgroundColor: C.gutterBg,
            paddingTop: padTop,
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {CODE_LINES.map((_, i) => {
            const lineDelay = delay + 4 + i * 1.2;
            const lineP = spring({
              frame,
              fps,
              config: { damping: 200, stiffness: 200 },
              delay: lineDelay,
            });
            const lineOpacity = interpolate(lineP, [0, 0.3], [0, 1], clamp);

            return (
              <div
                key={i}
                style={{
                  height: lineHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 16,
                  fontSize: fontSize - 2,
                  fontFamily: MONO,
                  color: C.lineNum,
                  opacity: lineOpacity,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Code content */}
        <div
          style={{
            flex: 1,
            paddingTop: padTop,
            paddingLeft: padLeft,
            overflow: "hidden",
          }}
        >
          {CODE_LINES.map((tokens, i) => {
            const lineDelay = delay + 4 + i * 1.2;
            const lineP = spring({
              frame,
              fps,
              config: { damping: 200, stiffness: 200 },
              delay: lineDelay,
            });
            const lineOpacity = interpolate(lineP, [0, 0.3], [0, 1], clamp);
            const lineX = interpolate(lineP, [0, 1], [12, 0], clamp);

            return (
              <div
                key={i}
                style={{
                  height: lineHeight,
                  display: "flex",
                  alignItems: "center",
                  fontSize,
                  fontFamily: MONO,
                  whiteSpace: "pre",
                  opacity: lineOpacity,
                  transform: `translateX(${lineX}px)`,
                }}
              >
                {tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>
                    {tok.t}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
