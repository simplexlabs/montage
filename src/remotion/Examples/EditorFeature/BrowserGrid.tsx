import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY, TEXT_FINISH, useMaskedRise } from "../../shared/animations";

const COLS = 5;
const ROWS = 3;
const TOTAL_CELLS = COLS * ROWS;

const GRID_PADDING_X = 120;
const GRID_PADDING_TOP = 180;
const GRID_PADDING_BOTTOM = 80;
const CELL_GAP = 24;
const TITLE_BAR_HEIGHT = 36;

const CANVAS_W = 3072;
const CANVAS_H = 1728;

const CELL_W =
  (CANVAS_W - 2 * GRID_PADDING_X - (COLS - 1) * CELL_GAP) / COLS;
const CELL_H =
  (CANVAS_H - GRID_PADDING_TOP - GRID_PADDING_BOTTOM - (ROWS - 1) * CELL_GAP) /
  ROWS;

// Grid center for entrance animation
const GRID_CENTER_X = CANVAS_W / 2;
const GRID_CENTER_Y = CANVAS_H / 2;

// Semi-random checkmark reveal order
const CHECK_ORDER = [7, 2, 11, 0, 14, 5, 9, 3, 12, 6, 1, 13, 8, 4, 10];

// Video startFrom offsets per cell (60 frames apart)
const VIDEO_OFFSETS = [
  0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840,
];

function getCellPosition(index: number) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const x = GRID_PADDING_X + col * (CELL_W + CELL_GAP);
  const y = GRID_PADDING_TOP + row * (CELL_H + CELL_GAP);
  return { x, y, centerX: x + CELL_W / 2, centerY: y + CELL_H / 2 };
}

const TrafficLights: React.FC = () => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
      <div
        key={color}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    ))}
  </div>
);

const Checkmark: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "rgba(34, 197, 94, 0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          opacity,
          boxShadow: "0 4px 20px rgba(34, 197, 94, 0.4)",
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
};

const BrowserCell: React.FC<{
  index: number;
  entranceProgress: number;
  checkProgress: number;
}> = ({ index, entranceProgress, checkProgress }) => {
  const pos = getCellPosition(index);

  // Entrance: scale from center of grid to final position
  const translateX = interpolate(
    entranceProgress,
    [0, 1],
    [GRID_CENTER_X - pos.centerX, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateY = interpolate(
    entranceProgress,
    [0, 1],
    [GRID_CENTER_Y - pos.centerY, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scale = interpolate(entranceProgress, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cellOpacity = interpolate(entranceProgress, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crossfade: browser content fades in as cell nears its final position
  // entranceProgress 0.5 → 1.0 maps to content opacity 0 → 1
  const contentOpacity = interpolate(entranceProgress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: CELL_W,
        height: CELL_H,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity: cellOpacity,
        backgroundColor: "#1E1E2E",
      }}
    >
      {/* Browser chrome + video — crossfades in over the dark code-colored base */}
      <div style={{ opacity: contentOpacity }}>
        {/* Title bar */}
        <div
          style={{
            height: TITLE_BAR_HEIGHT,
            backgroundColor: "#1E1E2E",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
          }}
        >
          <TrafficLights />
          <span
            style={{
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 400,
            }}
          >
            simplex.sh/session-{index + 1}
          </span>
          <div style={{ width: 60 }} />
        </div>

        {/* Video content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: CELL_H - TITLE_BAR_HEIGHT,
            backgroundColor: "#0D0D1A",
          }}
        >
          <OffthreadVideo
            src={staticFile("video_trimmed.mp4")}
            startFrom={VIDEO_OFFSETS[index]}
            playbackRate={4}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />

          {/* Checkmark overlay */}
          {checkProgress > 0 && <Checkmark progress={checkProgress} />}
        </div>
      </div>
    </div>
  );
};

export const BrowserGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heading with masked rise
  const heading = useMaskedRise(frame, fps, {
    delay: 15,
    yOffset: 50,
    springConfig: { damping: 20, stiffness: 100 },
  });

  // Per-cell entrance springs (staggered 3 frames apart)
  const cellEntrances = Array.from({ length: TOTAL_CELLS }, (_, i) =>
    spring({
      frame,
      fps,
      delay: i * 3,
      config: { damping: 14, stiffness: 120, mass: 0.8 },
    }),
  );

  // Checkmark springs (starting at frame 120, 6 frames apart)
  const checkProgresses = Array.from({ length: TOTAL_CELLS }, (_, i) => {
    const orderIndex = CHECK_ORDER.indexOf(i);
    const checkDelay = 120 + orderIndex * 6;
    return spring({
      frame,
      fps,
      delay: checkDelay,
      config: { damping: 14, stiffness: 180, mass: 0.6 },
    });
  });

  // Count completed checks
  const completedCount = CHECK_ORDER.reduce((count, cellIdx, orderIdx) => {
    const checkDelay = 120 + orderIdx * 6;
    if (frame >= checkDelay + 10) return count + 1;
    return count;
  }, 0);

  // Counter badge visibility
  const counterProgress = spring({
    frame,
    fps,
    delay: 130,
    config: { damping: 20, stiffness: 120 },
  });

  // Fade-out at end (frames 240-270)
  const fadeOut = interpolate(frame, [240, 270], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleOut = interpolate(frame, [240, 270], [1, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scaleOut})`,
        opacity: fadeOut,
      }}
    >
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div style={heading.containerStyle}>
          <div
            style={{
              ...heading.contentStyle,
              ...TEXT_FINISH,
              fontFamily: FONT_FAMILY,
              fontSize: 64,
              fontWeight: 700,
              color: "#1a1a2e",
              letterSpacing: -1,
            }}
          >
            Running across 15 browser sessions
          </div>
        </div>
      </div>

      {/* Grid cells */}
      {Array.from({ length: TOTAL_CELLS }, (_, i) => (
        <BrowserCell
          key={i}
          index={i}
          entranceProgress={cellEntrances[i]}
          checkProgress={checkProgresses[i]}
        />
      ))}

      {/* Counter badge */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          opacity: counterProgress,
          transform: `translateY(${interpolate(counterProgress, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <div
          style={{
            ...TEXT_FINISH,
            fontFamily: FONT_FAMILY,
            fontSize: 38,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "rgba(34, 197, 94, 0.85)",
            padding: "12px 40px",
            borderRadius: 50,
            boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
            letterSpacing: 0.5,
          }}
        >
          ✓ {Math.min(completedCount, 15)}/15 sessions complete
        </div>
      </div>
    </AbsoluteFill>
  );
};
