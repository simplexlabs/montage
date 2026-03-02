import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const INDIGO = "#6366F1";
const LOCK_SIZE = 200;
const RECT_PADDING = 40;
const RECT_HEIGHT = LOCK_SIZE + RECT_PADDING * 2;
const RECT_FINAL_WIDTH = LOCK_SIZE + RECT_PADDING * 2;
const RECT_RADIUS = 24;
const CURSOR_SIZE = 200;

// Cursor start position — bottom-right of screen relative to the centered container.
// Container is 280×280 centered in 3072×1728, so container top-left is at (1396, 724).
// Bottom-right of viewport in container coords: (3072−1396, 1728−724) = (1676, 1004).
// Offset 100px up as requested.
const CURSOR_START_X = 1676;
const CURSOR_START_Y = 904;

// Cursor landing position — top-left of the rectangle
const CURSOR_LAND_X = -100;
const CURSOR_LAND_Y = -50;

// Cursor final position — bottom-right corner of the rectangle
const CURSOR_END_X = RECT_FINAL_WIDTH - 10;
const CURSOR_END_Y = RECT_HEIGHT - 30;

export const LockReveal: React.FC<{ delay?: number }> = ({ delay: baseDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // =====================
  // Phase 1: Cursor swoops in from bottom-right to top-left of lock
  // =====================
  const entryP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
    delay: baseDelay,
  });
  const cursorFadeP = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: baseDelay,
  });
  const cursorOpacity = interpolate(cursorFadeP, [0, 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Arc for swooping motion (peaks mid-entry, bows upward)
  const entryArc = Math.sin(entryP * Math.PI) * -250;

  // =====================
  // Phase 2: Rectangle expands left → right (3× slower), cursor drags to bottom-right
  // =====================
  const expandP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 15 },
    delay: baseDelay + 18,
  });
  const rectWidth = interpolate(expandP, [0, 1], [0, RECT_FINAL_WIDTH]);

  // Lock fades in as the rectangle reveals it
  const lockOpacity = interpolate(expandP, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // =====================
  // Compose cursor position (additive phases)
  // Entry: (1676, 904) → (-100, -50) with arc
  // Drag:  (-100, -50) → (RECT_FINAL_WIDTH-10, RECT_HEIGHT-30)
  // =====================
  const cursorX =
    CURSOR_START_X +
    interpolate(entryP, [0, 1], [0, CURSOR_LAND_X - CURSOR_START_X]) +
    interpolate(expandP, [0, 1], [0, CURSOR_END_X - CURSOR_LAND_X]);

  const cursorY =
    CURSOR_START_Y +
    interpolate(entryP, [0, 1], [0, CURSOR_LAND_Y - CURSOR_START_Y]) +
    entryArc +
    interpolate(expandP, [0, 1], [0, CURSOR_END_Y - CURSOR_LAND_Y]);

  // Subtle breathing oscillation
  const breathe = Math.sin(frame * 0.12) * 0.03;
  const cursorBreathScale = 1 + breathe;

  // =====================
  // Phase 3: Click on lock (after expansion settles)
  // =====================
  const clickDown = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: baseDelay + 90,
  });
  const clickUp = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: baseDelay + 95,
  });
  const clickScale = 1 - 0.08 * clickDown + 0.08 * clickUp;

  // Lock pulse on click
  const lockPulseP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 200 },
    delay: baseDelay + 91,
  });
  const lockPulseScale = interpolate(lockPulseP, [0, 0.5, 1], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow ring behind lock on click
  const glowP = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: baseDelay + 90,
  });
  const glowOpacity = interpolate(glowP, [0, 1], [0, 0.4]);
  const glowScale = interpolate(glowP, [0, 1], [0.8, 1.2]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: RECT_FINAL_WIDTH,
          height: RECT_HEIGHT,
        }}
      >
        {/* Glow ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: RECT_FINAL_WIDTH * 1.5,
            height: RECT_HEIGHT * 1.5,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${INDIGO}40 0%, transparent 70%)`,
            opacity: glowOpacity,
            transform: `translate(-50%, -50%) scale(${glowScale})`,
          }}
        />

        {/* Expanding rectangle (clips the lock) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: rectWidth,
            height: RECT_HEIGHT,
            overflow: "visible",
            borderRadius: RECT_RADIUS,
            border: "1px solid rgba(0, 0, 0, 0.15)",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          {/* Fixed inner container keeps lock centered at final position */}
          <div
            style={{
              width: RECT_FINAL_WIDTH,
              height: RECT_HEIGHT,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("simplex-lock.png")}
              style={{
                width: LOCK_SIZE,
                height: LOCK_SIZE,
                objectFit: "contain",
                transform: `scale(${lockPulseScale})`,
                opacity: lockOpacity,
              }}
            />
          </div>
        </div>

        {/* Cursor — swoops in from bottom-right, drags to bottom-right of rectangle */}
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            transform: `scale(${clickScale * cursorBreathScale})`,
            transformOrigin: "top left",
            opacity: cursorOpacity,
          }}
        >
          <Img
            src={staticFile("cursor.png")}
            style={{
              width: CURSOR_SIZE,
              height: CURSOR_SIZE,
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
