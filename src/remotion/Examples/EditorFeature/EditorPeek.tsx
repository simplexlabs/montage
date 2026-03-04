import React from "react";
import {
  Img,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import {
  FONT_FAMILY,
  useCursorPath,
  useCursorClick,
  useTypingAnimation,
} from "../../shared/animations";

// ─── Color palette ───────────────────────────────────────────────────
const COLORS = {
  bg: "#0D1117",
  sidebar: "#161B22",
  sidebarBorder: "#21262D",
  tabBar: "#1C2128",
  tabActive: "#0D1117",
  tabBorder: "#30363D",
  accent: "#58A6FF",
  accentDim: "#388BFD66",
  text: "#C9D1D9",
  textMuted: "#8B949E",
  textDim: "#484F58",
  green: "#3FB950",
  purple: "#BC8CFF",
  fileIcon: "#8B949E",
};

const CHAT_MESSAGES: { role: "user" | "assistant" | "tool"; text: string }[] =
  [];

const TABS = [
  { name: "Browser", icon: "globe", active: true },
  { name: "flow.py", icon: "file", active: false },
];

const CURSOR_SIZE = 120;

// ─── Python code tokens (VS Code Dark+ theme) ──────────────────────
type CodeToken = { t: string; c: string };
const TC = {
  keyword: "#C586C0",
  string: "#CE9178",
  func: "#DCDCAA",
  decorator: "#DCDCAA",
  module: "#4EC9B0",
  param: "#9CDCFE",
  builtin: "#569CD6",
  text: "#D4D4D4",
  paren: "#FFD700",
  paren2: "#DA70D6",
  lineNum: "#858585",
};
const ck = (t: string): CodeToken => ({ t, c: TC.keyword });
const cs = (t: string): CodeToken => ({ t, c: TC.string });
const cf = (t: string): CodeToken => ({ t, c: TC.func });
const cd = (t: string): CodeToken => ({ t, c: TC.decorator });
const cm2 = (t: string): CodeToken => ({ t, c: TC.module });
const cp = (t: string): CodeToken => ({ t, c: TC.param });
const cb = (t: string): CodeToken => ({ t, c: TC.builtin });
const cx = (t: string): CodeToken => ({ t, c: TC.text });
const cp1 = (t: string): CodeToken => ({ t, c: TC.paren });
const cp2 = (t: string): CodeToken => ({ t, c: TC.paren2 });

const CODE_LINES: CodeToken[][] = [
  [ck("import"), cx(" "), cm2("asyncio")],
  [ck("from"), cx(" "), cm2("servers.browser_tools"), cx(" "), ck("import"), cx(" "), cp1("(")],
  [cx("    "), cf("click"), cx(", "), cf("type"), cx(", "), cf("type_secret"), cx(", "), cf("navigate"), cx(",")],
  [cx("    "), cf("scroll"), cx(", "), cf("scroll_to"), cx(", "), cf("screenshot"), cx(", "), cf("try_click")],
  [cp1(")")],
  [ck("from"), cx(" "), cm2("flow_helpers"), cx(" "), ck("import"), cx(" "), cf("section"), cx(", "), cf("run_flow"), cx(", "), cf("pause")],
  [],
  [],
  [cd("@section"), cp2("("), cs('"Login"'), cp2(")")],
  [ck("async"), cx(" "), ck("def"), cx(" "), cf("login"), cp1("("), cp("v"), cp1(")"), cx(":")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"#signin-btn-wrapper-tt a"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"input#username"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("type"), cp1("("), cp("text"), cx("="), cp("v"), cp1("["), cs('"username"'), cp1("]"), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"button#btnLogin"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"input#login-pwd"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("type"), cp1("("), cp("text"), cx("="), cp("v"), cp1("["), cs('"password"'), cp1("]"), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"button#btnLogin"'), cp1(")")],
  [],
  [],
  [cd("@section"), cp2("("), cs('"2FA Verification"'), cp2(")")],
  [ck("async"), cx(" "), ck("def"), cx(" "), cf("two_fa"), cp1("("), cp("v"), cp1(")"), cx(":")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"button:has-text(Via Microsoft Authenticator)"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"input#totp"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("type"), cp1("("), cp("two_fa"), cx("="), cb("True"), cx(", "), cp("config_name"), cx("="), cs('"UHC"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("try_click"), cp1("("), cs('"button:has-text(Continue)"'), cp1(")")],
  [],
  [],
  [cd("@section"), cp2("("), cs('"Navigate to Onboard Pro"'), cp2(")")],
  [ck("async"), cx(" "), ck("def"), cx(" "), cf("navigate_onboard"), cp1("("), cp("v"), cp1(")"), cx(":")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"[data-testid=practice-management-link]"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"[data-testid=top-bar-onboard-pro-link] button"'), cp1(")")],
  [],
  [],
  [cd("@section"), cp2("("), cs('"TIN Information"'), cp2(")")],
  [ck("async"), cx(" "), ck("def"), cx(" "), cf("tin_info"), cp1("("), cp("v"), cp1(")"), cx(":")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"input#tin"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("type"), cp1("("), cp("text"), cx("="), cp("v"), cp1("["), cs('"tin_info"'), cp1("]"), cp1("["), cs('"tin"'), cp1("]"), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"input#legalName"'), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("type"), cp1("("), cp("text"), cx("="), cp("v"), cp1("["), cs('"tin_info"'), cp1("]"), cp1("["), cs('"business_name"'), cp1("]"), cp1(")")],
  [cx("    "), ck("await"), cx(" "), cf("click"), cp1("("), cs('"button[type=submit]"'), cp1(")")],
];

const CODE_LINE_HEIGHT = 30;
const CODE_FONT_SIZE = 20;
const CODE_GUTTER_WIDTH = 52;
const MONO = "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";

// ─── Agent log lines (matching Simplex CLI output style) ─────────────
type LogToken = { t: string; c: string };
const LOG_COLORS = {
  label: "#8B949E",
  text: "#C9D1D9",
  green: "#3FB950",
  cyan: "#58A6FF",
  yellow: "#E3B341",
  purple: "#BC8CFF",
  dim: "#484F58",
  orange: "#F0883E",
  red: "#F85149",
};

const L = {
  lbl: (t: string): LogToken => ({ t, c: LOG_COLORS.label }),
  txt: (t: string): LogToken => ({ t, c: LOG_COLORS.text }),
  grn: (t: string): LogToken => ({ t, c: LOG_COLORS.green }),
  cyn: (t: string): LogToken => ({ t, c: LOG_COLORS.cyan }),
  ylw: (t: string): LogToken => ({ t, c: LOG_COLORS.yellow }),
  pur: (t: string): LogToken => ({ t, c: LOG_COLORS.purple }),
  dim: (t: string): LogToken => ({ t, c: LOG_COLORS.dim }),
  org: (t: string): LogToken => ({ t, c: LOG_COLORS.orange }),
};

const LOG_LINES: LogToken[][] = [
  [L.lbl("Prompt: "), L.txt("Login to the portal")],
  [L.pur("● "), L.grn("Run"), L.txt(" (python "), L.ylw("workspace/flow.py"), L.txt(")")],
  [L.dim("  ⎿ "), L.txt("Execute flow.py with no arguments")],
  [],
  [L.lbl("Agent: "), L.txt("Flow completed login and 2FA successfully but failed at")],
  [L.txt('  "Navigate to Prior Auth" — the selector was not found')],
  [L.dim("  (Click ↵ or press Enter to expand)")],
  [L.pur("● "), L.grn("Screenshot")],
  [L.pur("● "), L.grn("Read"), L.txt(" ("), L.ylw("workspace/flow.py"), L.txt(")")],
  [],
  [L.lbl("Agent: "), L.txt('I can see the dashboard loaded. The "Prior Authorizations"')],
  [L.txt("  link is visible in the navigation menu.")],
  [L.dim("  (Click ↵ or press Enter to expand)")],
  [],
  [L.cyn("Calling agent to read page"), L.txt(" (First Prior Auth was selected)")],
  [L.dim("  ● "), L.txt("Retrieving new page content")],
  [L.dim("  ⎿ "), L.txt("Retrieving page info:")],
  [L.txt("    - url: "), L.ylw("availity.com/prior-auth")],
  [L.txt('    - partials: '), L.ylw('"Prior Auth"')],
  [],
  [L.lbl("Agent: "), L.txt("The data-testid='priorAuth-Link' exists in the DOM but")],
  [L.txt("  the click failed. The element is not visible.")],
  [L.dim("  (Click ↵ or press Enter to expand)")],
  [],
  [L.pur("● "), L.grn("Edit"), L.txt(" > "), L.ylw("workspace/flow.py"), L.txt(" v1 -1")],
  [],
  [L.grn("✓ "), L.org("PROGRESS")],
  [L.dim("  ● "), L.txt("Fixing Prior Auth nav issues (resuming flow)")],
  [],
  [L.lbl("Agent: "), L.txt("Now let me resume from the Navigate to Prior Auth section.")],
  [L.pur("● "), L.grn("Updated"), L.txt(" "), L.ylw("workspace/flow.py"), L.txt(' — run "Navigate to Prior Auth"')],
  [],
  [L.pur("● "), L.txt("Resume flow: Navigate to Prior Auth section")],
  [L.lbl("Agent: "), L.txt("Executed navigate, page type call succeeded. Now failed")],
  [L.txt('  at "Create New RA" — selector stale.')],
  [L.dim("  (Click ↵ or press Enter to expand)")],
  [],
  [L.lbl("Agent: "), L.txt("I can see the Prior Auth page loaded. The 'Create New")],
  [L.txt('  Request\' selector is stale. I can see "Create ..."')],
  [L.dim("  (Click ↵ or press Enter to expand)")],
];

// ─── File tree data (matching screenshot) ────────────────────────────
type FileTreeEntry = {
  name: string;
  type: "folder" | "file";
  depth: number;
  ext?: string;
};

const FILE_TREE: FileTreeEntry[] = [
  { name: "data/", type: "folder", depth: 0 },
  { name: "structured_output_schema.json", type: "file", depth: 1, ext: "json" },
  { name: "mcp_logs/", type: "folder", depth: 0 },
  { name: "mcp_tools.log", type: "file", depth: 1, ext: "log" },
  { name: "scratch_work/", type: "folder", depth: 0 },
  { name: "check_vars.py", type: "file", depth: 1, ext: "py" },
  { name: "dedup_icd.py", type: "file", depth: 1, ext: "py" },
  { name: "save_icd_codes.py", type: "file", depth: 1, ext: "py" },
  { name: "save_member.py", type: "file", depth: 1, ext: "py" },
  { name: "save_variables.py", type: "file", depth: 1, ext: "py" },
  { name: "workspace/", type: "folder", depth: 0 },
  { name: "field_mappings.json", type: "file", depth: 1, ext: "json" },
  { name: "flow.py", type: "file", depth: 1, ext: "py" },
];

const FILE_ICON_COLORS: Record<string, string> = {
  py: "#E3B341",
  json: "#58A6FF",
  log: "#8B949E",
};

const FLOW_PY_INDEX = FILE_TREE.length - 1; // last item

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

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

  const y = interpolate(progress, [0, 1], [20, 0], clamp);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], clamp);

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

// ─── Start Editor CTA (from EditorShowcase2) ─────────────────────────
function StartEditorCTA({
  frame,
  fps,
  enterDelay,
  isLoading,
  hoverProgress,
  clickScale,
}: {
  frame: number;
  fps: number;
  enterDelay: number;
  isLoading: boolean;
  hoverProgress: number;
  clickScale: number;
}) {
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay: enterDelay,
  });

  const ctaOpacity = interpolate(enterProgress, [0, 0.3], [0, 1], clamp);
  const ctaY = interpolate(enterProgress, [0, 1], [30, 0], clamp);
  const spinnerRotation = frame * 12;
  const buttonGlow = interpolate(hoverProgress, [0, 1], [0, 1], clamp);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.bg,
        opacity: ctaOpacity,
        transform: `translateY(${ctaY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "40px 96px",
          borderRadius: 20,
          backgroundColor: `rgba(63, 185, 80, ${0.15 + buttonGlow * 0.1})`,
          border: `2px solid rgba(63, 185, 80, ${0.4 + buttonGlow * 0.3})`,
          boxShadow:
            buttonGlow > 0
              ? `0 0 ${30 + buttonGlow * 30}px rgba(63, 185, 80, ${buttonGlow * 0.2})`
              : "none",
          transform: `scale(${clickScale})`,
          transformOrigin: "center center",
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "5px solid transparent",
                borderTopColor: "#4ADE80",
                borderRightColor: "#4ADE80",
                transform: `rotate(${spinnerRotation}deg)`,
              }}
            />
            <span
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: "#4ADE80",
                fontFamily: FONT_FAMILY,
              }}
            >
              Starting Editor...
            </span>
          </>
        ) : (
          <>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="#4ADE80">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: "#4ADE80",
                fontFamily: FONT_FAMILY,
              }}
            >
              Start Editor Session
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Browser page content ────────────────────────────────────────────
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
  const contentOpacity = interpolate(contentProgress, [0, 0.3], [0, 1], clamp);
  const contentY = interpolate(contentProgress, [0, 1], [30, 0], clamp);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(170deg, #F0F4FF 0%, #E8EDF8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        overflow: "hidden",
      }}
    >
      {/* Login card */}
      <div
        style={{
          width: 936,
          backgroundColor: "#FFFFFF",
          borderRadius: 31,
          boxShadow:
            "0 5px 38px rgba(0,0,0,0.06), 0 1px 5px rgba(0,0,0,0.04)",
          padding: "86px 86px 77px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Logo / brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 19,
            marginBottom: 43,
          }}
        >
          <svg width="67" height="67" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#1D6AE5" />
            <path
              d="M18 10v16M10 18h16"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#1A2740",
              fontFamily: FONT_FAMILY,
              letterSpacing: "-0.03em",
            }}
          >
            MedChart
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#7A8BA5",
              fontFamily: FONT_FAMILY,
              marginLeft: 5,
            }}
          >
            Patient Portal
          </span>
        </div>

        {/* Email field */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 29,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#3D4F66",
              fontFamily: FONT_FAMILY,
            }}
          >
            Email address
          </span>
          <div
            style={{
              width: "100%",
              height: 86,
              borderRadius: 17,
              border: "2px solid #D0D9E6",
              backgroundColor: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              paddingLeft: 29,
            }}
          >
            <span
              style={{
                fontSize: 29,
                color: "#A0AEC0",
                fontFamily: FONT_FAMILY,
              }}
            >
              you@example.com
            </span>
          </div>
        </div>

        {/* Password field */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#3D4F66",
                fontFamily: FONT_FAMILY,
              }}
            >
              Password
            </span>
            <span
              style={{
                fontSize: 24,
                color: "#1D6AE5",
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
              }}
            >
              Forgot password?
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 86,
              borderRadius: 17,
              border: "2px solid #D0D9E6",
              backgroundColor: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              paddingLeft: 29,
            }}
          >
            <span
              style={{
                fontSize: 29,
                color: "#A0AEC0",
                fontFamily: FONT_FAMILY,
              }}
            >
              Enter your password
            </span>
          </div>
        </div>

        {/* Sign In button */}
        <div
          style={{
            width: "100%",
            height: 91,
            borderRadius: 17,
            background: "linear-gradient(135deg, #1D6AE5, #1558C5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 29,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#FFFFFF",
              fontFamily: FONT_FAMILY,
            }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────

interface EditorPeekProps {
  baseDelay?: number;
  containerWidth: number;
  containerHeight: number;
  pythonTabDelay?: number;
  contentFadeDelay?: number;
}

export const EditorPeek: React.FC<EditorPeekProps> = ({
  baseDelay = 0,
  containerWidth,
  containerHeight,
  pythonTabDelay,
  contentFadeDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleBarHeight = 72;
  const tabHeight = 72;
  const sidebarTabHeight = 68;

  // ─── Sidebar reveal ───────────────────────────────────────────
  const sidebarDelay = baseDelay + 10;
  const sidebarProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: sidebarDelay,
  });
  const sidebarWidth = interpolate(sidebarProgress, [0, 1], [0, 560], clamp);

  const sidebarTabDelay = sidebarDelay + 8;
  const sidebarTabProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: sidebarTabDelay,
  });
  const sidebarTabOpacity = interpolate(
    sidebarTabProgress,
    [0, 0.4],
    [0, 1],
    clamp,
  );

  // ─── Tab bar ──────────────────────────────────────────────────
  const tabDelay = baseDelay + 20;

  // ─── CTA ──────────────────────────────────────────────────────
  const ctaDelay = baseDelay + 30;

  // ─── Transition timing ────────────────────────────────────────
  const transitionDelay = baseDelay + 165;

  // ─── Chat messages (after browser loads) ──────────────────────
  const chatDelay = transitionDelay + 10;

  // ─── Chat input typing animation ──────────────────────────────
  const typingDelay = transitionDelay + 50;
  const CHAT_INPUT_TEXT = "Login to the portal";

  const { typedText, cursorOpacity, typingEndFrame, doneTyping } =
    useTypingAnimation(frame, fps, {
      text: CHAT_INPUT_TEXT,
      charFrames: 2,
      delay: typingDelay,
    });

  // Focus highlight on the input border
  const focusProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: typingDelay - 5,
  });

  // Placeholder fade-out
  const placeholderOpacity = interpolate(
    frame,
    [typingDelay - 1, typingDelay + 5],
    [1, 0],
    clamp,
  );

  // Typed text fade-in, then clear at frame 425
  const textClearFrame = 425;
  const typedTextOpacity = interpolate(
    frame,
    [typingDelay - 1, typingDelay + 5, textClearFrame, textClearFrame + 5],
    [0, 1, 1, 0],
    clamp,
  );

  // Send button click delay (cursor + video timing added after sidebarFullWidth)
  const sendClickDelay = typingEndFrame + 25;
  const sendCursorMoveDelay = typingEndFrame + 5;

  // ─── Cursor path ──────────────────────────────────────────────
  const sidebarFullWidth = 560;
  const editorContentWidth = containerWidth - sidebarFullWidth;
  const contentAreaTop = titleBarHeight + tabHeight;
  const contentAreaHeight = containerHeight - contentAreaTop;
  const buttonX = sidebarFullWidth + editorContentWidth / 2;
  const buttonY = contentAreaTop + contentAreaHeight / 2;

  const cursorMoveDelay = baseDelay + 70;
  const {
    x: cursorX,
    y: cursorY,
    opacity: cursorPathOpacity,
  } = useCursorPath(frame, fps, {
    from: { x: buttonX + 600, y: buttonY + 350 },
    to: { x: buttonX, y: buttonY },
    delay: cursorMoveDelay,
    arcIntensity: 100,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 25, stiffness: 24, mass: 1.5 },
  });

  // ─── Click ────────────────────────────────────────────────────
  const clickDelay = baseDelay + 115;
  useCursorClick(frame, fps, { delay: clickDelay });

  const clickSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 2 },
    delay: clickDelay,
  });
  const cursorClickScale = interpolate(
    clickSpring,
    [0, 0.35, 1],
    [1, 0.7, 1],
    clamp,
  );
  const buttonClickScale = interpolate(
    clickSpring,
    [0, 0.35, 1],
    [1, 0.9, 1],
    clamp,
  );

  // ─── Hover glow ───────────────────────────────────────────────
  const hoverDelay = clickDelay - 12;
  const hoverProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 200 },
    delay: hoverDelay,
  });

  // ─── Loading state ────────────────────────────────────────────
  const isLoading = frame >= clickDelay + 18;

  // ─── Cursor exit ──────────────────────────────────────────────
  const cursorExitProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 30, mass: 2 },
    delay: clickDelay + 18,
  });
  const cursorExitX = interpolate(
    cursorExitProgress,
    [0, 1],
    [0, 1900],
    clamp,
  );
  const cursorExitY = interpolate(
    cursorExitProgress,
    [0, 1],
    [0, 1500],
    clamp,
  );

  // ─── CTA → Browser crossfade ─────────────────────────────────
  const ctaExitProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: transitionDelay,
  });
  const ctaFinalOpacity = interpolate(
    ctaExitProgress,
    [0, 1],
    [1, 0],
    clamp,
  );

  const browserEnterProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 140 },
    delay: transitionDelay + 5,
  });
  const browserOpacity = interpolate(
    browserEnterProgress,
    [0, 0.3],
    [0, 1],
    clamp,
  );

  const runningProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: transitionDelay + 10,
  });
  const runningOpacity = interpolate(
    runningProgress,
    [0, 0.3],
    [0, 1],
    clamp,
  );

  // ─── Zoom into chat area before typing ─────────────────────
  const zoomInDelay = transitionDelay + 40;
  const zoomInP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    delay: zoomInDelay,
  });
  // Zoom out after send click
  const zoomOutDelay = sendClickDelay + 15;
  const zoomOutP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    delay: zoomOutDelay,
  });
  const zoomScale = interpolate(zoomInP, [0, 1], [1, 2.8], clamp)
    - interpolate(zoomOutP, [0, 1], [0, 1.8], clamp);

  // ─── FILES tab click sequence (frames 555–748) ─────────────
  //
  // Timeline:
  //   590: cursor enters from LEFT
  //   620: cursor arrives at FILES tab
  //   645: MEATY click (25-frame pause)
  //   660: tab switch + file tree appears, cursor travels to flow.py
  //   690: zoom in starts
  //   714: MEATY click on flow.py
  //   743: cursor exits
  //   748: zoom out starts

  // ─── Phase 1: Cursor from LEFT to FILES tab ───────────────
  const filesCursorEnterDelay = 590;
  // FILES tab position: center of right half of sidebar, just below title bar
  const filesTabX = sidebarFullWidth / 2 + sidebarFullWidth / 4; // 420
  const filesTabY = titleBarHeight + sidebarTabHeight / 2; // 72 + 34 = 106
  const {
    x: filesCursorX,
    y: filesCursorY,
    opacity: filesCursorOpacity,
  } = useCursorPath(frame, fps, {
    from: { x: -200, y: filesTabY + 80 },
    to: { x: filesTabX, y: filesTabY },
    delay: filesCursorEnterDelay,
    arcIntensity: 50,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 25, stiffness: 24, mass: 1.5 },
  });

  // ─── Phase 2: MEATY click on FILES tab (frame 645) ────────
  const filesClickDelay = 645;
  useCursorClick(frame, fps, { delay: filesClickDelay });

  const filesClickSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 2 },
    delay: filesClickDelay,
  });
  const filesCursorClickScale = interpolate(
    filesClickSpring,
    [0, 0.35, 1],
    [1, 0.7, 1],
    clamp,
  );

  // Cursor travel + flow.py tracking computed after zoom values (see below)

  // Tab highlight swap at click
  const filesTabSwitchDelay = filesClickDelay;
  const filesTabActiveP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 180 },
    delay: filesTabSwitchDelay,
  });
  // Chat tab: active → inactive; Files tab: inactive → active
  const chatTabBorderColor = frame >= filesTabSwitchDelay
    ? `rgba(88, 166, 255, ${interpolate(filesTabActiveP, [0, 1], [1, 0], clamp)})`
    : COLORS.accent;
  const chatTabTextColor = frame >= filesTabSwitchDelay
    ? interpolate(filesTabActiveP, [0, 1], [0, 1], clamp) > 0.5
      ? COLORS.textDim
      : COLORS.textMuted
    : COLORS.textMuted;
  const filesTabBorderColor = frame >= filesTabSwitchDelay
    ? `rgba(88, 166, 255, ${interpolate(filesTabActiveP, [0, 1], [0, 1], clamp)})`
    : "transparent";
  const filesTabTextColor = frame >= filesTabSwitchDelay
    ? interpolate(filesTabActiveP, [0, 1], [0, 1], clamp) > 0.5
      ? COLORS.textMuted
      : COLORS.textDim
    : COLORS.textDim;

  // Sidebar content swap: logs fade out, file tree fades in
  const logsExitP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: filesTabSwitchDelay,
  });
  const logsExitOpacity = interpolate(logsExitP, [0, 1], [1, 0], clamp);

  const fileTreeEnterP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 140 },
    delay: filesTabSwitchDelay + 5,
  });
  const fileTreeOpacity = interpolate(fileTreeEnterP, [0, 0.3], [0, 1], clamp);

  // ─── Phase 3: Zoom into flow.py area (frame 690) ─────────
  const filesZoomInDelay = 690;
  const filesZoomInP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    delay: filesZoomInDelay,
  });

  // flow.py position in editor coords
  const fileTreeTopOffset = titleBarHeight + sidebarTabHeight + 22; // 72 + 68 + 22 = 162
  const flowPyCenterY = fileTreeTopOffset + FLOW_PY_INDEX * 32 + 16; // 162 + 384 + 16 = 562
  const flowPyCenterX = sidebarFullWidth / 2; // 280

  const filesZoomTargetScale = 2.5;
  const filesZoomInScale = interpolate(filesZoomInP, [0, 1], [1, filesZoomTargetScale], clamp);

  const filesZoomInTx = interpolate(filesZoomInP, [0, 1], [0, -(flowPyCenterX * filesZoomTargetScale - containerWidth / 2)], clamp);
  const filesZoomInTy = interpolate(filesZoomInP, [0, 1], [0, -(flowPyCenterY * filesZoomTargetScale - containerHeight / 2)], clamp);

  // Flow.py click + highlight (cursor is the same FILES cursor, computed after zoom)

  // ─── Phase 5: Zoom out (frame 748) ────────────────────────
  const filesZoomOutDelay = 748;
  const filesZoomOutP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    delay: filesZoomOutDelay,
  });

  const filesZoomOutScale = interpolate(filesZoomOutP, [0, 1], [0, filesZoomTargetScale - 1], clamp);
  const filesZoomOutTx = interpolate(filesZoomOutP, [0, 1], [0, -(flowPyCenterX * filesZoomTargetScale - containerWidth / 2)], clamp);
  const filesZoomOutTy = interpolate(filesZoomOutP, [0, 1], [0, -(flowPyCenterY * filesZoomTargetScale - containerHeight / 2)], clamp);

  // Combined files zoom
  const filesZoomScale = filesZoomInScale - filesZoomOutScale;
  const filesZoomTx = filesZoomInTx - filesZoomOutTx;
  const filesZoomTy = filesZoomInTy - filesZoomOutTy;

  // ─── Simplex agent status in chat area ─────────────────────
  const agentStatusDelay = chatDelay;
  const agentStatusP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay: agentStatusDelay,
  });
  const agentStatusEnterOpacity = interpolate(agentStatusP, [0, 0.3], [0, 1], clamp);
  const agentStatusY = interpolate(agentStatusP, [0, 1], [20, 0], clamp);

  // Fade out agent status at frame 425
  const logStartFrame = 425;
  const agentStatusFadeP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: logStartFrame,
  });
  const agentStatusFadeOut = interpolate(agentStatusFadeP, [0, 1], [1, 0], clamp);
  const agentStatusOpacity = agentStatusEnterOpacity * agentStatusFadeOut;

  // ─── Agent log reveal (frame 425+, one line every 5 frames) ───
  const LOG_LINE_INTERVAL = 5;
  const LOG_LINE_HEIGHT = 28;
  const LOG_FONT_SIZE = 17;

  // "Working..." shimmer — continuous sweep like useMetallicText
  const shimmerCycle = 45; // 1.5s at 30fps
  const shimmerPhase = ((frame - logStartFrame) % shimmerCycle) / shimmerCycle;
  const shimmerPos = interpolate(shimmerPhase, [0, 1], [-30, 130], clamp);
  const logsVisible = frame >= logStartFrame;

  // ─── Send button cursor path ────────────────────────────────
  const sendBtnX = sidebarFullWidth - 22 - 21; // 517
  const sendBtnY = containerHeight - 40;

  const {
    x: sendCursorX,
    y: sendCursorY,
    opacity: sendCursorOpacity,
  } = useCursorPath(frame, fps, {
    from: { x: sendBtnX + 300, y: sendBtnY + 200 },
    to: { x: sendBtnX, y: sendBtnY },
    delay: sendCursorMoveDelay,
    arcIntensity: 60,
    cursorSize: CURSOR_SIZE,
    springConfig: { damping: 25, stiffness: 30, mass: 1.2 },
  });

  useCursorClick(frame, fps, { delay: sendClickDelay });

  const sendClickSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 2 },
    delay: sendClickDelay,
  });
  const sendClickScale = interpolate(
    sendClickSpring,
    [0, 0.35, 1],
    [1, 0.85, 1],
    clamp,
  );
  const sendCursorClickScale = interpolate(
    sendClickSpring,
    [0, 0.35, 1],
    [1, 0.7, 1],
    clamp,
  );

  // Send cursor exits after click
  const sendCursorExitP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 30, mass: 2 },
    delay: sendClickDelay + 10,
  });
  const sendCursorExitX = interpolate(sendCursorExitP, [0, 1], [0, -800], clamp);
  const sendCursorExitY = interpolate(sendCursorExitP, [0, 1], [0, 400], clamp);

  // ─── Video playback (starts at frame 425) ──────────────────
  const videoPlayFrame = 425;
  const videoFadeP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 120 },
    delay: videoPlayFrame,
  });
  const videoOpacity = interpolate(videoFadeP, [0, 0.3], [0, 1], clamp);

  // Zoom: translate to center chat area in viewport when scaled
  // Chat input center ≈ (280, containerHeight - 80) in editor coords
  const chatCenterX = 280;
  const chatCenterY = containerHeight - 120;
  const zoomTx = interpolate(zoomInP, [0, 1], [0, -(chatCenterX * 2.8 - containerWidth / 2)], clamp)
    - interpolate(zoomOutP, [0, 1], [0, -(chatCenterX * 2.8 - containerWidth / 2)], clamp);
  const zoomTy = interpolate(zoomInP, [0, 1], [0, -(chatCenterY * 2.8 - containerHeight / 2)], clamp)
    - interpolate(zoomOutP, [0, 1], [0, -(chatCenterY * 2.8 - containerHeight / 2)], clamp);

  // Compose both zoom cycles: chat zoom is active first, then files zoom
  // Chat zoom completes well before frame 555, so they don't overlap
  const isFilesZoomActive = frame >= filesZoomInDelay;
  const combinedZoomTx = isFilesZoomActive ? filesZoomTx : zoomTx;
  const combinedZoomTy = isFilesZoomActive ? filesZoomTy : zoomTy;
  const combinedZoomScale = isFilesZoomActive ? filesZoomScale : zoomScale;

  // ─── FILES cursor → flow.py: single continuous cursor ──────────
  // After FILES click, cursor travels to flow.py tracking its screen position through zoom
  const filesCursorTravelP = spring({
    frame,
    fps,
    config: { damping: 25, stiffness: 24, mass: 1.5 },
    delay: filesClickDelay + 15,
  });

  // flow.py's screen position accounting for current zoom state
  const flowPyScreenX = combinedZoomTx + flowPyCenterX * combinedZoomScale;
  const flowPyScreenY = combinedZoomTy + flowPyCenterY * combinedZoomScale;
  const filesCursorExitX = interpolate(filesCursorTravelP, [0, 1], [0, flowPyScreenX - filesTabX], clamp);
  const filesCursorExitY = interpolate(filesCursorTravelP, [0, 1], [0, flowPyScreenY - filesTabY], clamp);

  // MEATY click on flow.py at frame 714
  const flowClickDelay = 714;
  useCursorClick(frame, fps, { delay: flowClickDelay });

  const flowClickSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 2 },
    delay: flowClickDelay,
  });
  const filesCursorFlowClickScale = interpolate(
    flowClickSpring,
    [0, 0.35, 1],
    [1, 0.7, 1],
    clamp,
  );

  // Row highlight appears WITH the click
  const flowPyHoverP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 160 },
    delay: flowClickDelay,
  });
  const flowPyHighlightBg = `rgba(88, 166, 255, ${interpolate(flowPyHoverP, [0, 1], [0, 0.15], clamp)})`;

  // Cursor exits after flow.py click hold
  const filesCursorFinalExitP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 30, mass: 2 },
    delay: 743,
  });
  const filesCursorFinalExitX = interpolate(filesCursorFinalExitP, [0, 1], [0, -600], clamp);
  const filesCursorFinalExitY = interpolate(filesCursorFinalExitP, [0, 1], [0, 400], clamp);

  // ─── Python tab switch (frame pythonTabDelay) ─────────────────
  const pyTabActive = pythonTabDelay != null && frame >= pythonTabDelay;
  const pyTabP = pythonTabDelay != null
    ? spring({ frame, fps, config: { damping: 200, stiffness: 180 }, delay: pythonTabDelay })
    : 0;
  // Browser tab: active → inactive
  const browserTabBg = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [1, 0], clamp) > 0.5
      ? COLORS.tabActive : "transparent"
    : COLORS.tabActive;
  const browserTabBorder = pyTabActive
    ? `3px solid rgba(88, 166, 255, ${interpolate(pyTabP as number, [0, 1], [1, 0], clamp)})`
    : `3px solid ${COLORS.accent}`;
  const browserTabTextWeight = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [1, 0], clamp) > 0.5 ? 500 : 400
    : 500;
  const browserTabTextColor = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [1, 0], clamp) > 0.5
      ? COLORS.text : COLORS.textMuted
    : COLORS.text;
  // flow.py tab: inactive → active
  const flowTabBg = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [0, 1], clamp) > 0.5
      ? COLORS.tabActive : "transparent"
    : "transparent";
  const flowTabBorder = pyTabActive
    ? `3px solid rgba(88, 166, 255, ${interpolate(pyTabP as number, [0, 1], [0, 1], clamp)})`
    : "3px solid transparent";
  const flowTabTextWeight = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [0, 1], clamp) > 0.5 ? 500 : 400
    : 400;
  const flowTabTextColor = pyTabActive
    ? interpolate(pyTabP as number, [0, 1], [0, 1], clamp) > 0.5
      ? COLORS.text : COLORS.textMuted
    : COLORS.textMuted;

  // Content crossfade: browser out, python code in
  const pyContentP = pythonTabDelay != null
    ? spring({ frame, fps, config: { damping: 200, stiffness: 120 }, delay: pythonTabDelay })
    : 0;
  const browserContentFade = pythonTabDelay != null
    ? interpolate(pyContentP as number, [0, 1], [1, 0], clamp)
    : 1;
  const pythonContentFade = pythonTabDelay != null
    ? interpolate(pyContentP as number, [0, 0.3], [0, 1], clamp)
    : 0;

  // ─── Content fade (everything except tab bar fades out) ──────
  const cFadeP = contentFadeDelay != null
    ? spring({ frame, fps, config: { damping: 200, stiffness: 180 }, delay: contentFadeDelay })
    : 0;
  const contentFadeOpacity = contentFadeDelay != null
    ? interpolate(cFadeP as number, [0, 1], [1, 0], clamp)
    : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        boxShadow: contentFadeOpacity < 1
          ? "none"
          : "0 -30px 80px rgba(0,0,0,0.5), 0 -10px 30px rgba(0,0,0,0.3), 0 0 100px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: contentFadeOpacity < 1
          ? `rgba(13, 17, 23, ${contentFadeOpacity})`
          : COLORS.bg,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transform: `translate(${combinedZoomTx}px, ${combinedZoomTy}px) scale(${combinedZoomScale})`,
        transformOrigin: "0 0",
      }}
    >
      {/* ═══ Title bar ═══ */}
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
          opacity: contentFadeOpacity,
        }}
      >
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
            <span style={{ color: "#737373" }}>
              /workflow/6d80bb22-0afc-4966-8d55-127f34b0b504/editor
            </span>
          </span>
        </div>
      </div>

      {/* ═══ Main content ═══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ─── Sidebar ─── */}
        <div
          style={{
            width: sidebarWidth,
            backgroundColor: COLORS.sidebar,
            borderRight: `1px solid ${COLORS.sidebarBorder}`,
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            opacity: contentFadeOpacity,
          }}
        >
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
                color: chatTabTextColor,
                fontFamily: FONT_FAMILY,
                borderBottom: `3px solid ${chatTabBorderColor}`,
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
                color: filesTabTextColor,
                fontFamily: FONT_FAMILY,
                borderBottom: `3px solid ${filesTabBorderColor}`,
              }}
            >
              Files
            </div>
          </div>


          <div
            style={{
              flex: 1,
              padding: 22,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Simplex agent status — centered with white-masked logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                flex: 1,
                paddingTop: 80,
                opacity: agentStatusOpacity,
                transform: `translateY(${agentStatusY}px)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#FFFFFF",
                    WebkitMaskImage: `url(${staticFile("simplex-black.png")})`,
                    maskImage: `url(${staticFile("simplex-black.png")})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: COLORS.text,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Simplex agent
                </span>
              </div>
              <span
                style={{
                  fontSize: 24,
                  color: COLORS.green,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Ready to receive input
              </span>
            </div>

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

            {/* Agent logs — revealed progressively from frame 425, fades out at FILES click */}
            {logsVisible && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: COLORS.sidebar,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: logsExitOpacity,
                }}
              >
                <div style={{ flex: 1, overflow: "hidden" }}>
                  {LOG_LINES.map((tokens, i) => {
                    const lineFrame = logStartFrame + i * LOG_LINE_INTERVAL;
                    const lineVisible = frame >= lineFrame;
                    if (!lineVisible) return null;

                    const lineAge = frame - lineFrame;
                    const lineOpacity = interpolate(lineAge, [0, 3], [0, 1], clamp);
                    const lineY = interpolate(lineAge, [0, 4], [8, 0], clamp);

                    return (
                      <div
                        key={i}
                        style={{
                          height: LOG_LINE_HEIGHT,
                          display: "flex",
                          alignItems: "center",
                          fontSize: LOG_FONT_SIZE,
                          fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                          whiteSpace: "pre",
                          opacity: lineOpacity,
                          transform: `translateY(${lineY}px)`,
                        }}
                      >
                        {tokens.map((tok, j) => (
                          <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* "Working..." shimmer fixed at bottom */}
                <div
                  style={{
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                    borderTop: `1px solid ${COLORS.sidebarBorder}`,
                    paddingTop: 8,
                  }}
                >
                  {/* Spinner */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: COLORS.purple,
                      borderRightColor: COLORS.purple,
                      transform: `rotate(${(frame - logStartFrame) * 12}deg)`,
                      flexShrink: 0,
                    }}
                  />
                  {/* Shimmer text */}
                  <span
                    style={{
                      fontSize: 16,
                      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                      fontWeight: 500,
                      backgroundImage: `linear-gradient(90deg, ${COLORS.purple} 0%, ${COLORS.purple} ${shimmerPos - 20}%, #E0CCFF ${shimmerPos}%, ${COLORS.purple} ${shimmerPos + 20}%, ${COLORS.purple} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      display: "inline-block",
                    }}
                  >
                    Working...
                  </span>
                </div>
              </div>
            )}

            {/* File tree — fades in after FILES tab click */}
            {frame >= filesTabSwitchDelay && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: COLORS.sidebar,
                  padding: "12px 0",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: fileTreeOpacity,
                }}
              >
                {FILE_TREE.map((entry, i) => {
                  const lineDelay = filesTabSwitchDelay + 5 + i * 2;
                  const lineAge = frame - lineDelay;
                  const lineOpacity = lineAge > 0
                    ? interpolate(lineAge, [0, 4], [0, 1], clamp)
                    : 0;
                  const lineY = lineAge > 0
                    ? interpolate(lineAge, [0, 5], [6, 0], clamp)
                    : 6;

                  const isFlowPy = i === FLOW_PY_INDEX;
                  const iconColor = entry.ext
                    ? FILE_ICON_COLORS[entry.ext] || COLORS.fileIcon
                    : undefined;

                  return (
                    <div
                      key={i}
                      style={{
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 18 + entry.depth * 24,
                        paddingRight: 12,
                        fontSize: 19,
                        fontFamily: FONT_FAMILY,
                        opacity: lineOpacity,
                        transform: `translateY(${lineY}px)`,
                        backgroundColor: isFlowPy ? flowPyHighlightBg : "transparent",
                      }}
                    >
                      {entry.type === "folder" ? (
                        <>
                          <span style={{ color: COLORS.textDim, marginRight: 6, fontSize: 16 }}>▾</span>
                          <span style={{ color: COLORS.text, fontWeight: 600 }}>{entry.name}</span>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: iconColor,
                              marginRight: 10,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              color: isFlowPy
                                ? interpolate(flowPyHoverP, [0, 1], [0, 1], clamp) > 0.5
                                  ? COLORS.text
                                  : COLORS.textMuted
                                : COLORS.textMuted,
                            }}
                          >
                            {entry.name}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          <div
            style={{
              height: 80,
              borderTop: `1px solid ${COLORS.sidebarBorder}`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              opacity: sidebarTabOpacity,
              flexShrink: 0,
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 50,
                borderRadius: 12,
                backgroundColor: "rgba(139, 148, 158, 0.08)",
                border: `1px solid ${interpolate(focusProgress, [0, 1], [0, 1], clamp) > 0.5 ? COLORS.accent : COLORS.tabBorder}`,
                boxShadow:
                  focusProgress > 0.5
                    ? `0 0 0 2px ${COLORS.accentDim}`
                    : "none",
                display: "flex",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Placeholder text — fades out when typing starts */}
              <span
                style={{
                  fontSize: 21,
                  color: COLORS.textDim,
                  fontFamily: FONT_FAMILY,
                  position: "absolute",
                  left: 20,
                  opacity: placeholderOpacity,
                  whiteSpace: "nowrap",
                }}
              >
                Ask the agent...
              </span>

              {/* Typed text + cursor */}
              <span
                style={{
                  fontSize: 21,
                  color: COLORS.text,
                  fontFamily: FONT_FAMILY,
                  opacity: typedTextOpacity,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {typedText}
                {!doneTyping && (
                  <span
                    style={{
                      color: COLORS.accent,
                      opacity: cursorOpacity,
                      marginLeft: 1,
                      fontWeight: 300,
                    }}
                  >
                    |
                  </span>
                )}
              </span>
            </div>

            {/* Send button — always visible, square */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                backgroundColor: COLORS.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${sendClickScale})`,
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 16V4M10 4l-5 5M10 4l5 5" />
              </svg>
            </div>
          </div>
        </div>

        {/* ─── Editor area ─── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Tab bar */}
          <div
            style={{
              height: tabHeight,
              backgroundColor: contentFadeOpacity < 1
                ? `rgba(28, 33, 40, ${contentFadeOpacity})`
                : COLORS.tabBar,
              borderBottom: contentFadeOpacity < 1
                ? `1px solid rgba(48, 54, 61, ${contentFadeOpacity})`
                : `1px solid ${COLORS.tabBorder}`,
              display: "flex",
              alignItems: "stretch",
              flexShrink: 0,
            }}
          >
            {TABS.map((tab, i) => {
              const isFileTab = tab.icon === "file";
              const tDelay = isFileTab
                ? transitionDelay + 5 + i * 5
                : tabDelay;
              const tProgress = spring({
                frame,
                fps,
                config: { damping: 200, stiffness: 180 },
                delay: tDelay,
              });
              const tOpacity = interpolate(
                tProgress,
                [0, 0.3],
                [0, 1],
                clamp,
              );
              const tY = interpolate(tProgress, [0, 1], [-10, 0], clamp);

              // Dynamic active state for python tab switch
              const isBrowser = tab.icon === "globe";
              const dynBg = isBrowser ? browserTabBg : flowTabBg;
              const dynBorder = isBrowser ? browserTabBorder : flowTabBorder;

              // Browser tab fades with content; flow.py tab stays
              const tabFade = isBrowser ? contentFadeOpacity : 1;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 28px",
                    gap: 14,
                    minWidth: tab.name === "Browser" ? 320 : 200,
                    backgroundColor: dynBg,
                    borderBottom: dynBorder,
                    borderRight: `1px solid ${COLORS.tabBorder}`,
                    opacity: tOpacity * tabFade,
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
                      color: isBrowser ? browserTabTextColor : flowTabTextColor,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: isBrowser ? browserTabTextWeight : flowTabTextWeight,
                    }}
                  >
                    {tab.name}
                  </span>
                  {tab.name === "Browser" && !pyTabActive && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginLeft: 12,
                        opacity: runningOpacity,
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

          {/* ═══ Content: CTA → Browser crossfade ═══ */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              opacity: contentFadeOpacity,
            }}
          >
            {/* CTA (visible first, fades out after click) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: ctaFinalOpacity,
              }}
            >
              <StartEditorCTA
                frame={frame}
                fps={fps}
                enterDelay={ctaDelay}
                isLoading={isLoading}
                hoverProgress={hoverProgress}
                clickScale={buttonClickScale}
              />
            </div>

            {/* Browser viewport (fades in after transition, fades out at python tab) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: browserOpacity * browserContentFade,
                overflow: "hidden",
              }}
            >
              {/* Static start image */}
              <Img
                src={staticFile("video_start.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Video — fades in after zoom-out */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: videoOpacity,
                }}
              >
                <Sequence from={videoPlayFrame} layout="none">
                  <OffthreadVideo
                    src={staticFile("video_trimmed.mp4")}
                    playbackRate={8}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Sequence>
              </div>
            </div>

            {/* Python code view (fades in when flow.py tab activates) */}
            {pythonTabDelay != null && frame >= pythonTabDelay - 5 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: COLORS.bg,
                  opacity: pythonContentFade,
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                {/* Gutter (line numbers) */}
                <div
                  style={{
                    width: CODE_GUTTER_WIDTH,
                    backgroundColor: COLORS.bg,
                    paddingTop: 14,
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                >
                  {CODE_LINES.map((_, ci) => {
                    const lineDelay = pythonTabDelay + 4 + ci * 1.2;
                    const lineP = spring({
                      frame,
                      fps,
                      config: { damping: 200, stiffness: 200 },
                      delay: lineDelay,
                    });
                    const lineOpacity = interpolate(lineP, [0, 0.3], [0, 1], clamp);

                    return (
                      <div
                        key={ci}
                        style={{
                          height: CODE_LINE_HEIGHT,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 14,
                          fontSize: CODE_FONT_SIZE - 2,
                          fontFamily: MONO,
                          color: TC.lineNum,
                          opacity: lineOpacity,
                        }}
                      >
                        {ci + 1}
                      </div>
                    );
                  })}
                </div>

                {/* Code content */}
                <div
                  style={{
                    flex: 1,
                    paddingTop: 14,
                    paddingLeft: 16,
                    overflow: "hidden",
                  }}
                >
                  {CODE_LINES.map((tokens, ci) => {
                    const lineDelay = pythonTabDelay + 4 + ci * 1.2;
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
                        key={ci}
                        style={{
                          height: CODE_LINE_HEIGHT,
                          display: "flex",
                          alignItems: "center",
                          fontSize: CODE_FONT_SIZE,
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
            )}
          </div>
        </div>
      </div>

      {/* ═══ Cursor overlay ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
          opacity: contentFadeOpacity,
        }}
      >
        {/* CTA cursor (initial click) */}
        <Img
          src={staticFile("cursor.png")}
          style={{
            position: "absolute",
            left: cursorX + cursorExitX,
            top: cursorY + cursorExitY,
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            opacity: cursorPathOpacity,
            transform: `scale(${cursorClickScale})`,
            transformOrigin: "top left",
          }}
        />

        {/* Send button cursor */}
        <Img
          src={staticFile("cursor.png")}
          style={{
            position: "absolute",
            left: sendCursorX + sendCursorExitX,
            top: sendCursorY + sendCursorExitY,
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            opacity: sendCursorOpacity,
            transform: `scale(${sendCursorClickScale})`,
            transformOrigin: "top left",
          }}
        />

      </div>
    </div>

    {/* FILES → flow.py cursor — rendered OUTSIDE zoom container for correct z-order */}
    <Img
      src={staticFile("cursor.png")}
      style={{
        position: "absolute",
        left: filesCursorX + filesCursorExitX + filesCursorFinalExitX,
        top: filesCursorY + filesCursorExitY + filesCursorFinalExitY,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        opacity: filesCursorOpacity,
        transform: `scale(${filesCursorClickScale * filesCursorFlowClickScale})`,
        transformOrigin: "top left",
        zIndex: 100,
      }}
    />
    </div>
  );
};
