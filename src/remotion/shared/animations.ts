import type React from "react";
import { Easing, interpolate, interpolateColors, spring } from "remotion";
import type { SpringConfig } from "remotion";

/** Primary font family — SF Pro Display with system fallbacks */
export const FONT_FAMILY =
  '"SF Pro Display", "Helvetica Neue", Arial, sans-serif';

/**
 * Typing animation: reveals text character-by-character with a blinking cursor.
 * Extracted from TerminalContent's typing logic.
 *
 * Returns the visible substring, completion state, cursor blink opacity,
 * and the frame at which typing finishes (useful for chaining subsequent animations).
 *
 * - **charFrames**: frames between each character (default 2 — fast typing)
 * - **delay**: frames to wait before typing starts (default 0)
 * - **cursorBlinkFrames**: full blink cycle length (default 16)
 */
export function useTypingAnimation(
  frame: number,
  fps: number,
  options: {
    text: string;
    charFrames?: number;
    delay?: number;
    cursorBlinkFrames?: number;
  },
): {
  typedText: string;
  doneTyping: boolean;
  cursorOpacity: number;
  typingEndFrame: number;
} {
  const {
    text,
    charFrames = 2,
    delay = 0,
    cursorBlinkFrames = 16,
  } = options;

  const typingFrame = Math.max(0, frame - delay);
  const typedChars = Math.min(text.length, Math.floor(typingFrame / charFrames));
  const typedText = text.slice(0, typedChars);
  const doneTyping = typedChars >= text.length;
  const typingEndFrame = delay + text.length * charFrames;

  const cursorOpacity = interpolate(
    frame % cursorBlinkFrames,
    [0, cursorBlinkFrames / 2, cursorBlinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return { typedText, doneTyping, cursorOpacity, typingEndFrame };
}

/**
 * Letter pop-in: scale 0→1, fast opacity ramp. Used for bold headline text.
 * Extracted from SimplexText.
 */
export function useLetterPopIn(
  frame: number,
  fps: number,
  options: {
    index: number;
    stagger?: number;
    springConfig?: Partial<SpringConfig>;
  },
): React.CSSProperties {
  const {
    index,
    stagger = 2,
    springConfig = { damping: 17, stiffness: 288 },
  } = options;

  const delay = index * stagger;
  const progress = spring({ frame, fps, config: springConfig, delay });

  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return {
    display: "inline-block",
    transform: `scale(${scale})`,
    opacity,
    transformOrigin: "center bottom",
  };
}

/**
 * Word drag-in: scale 0.7→1, translateY 20→0, non-linear opacity.
 * Used for lighter body text that fades/drags into place.
 * Extracted from TaglineText.
 */
export function useWordDragIn(
  frame: number,
  fps: number,
  options: {
    index: number;
    stagger?: number;
    baseDelay?: number;
    origin?: "center bottom" | "center top";
    springConfig?: Partial<SpringConfig>;
  },
): React.CSSProperties {
  const {
    index,
    stagger = 3,
    baseDelay = 0,
    origin = "center bottom",
    springConfig = { damping: 28, stiffness: 120 },
  } = options;

  const delay = baseDelay + index * stagger;
  const progress = spring({ frame, fps, config: springConfig, delay });

  const dragY = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    display: "inline-block",
    transform: `translateY(${dragY}px)`,
    opacity,
    transformOrigin: origin,
  };
}

// =====================================================================
// New animation templates — Apple-style motion language
// =====================================================================

/**
 * Masked Rise: Text slides up from behind an invisible horizontal mask.
 * Apple "pop-up slide" — fast start, smooth settle, with motion blur.
 *
 * Returns TWO style objects:
 * - **containerStyle**: apply to the wrapper div (handles overflow clipping)
 * - **contentStyle**: apply to the inner text element (handles motion)
 *
 * Usage:
 * ```tsx
 * const { containerStyle, contentStyle } = useMaskedRise(frame, fps, { delay: 10 });
 * return (
 *   <div style={containerStyle}>
 *     <div style={contentStyle}>Header Text</div>
 *   </div>
 * );
 * ```
 */
export function useMaskedRise(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    yOffset?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): { containerStyle: React.CSSProperties; contentStyle: React.CSSProperties } {
  const {
    delay = 0,
    yOffset = 60,
    springConfig = { damping: 20, stiffness: 100 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const translateY = interpolate(progress, [0, 1], [yOffset, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Motion blur proportional to velocity (strongest mid-transition)
  const velocity = 1 - progress;
  const blurAmount = interpolate(velocity, [0, 0.5, 1], [0, 3, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    containerStyle: {
      overflow: "visible",
      display: "inline-block",
    },
    contentStyle: {
      display: "inline-block",
      transform: `translateY(${translateY}px)`,
      opacity,
      filter: `blur(${blurAmount}px)`,
      transformOrigin: "center bottom",
    },
  };
}

/**
 * Gradient Fill: Text starts light gray and "fills in" with target color
 * from left to right via an animated gradient mask on the text.
 *
 * Apply the returned style to a text element. The text MUST use
 * `WebkitBackgroundClip: "text"` (included in returned style).
 *
 * Usage:
 * ```tsx
 * const style = useGradientFill(frame, fps, {
 *   delay: 0,
 *   color: "#111827",
 *   baseColor: "#D1D5DB",
 * });
 * return <span style={{ ...style, fontSize: 60 }}>Engineered for portals</span>;
 * ```
 */
export function useGradientFill(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    color?: string;
    baseColor?: string;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    color = "#111827",
    baseColor = "#D1D5DB",
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  // Gradient position: moves from -20% to 120% (with 20% soft edge)
  const gradientPos = interpolate(progress, [0, 1], [-20, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    backgroundImage: `linear-gradient(90deg, ${color} ${gradientPos - 10}%, ${baseColor} ${gradientPos + 10}%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline-block",
  };
}

/**
 * Wipe Reveal: Content is revealed by a left-to-right clip-path wipe.
 * The leading edge has a soft blur for a polished transition.
 *
 * Usage:
 * ```tsx
 * const style = useWipeReveal(frame, fps, { delay: 0 });
 * return <div style={style}>Scene content here</div>;
 * ```
 */
export function useWipeReveal(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    direction?: "left" | "right";
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    direction = "left",
    springConfig = { damping: 20, stiffness: 200 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  // clipPath inset: top, right, bottom, left
  // Wipe from left: left inset goes from 100% to 0%
  // Wipe from right: right inset goes from 100% to 0%
  const clipAmount = interpolate(progress, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clipPath =
    direction === "left"
      ? `inset(0% ${clipAmount}% 0% 0%)`
      : `inset(0% 0% 0% ${clipAmount}%)`;

  return {
    clipPath,
    WebkitClipPath: clipPath,
    display: "inline-block",
  };
}

/**
 * Scale Pop: Element scales from small → overshoot → settle.
 * Classic "icon pop" for small UI elements, badges, buttons.
 *
 * Usage:
 * ```tsx
 * const style = useScalePop(frame, fps, { index: 2, stagger: 5, delay: 10 });
 * return <div style={style}><Icon /></div>;
 * ```
 */
export function useScalePop(
  frame: number,
  fps: number,
  options: {
    index?: number;
    stagger?: number;
    delay?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    index = 0,
    stagger = 5,
    delay = 0,
    springConfig = { damping: 12, stiffness: 200 },
  } = options;

  const totalDelay = delay + index * stagger;
  const progress = spring({ frame, fps, config: springConfig, delay: totalDelay });

  // Scale: 0.6 → overshoot to ~1.1 → settle at 1.0
  // The spring with low damping naturally overshoots, but we also shape it
  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  return {
    display: "inline-block",
    transform: `scale(${scale})`,
    opacity,
    transformOrigin: "center center",
  };
}

/**
 * Growing Underline: A thin line grows from center outward (or left-to-right)
 * underneath text. Apply to a div positioned below the text.
 *
 * Usage:
 * ```tsx
 * const underlineStyle = useGrowingUnderline(frame, fps, { delay: 20 });
 * return (
 *   <div>
 *     <span>https://simplex.sh</span>
 *     <div style={underlineStyle} />
 *   </div>
 * );
 * ```
 */
export function useGrowingUnderline(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    height?: number;
    color?: string;
    direction?: "center" | "left";
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    height = 3,
    color = "#6366F1",
    direction = "center",
    springConfig = { damping: 200, stiffness: 120 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const scaleX = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    width: "100%",
    height,
    backgroundColor: color,
    transform: `scaleX(${scaleX})`,
    transformOrigin: direction === "center" ? "center center" : "left center",
    borderRadius: height / 2,
  };
}

/**
 * Floating Text: keyframed wave motion matching:
 * 0% -> translateY(0), 50% -> translateY(-20px), 100% -> translateY(0).
 *
 * The motion loops every 0.7 seconds by default and is applied to the
 * whole text element (word/phrase), not per-letter.
 *
 * Usage:
 * ```tsx
 * const style = useFloatingText(frame, fps, { delay: 8 });
 * return <span style={style}>floating text</span>;
 * ```
 */
export function useFloatingText(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    amplitude?: number;
    cycleDurationInFrames?: number;
    centeredAroundZero?: boolean;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    amplitude = 20,
    cycleDurationInFrames = Math.round(0.7 * fps),
    centeredAroundZero = false,
  } = options;

  const localFrame = Math.max(0, frame - delay);
  const safeCycle = Math.max(2, cycleDurationInFrames);
  const halfCycle = safeCycle / 2;
  const loopFrame = localFrame % safeCycle;

  const translateY = centeredAroundZero
    ? (() => {
        const halfAmplitude = amplitude / 2;
        return loopFrame <= halfCycle
          ? interpolate(loopFrame, [0, halfCycle], [-halfAmplitude, halfAmplitude], {
              easing: Easing.inOut(Easing.sin),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : interpolate(loopFrame, [halfCycle, safeCycle], [halfAmplitude, -halfAmplitude], {
              easing: Easing.inOut(Easing.sin),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
      })()
    : loopFrame <= halfCycle
      ? interpolate(loopFrame, [0, halfCycle], [0, -amplitude], {
          easing: Easing.inOut(Easing.sin),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(loopFrame, [halfCycle, safeCycle], [-amplitude, 0], {
          easing: Easing.inOut(Easing.sin),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return {
    display: "inline-block",
    transform: `translateY(${translateY}px)`,
    transformOrigin: "center center",
    willChange: "transform",
  };
}

/**
 * XZ Plane Sway: Subtle 3D text rotation back and forth across X and Z axes.
 *
 * Designed for emphasis moments where text should feel alive but still readable.
 * Applies a spring-gated oscillation (sine wave) with a natural ease-in/ease-out
 * envelope so the motion starts softly and settles cleanly.
 *
 * Returns TWO style objects:
 * - **containerStyle**: apply to a wrapper (adds perspective)
 * - **contentStyle**: apply to the text element (adds rotateX/rotateZ motion)
 *
 * Usage:
 * ```tsx
 * const { containerStyle, contentStyle } = useXZPlaneSway(frame, fps, { delay: 20 });
 * return (
 *   <div style={containerStyle}>
 *     <span style={contentStyle}>Launch headline</span>
 *   </div>
 * );
 * ```
 */
export function useXZPlaneSway(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    durationInFrames?: number;
    rotateXDeg?: number;
    rotateZDeg?: number;
    oscillations?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): { containerStyle: React.CSSProperties; contentStyle: React.CSSProperties } {
  const {
    delay = 0,
    durationInFrames = Math.round(1.2 * fps),
    rotateXDeg = 5,
    rotateZDeg = 2,
    oscillations = 2,
    springConfig = { damping: 200, stiffness: 120 },
  } = options;

  const safeDuration = Math.max(1, durationInFrames);
  const localFrame = frame - delay;

  const progress = spring({
    frame: localFrame,
    fps,
    config: springConfig,
    durationInFrames: safeDuration,
  });

  const phase = interpolate(localFrame, [0, safeDuration], [0, Math.PI * 2 * oscillations], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const envelope = interpolate(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotateX = Math.sin(phase) * rotateXDeg * envelope;
  const rotateZ = Math.cos(phase * 0.9) * rotateZDeg * envelope;
  const depthJitter = interpolate(Math.abs(Math.sin(phase)), [0, 1], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * envelope;

  return {
    containerStyle: {
      display: "inline-block",
      perspective: 2200,
      transformStyle: "preserve-3d",
    },
    contentStyle: {
      display: "inline-block",
      transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateZ(${depthJitter}px)`,
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
    },
  };
}

// =====================================================================
// Cursor & interaction animation templates
// =====================================================================

/**
 * Cursor Path: Moves a cursor along a smooth curved (bezier) path
 * from a start point to a target point. Returns x, y, and opacity.
 *
 * The path uses a sinusoidal arc to create the natural curved motion
 * cursors take when moving to a target (never perfectly straight).
 *
 * When `cursorSize` is provided, the returned x/y are pre-adjusted for the
 * cursor.png tip offset — use them directly as `left`/`top` on the image.
 *
 * Usage:
 * ```tsx
 * const { x, y, opacity } = useCursorPath(frame, fps, {
 *   from: { x: 800, y: 600 },
 *   to: { x: 200, y: 300 },
 *   delay: 10,
 *   cursorSize: 60,
 * });
 * return <Img src={staticFile("cursor.png")} style={{ position: "absolute", left: x, top: y, opacity, width: 60, height: 60 }} />;
 * ```
 */
export function useCursorPath(
  frame: number,
  fps: number,
  options: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    delay?: number;
    arcIntensity?: number;
    cursorSize?: number;
    springConfig?: Partial<SpringConfig>;
  },
): { x: number; y: number; opacity: number } {
  const {
    from,
    to,
    delay = 0,
    arcIntensity = 150,
    cursorSize = 0,
    springConfig = { damping: 20, stiffness: 30 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  // Asymmetric arc: peaks at ~35% of progress, tapers naturally.
  // Creates a human-like drift-then-correct path, not a symmetric parabola.
  const arcRaw =
    Math.sin(progress * Math.PI * 1.3) *
    Math.pow(Math.max(0, 1 - progress), 0.6);
  const arc = arcRaw * arcIntensity;

  // Direction perpendicular to the path for the arc
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -dy / len;
  const perpY = dx / len;

  const tipX = interpolate(progress, [0, 1], [from.x, to.x]) + perpX * arc;
  const tipY = interpolate(progress, [0, 1], [from.y, to.y]) + perpY * arc;

  // When cursorSize is provided, offset so the cursor.png visible tip
  // aligns with the coordinates. Tip is ~50% from left, ~25% from top of image.
  const x = tipX - cursorSize * 0.38 + 8;
  const y = tipY - cursorSize * 0.18;

  const opacity = interpolate(progress, [0, 0.05], [0, 1], {
    extrapolateRight: "clamp",
  });

  return { x, y, opacity };
}

/**
 * Cursor Click: Produces a scale pulse on the cursor and a ripple on the target.
 * Returns cursorScale and ripple style (expanding ring).
 *
 * Usage:
 * ```tsx
 * const { cursorScale, rippleStyle } = useCursorClick(frame, fps, { delay: 40 });
 * ```
 */
export function useCursorClick(
  frame: number,
  fps: number,
  options: {
    delay?: number;
  } = {},
): {
  cursorScale: number;
  rippleStyle: React.CSSProperties;
} {
  const { delay = 0 } = options;

  // Cursor press down
  const pressP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay,
  });
  // Cursor release up
  const releaseP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: delay + 4,
  });
  const cursorScale = 1 - 0.12 * pressP + 0.12 * releaseP;

  // Ripple ring expands outward from click point
  const rippleP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
    delay: delay + 1,
  });
  const rippleScale = interpolate(rippleP, [0, 1], [0, 1]);
  const rippleOpacity = interpolate(rippleP, [0, 0.3, 1], [0.6, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    cursorScale,
    rippleStyle: {
      position: "absolute" as const,
      width: 80,
      height: 80,
      borderRadius: "50%",
      border: "3px solid rgba(99, 102, 241, 0.5)",
      transform: `translate(-50%, -50%) scale(${rippleScale})`,
      opacity: rippleOpacity,
      pointerEvents: "none" as const,
    },
  };
}

/**
 * Text Selection: An expanding highlight box behind text, simulating
 * click-and-drag text selection. Returns a style for the highlight overlay.
 *
 * Usage:
 * ```tsx
 * const highlightStyle = useTextSelection(frame, fps, { delay: 10 });
 * return (
 *   <div style={{ position: "relative", display: "inline-block" }}>
 *     <div style={highlightStyle} />
 *     <span style={{ position: "relative" }}>Selected text</span>
 *   </div>
 * );
 * ```
 */
export function useTextSelection(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    color?: string;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    color = "rgba(96, 165, 250, 0.3)",
    springConfig = { damping: 200, stiffness: 120 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const scaleX = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: color,
    borderRadius: 4,
    transform: `scaleX(${scaleX})`,
    transformOrigin: "left center",
  };
}

/**
 * Multi-Cursor Swarm: Returns position and opacity for N cursors
 * that all move from their start positions to a shared target in unison.
 *
 * Usage:
 * ```tsx
 * const cursors = useMultiCursorSwarm(frame, fps, {
 *   count: 15,
 *   target: { x: 500, y: 400 },
 *   spread: 800,
 *   delay: 10,
 * });
 * cursors.forEach((c, i) => (
 *   <div key={i} style={{ position: "absolute", left: c.x, top: c.y, opacity: c.opacity }}>▶</div>
 * ));
 * ```
 */
export function useMultiCursorSwarm(
  frame: number,
  fps: number,
  options: {
    count: number;
    target: { x: number; y: number };
    spread?: number;
    delay?: number;
    springConfig?: Partial<SpringConfig>;
  },
): Array<{ x: number; y: number; opacity: number }> {
  const {
    count,
    target,
    spread = 600,
    delay = 0,
    springConfig = { damping: 20, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });
  const opacity = interpolate(progress, [0, 0.1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const results: Array<{ x: number; y: number; opacity: number }> = [];

  for (let i = 0; i < count; i++) {
    // Distribute start positions in a grid-like spread around center
    const cols = Math.ceil(Math.sqrt(count));
    const row = Math.floor(i / cols);
    const col = i % cols;
    const startX = target.x + (col - (cols - 1) / 2) * (spread / cols);
    const startY = target.y - spread / 2 + row * (spread / Math.ceil(count / cols));

    const x = interpolate(progress, [0, 1], [startX, target.x]);
    const y = interpolate(progress, [0, 1], [startY, target.y]);

    results.push({ x, y, opacity });
  }

  return results;
}

/**
 * Panel Reveal: A window/panel slides in from a direction with motion blur
 * and a deep soft shadow. Used for code windows, browser panels.
 *
 * Usage:
 * ```tsx
 * const style = usePanelReveal(frame, fps, { delay: 5, from: "bottom" });
 * return <div style={style}>Panel content</div>;
 * ```
 */
export function usePanelReveal(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    from?: "bottom" | "left" | "right" | "top";
    distance?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    from = "bottom",
    distance = 120,
    springConfig = { damping: 20, stiffness: 100 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const offset = interpolate(progress, [0, 1], [distance, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Motion blur proportional to velocity
  const velocity = 1 - progress;
  const blurAmount = interpolate(velocity, [0, 0.5, 1], [0, 4, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateMap: Record<string, string> = {
    bottom: `translateY(${offset}px)`,
    top: `translateY(${-offset}px)`,
    left: `translateX(${-offset}px)`,
    right: `translateX(${offset}px)`,
  };

  return {
    transform: translateMap[from],
    opacity,
    filter: `blur(${blurAmount}px)`,
    boxShadow: "0 40px 80px rgba(0, 0, 0, 0.10)",
  };
}

/**
 * Dynamic Resize: Smoothly scale and reposition an element with spring
 * overshoot. Background elements can fade/blur simultaneously.
 *
 * Returns two style objects:
 * - **foregroundStyle**: the element that scales/moves into focus
 * - **backgroundStyle**: surrounding elements that fade out + blur
 *
 * Usage:
 * ```tsx
 * const { foregroundStyle, backgroundStyle } = useDynamicResize(frame, fps, {
 *   delay: 10,
 *   fromScale: 0.6,
 *   toScale: 1,
 * });
 * ```
 */
export function useDynamicResize(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    fromScale?: number;
    toScale?: number;
    yOffset?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): { foregroundStyle: React.CSSProperties; backgroundStyle: React.CSSProperties } {
  const {
    delay = 0,
    fromScale = 0.6,
    toScale = 1,
    yOffset = 40,
    springConfig = { damping: 14, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  const translateY = interpolate(progress, [0, 1], [yOffset, 0]);
  const fgOpacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background fades out, scales down, and blurs
  const bgOpacity = interpolate(progress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgScale = interpolate(progress, [0, 1], [1, 0.9]);
  const bgBlur = interpolate(progress, [0, 1], [0, 8]);

  return {
    foregroundStyle: {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: fgOpacity,
    },
    backgroundStyle: {
      opacity: bgOpacity,
      transform: `scale(${bgScale})`,
      filter: `blur(${bgBlur}px)`,
    },
  };
}

/**
 * Power Wipe Transition: Full-screen panel wipe used for major chapter changes.
 *
 * A light panel sweeps left→right with exponential in-out timing.
 * Includes:
 * - slight leading-edge softness
 * - strong mid-motion blur
 * - optional incoming text style that starts near the wipe midpoint
 */
export function usePowerWipeTransition(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    durationInFrames?: number;
    color?: string;
    highlightColor?: string;
    revealAtProgress?: number;
    revealSpringConfig?: Partial<SpringConfig>;
  } = {},
): {
  wipeStyle: React.CSSProperties;
  incomingStyle: React.CSSProperties;
  progress: number;
} {
  const {
    delay = 0,
    durationInFrames = Math.round(0.7 * fps),
    color = "#ECEBFF",
    highlightColor = "rgba(255, 255, 255, 0.95)",
    revealAtProgress = 0.5,
    revealSpringConfig = { damping: 200, stiffness: 180 },
  } = options;

  const safeDuration = Math.max(1, durationInFrames);
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, safeDuration], [0, 1], {
    easing: Easing.inOut(Easing.exp),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(progress, [0, 1], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Peaks at mid-transition where wipe speed is highest.
  const speedPeak = 1 - Math.abs(progress * 2 - 1);
  const motionBlur = interpolate(speedPeak, [0, 1], [4, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const edgeSoftness = interpolate(speedPeak, [0, 1], [2, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const revealDelay = Math.floor(safeDuration * revealAtProgress);
  const incomingProgress = spring({
    frame: localFrame - revealDelay,
    fps,
    config: revealSpringConfig,
    durationInFrames: Math.max(8, Math.floor(0.45 * fps)),
  });

  const incomingOpacity = interpolate(incomingProgress, [0, 0.35, 1], [0, 0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const incomingY = interpolate(incomingProgress, [0, 1], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    wipeStyle: {
      position: "absolute",
      inset: 0,
      left: "-20%",
      width: "140%",
      background: `linear-gradient(90deg, ${color} 0%, ${color} 96%, ${highlightColor} 99%, ${highlightColor} 100%)`,
      transform: `translateX(${translateX}%)`,
      filter: `blur(${edgeSoftness}px) drop-shadow(${Math.round(
        Math.max(8, motionBlur * 0.6),
      )}px 0 ${Math.round(motionBlur)}px rgba(255, 255, 255, 0.62))`,
      pointerEvents: "none",
      zIndex: 40,
    },
    incomingStyle: {
      opacity: incomingOpacity,
      transform: `translateY(${incomingY}px)`,
    },
    progress,
  };
}

/**
 * Camera Pan Transition: Simulated camera move across related UI.
 *
 * Returns layered styles for parallax panning (background moves slowest,
 * foreground fastest) plus directional blur at peak speed.
 */
export function useCameraPanTransition(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    durationInFrames?: number;
    direction?: "left" | "right" | "up" | "down";
    distance?: number;
    backgroundParallax?: number;
    midgroundParallax?: number;
    foregroundParallax?: number;
    blurStrength?: number;
  } = {},
): {
  backgroundStyle: React.CSSProperties;
  midgroundStyle: React.CSSProperties;
  foregroundStyle: React.CSSProperties;
  progress: number;
} {
  const {
    delay = 0,
    durationInFrames = Math.round(0.65 * fps),
    direction = "left",
    distance = 640,
    backgroundParallax = 0.35,
    midgroundParallax = 0.65,
    foregroundParallax = 1,
    blurStrength = 30,
  } = options;

  const safeDuration = Math.max(1, durationInFrames);
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, safeDuration], [0, 1], {
    easing: Easing.out(Easing.poly(5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displacement = interpolate(progress, [0, 1], [0, distance], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const velocityShape = interpolate(progress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const maxBlur = interpolate(velocityShape, [0, 1], [0, blurStrength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dirX = direction === "left" ? -1 : direction === "right" ? 1 : 0;
  const dirY = direction === "up" ? -1 : direction === "down" ? 1 : 0;
  const isHorizontal = dirX !== 0;

  const buildLayerStyle = (parallax: number, blurScale: number): React.CSSProperties => {
    const layerBlur = maxBlur * blurScale;
    const layerStretch = interpolate(layerBlur, [0, blurStrength], [1, 1.04], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateX = dirX * displacement * parallax;
    const translateY = dirY * displacement * parallax;

    return {
      transform: isHorizontal
        ? `translate3d(${translateX}px, ${translateY}px, 0) scaleX(${layerStretch})`
        : `translate3d(${translateX}px, ${translateY}px, 0) scaleY(${layerStretch})`,
      transformOrigin: "center center",
      filter: `blur(${layerBlur}px)`,
    };
  };

  return {
    backgroundStyle: buildLayerStyle(backgroundParallax, 0.55),
    midgroundStyle: buildLayerStyle(midgroundParallax, 0.75),
    foregroundStyle: buildLayerStyle(foregroundParallax, 1),
    progress,
  };
}

/**
 * Focus Shift Transition: Context zoom + blur out while target detail
 * fades/scales in sharp.
 *
 * Designed for broad-view → detail-view transitions.
 */
export function useFocusShiftTransition(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    durationInFrames?: number;
    zoomScale?: number;
    zoomTranslateX?: number;
    zoomTranslateY?: number;
    contextBlur?: number;
    focusSpringConfig?: Partial<SpringConfig>;
  } = {},
): {
  contextStyle: React.CSSProperties;
  focusStyle: React.CSSProperties;
  progress: number;
} {
  const {
    delay = 0,
    durationInFrames = Math.round(0.75 * fps),
    zoomScale = 2.5,
    zoomTranslateX = 0,
    zoomTranslateY = -170,
    contextBlur = 16,
    focusSpringConfig = { damping: 200, stiffness: 160 },
  } = options;

  const safeDuration = Math.max(1, durationInFrames);
  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, safeDuration], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contextScale = interpolate(progress, [0, 1], [1, zoomScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextX = interpolate(progress, [0, 1], [0, zoomTranslateX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextY = interpolate(progress, [0, 1], [0, zoomTranslateY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextOpacity = interpolate(progress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextBlurPx = interpolate(progress, [0, 1], [0, contextBlur], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const focusEntry = spring({
    frame: localFrame - Math.floor(safeDuration * 0.35),
    fps,
    config: focusSpringConfig,
    durationInFrames: Math.max(8, Math.floor(0.5 * fps)),
  });
  const focusOpacity = interpolate(focusEntry, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const focusScale = interpolate(focusEntry, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const focusY = interpolate(focusEntry, [0, 1], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    contextStyle: {
      transform: `translate(${contextX}px, ${contextY}px) scale(${contextScale})`,
      opacity: contextOpacity,
      filter: `blur(${contextBlurPx}px)`,
      transformOrigin: "center center",
    },
    focusStyle: {
      opacity: focusOpacity,
      transform: `translateY(${focusY}px) scale(${focusScale})`,
      transformOrigin: "center center",
    },
    progress,
  };
}

/**
 * Staggered Dissolve Exit: Reverse-entry exit with Last-In, First-Out ordering.
 *
 * Each element slides down through an overflow mask while fading and blurring out.
 */
export function useStaggeredDissolveExit(
  frame: number,
  fps: number,
  options: {
    index: number;
    total: number;
    delay?: number;
    stagger?: number;
    distance?: number;
    blur?: number;
    springConfig?: Partial<SpringConfig>;
  },
): {
  containerStyle: React.CSSProperties;
  contentStyle: React.CSSProperties;
  progress: number;
} {
  const {
    index,
    total,
    delay = 0,
    stagger = 4,
    distance = 52,
    blur = 7,
    springConfig = { damping: 200, stiffness: 220 },
  } = options;

  const reverseIndex = Math.max(0, total - index - 1);
  const startDelay = delay + reverseIndex * stagger;

  const progress = spring({
    frame: frame - startDelay,
    fps,
    config: springConfig,
    durationInFrames: Math.max(8, Math.floor(0.45 * fps)),
  });

  const translateY = interpolate(progress, [0, 1], [0, distance], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blurPx = interpolate(progress, [0, 1], [0, blur], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    containerStyle: {
      overflow: "visible",
      display: "inline-block",
      verticalAlign: "top",
    },
    contentStyle: {
      transform: `translateY(${translateY}px)`,
      opacity,
      filter: `blur(${blurPx}px)`,
      transformOrigin: "center top",
    },
    progress,
  };
}

// =====================================================================
// Professional text finishing effects
// =====================================================================

/** Internal: convert hex color (#RRGGBB or #RGB) to [r, g, b] tuple */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = Number.parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Metallic Text: Applies a metallic silver gradient to text with a
 * shimmer highlight that sweeps across during entrance.
 *
 * Simulates brushed-metal / industrial text used for secondary labels
 * like "Engineered for" in the Simplex promo.
 *
 * **Note:** Uses `backgroundClip: "text"` — cannot stack with other
 * gradient-text effects on the same element.
 *
 * Usage:
 * ```tsx
 * const style = useMetallicText(frame, fps, { delay: 5 });
 * return <span style={{ ...style, fontSize: 80 }}>Engineered for</span>;
 * ```
 */
export function useMetallicText(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    fromColor?: string;
    toColor?: string;
    highlightColor?: string;
    angle?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    fromColor = "#707070",
    toColor = "#B0B0B0",
    highlightColor = "#D4D4D4",
    angle = 135,
    springConfig = { damping: 200, stiffness: 60 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Shimmer: a bright highlight band sweeps left-to-right during entrance
  const shimmerPos = interpolate(progress, [0, 1], [-30, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    backgroundImage: `linear-gradient(${angle}deg, ${fromColor} 0%, ${toColor} ${shimmerPos - 20}%, ${highlightColor} ${shimmerPos}%, ${toColor} ${shimmerPos + 20}%, ${fromColor} 100%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline-block",
    opacity,
  };
}

/**
 * Brand Gradient: Applies a vibrant multi-stop gradient to text
 * (e.g., the Simplex blue #2D3FE3 → #5E6BFF). Fades in with a
 * subtle scale-up entrance.
 *
 * **Note:** Uses `backgroundClip: "text"` — cannot stack with other
 * gradient-text effects on the same element.
 *
 * Usage:
 * ```tsx
 * const style = useBrandGradient(frame, fps, { delay: 10 });
 * return <span style={{ ...style, fontSize: 100 }}>Simplex</span>;
 * ```
 */
export function useBrandGradient(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    colors?: string[];
    angle?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    colors = ["#2D3FE3", "#5E6BFF"],
    angle = 90,
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.95, 1]);

  const gradientStops = colors
    .map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`)
    .join(", ");

  return {
    backgroundImage: `linear-gradient(${angle}deg, ${gradientStops})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    display: "inline-block",
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };
}

/**
 * Bloom: Soft outer glow (bloom) around text via layered text-shadow.
 * Fades in from invisible to target intensity.
 *
 * Keep `strength` under 0.10 for subtlety — higher values look like
 * a "glow stick" effect. Two shadow layers (tight + wide) create a
 * natural fall-off.
 *
 * **Composing with other text-shadow effects:**
 * `textShadow` values from useBloom, useInnerBevel, and useFloatingShadow
 * can be manually joined: `textShadow: [bloom.textShadow, bevel.textShadow].join(", ")`
 *
 * Usage:
 * ```tsx
 * const style = useBloom(frame, fps, { delay: 5, color: "#5E6BFF" });
 * return <span style={{ ...style, fontSize: 80, color: "#5E6BFF" }}>control</span>;
 * ```
 */
export function useBloom(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    color?: string;
    blurRadius?: number;
    strength?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    color = "#5E6BFF",
    blurRadius = 20,
    strength = 0.08,
    springConfig = { damping: 200, stiffness: 60 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const alpha = interpolate(progress, [0, 1], [0, strength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha2 = alpha * 0.5;

  const [r, g, b] = hexToRgb(color);

  return {
    textShadow: `0 0 ${blurRadius}px rgba(${r}, ${g}, ${b}, ${alpha}), 0 0 ${blurRadius * 2}px rgba(${r}, ${g}, ${b}, ${alpha2})`,
  };
}

/**
 * Inner Bevel: A thin 1px highlight on the top edge of letters,
 * creating a faux-3D tactile appearance. Fades in with spring.
 *
 * Uses a white text-shadow with a -1px Y offset and zero blur.
 *
 * Usage:
 * ```tsx
 * const style = useInnerBevel(frame, fps, { delay: 5 });
 * return <span style={{ ...style, fontSize: 80, color: "#111827" }}>reliability</span>;
 * ```
 */
export function useInnerBevel(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    color?: string;
    strength?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    color = "#FFFFFF",
    strength = 0.15,
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const alpha = interpolate(progress, [0, 1], [0, strength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const [r, g, b] = hexToRgb(color);

  return {
    textShadow: `0 -1px 1px rgba(${r}, ${g}, ${b}, ${alpha}), 0 -2px 4px rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`,
  };
}

/**
 * Floating Shadow: A soft, distant drop shadow that makes text
 * appear to float above the background. The shadow grows during
 * entrance (offset + blur increase with spring).
 *
 * Uses a background-tinted color (not black) for a polished look.
 *
 * Usage:
 * ```tsx
 * const style = useFloatingShadow(frame, fps, { delay: 5 });
 * return <span style={{ ...style, fontSize: 80, color: "#111827" }}>floating text</span>;
 * ```
 */
export function useFloatingShadow(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    color?: string;
    offsetY?: number;
    blur?: number;
    strength?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    color = "#4A4063", // dark muted lavender, not black
    offsetY = 15,
    blur = 35,
    strength = 0.06,
    springConfig = { damping: 200, stiffness: 60 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const currentOffsetY = interpolate(progress, [0, 1], [0, offsetY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentBlur = interpolate(progress, [0, 1], [0, blur], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = interpolate(progress, [0, 1], [0, strength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const [r, g, b] = hexToRgb(color);

  return {
    textShadow: `0 ${currentOffsetY}px ${currentBlur}px rgba(${r}, ${g}, ${b}, ${alpha})`,
  };
}

/**
 * Subpixel Smooth: Applies a subtle Gaussian blur (0.3–0.5px) to text
 * for anti-aliasing. Mimics the natural softening of high-end camera
 * lenses or high-DPI displays.
 *
 * **Note:** Uses `filter: blur()` — if combining with other filter-based
 * animations (useMaskedRise, usePanelReveal), merge filter strings manually.
 *
 * Usage:
 * ```tsx
 * const style = useSubpixelSmooth(frame, fps, { delay: 5 });
 * return <span style={{ ...style, fontSize: 80 }}>Smooth text</span>;
 * ```
 */
export function useSubpixelSmooth(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    amount?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    amount = 0.4,
    springConfig = { damping: 200, stiffness: 100 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const blur = interpolate(progress, [0, 1], [0, amount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    filter: `blur(${blur}px)`,
  };
}

/**
 * Tracking: Animates letter-spacing from tight to open, creating a
 * modern "airy" tech look. The expansion is spring-driven so it
 * naturally decelerates.
 *
 * Usage:
 * ```tsx
 * const style = useTracking(frame, fps, { delay: 5, to: 0.05 });
 * return <span style={{ ...style, fontSize: 80 }}>SIMPLEX</span>;
 * ```
 */
export function useTracking(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    from?: number;
    to?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    from = -0.02,
    to = 0.04,
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const tracking = interpolate(progress, [0, 1], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    letterSpacing: `${tracking}em`,
  };
}

/**
 * TEXT_LAYOUT_DEFAULTS: Baseline typography spacing defaults.
 * Apply to composition roots or text blocks to normalize:
 * - line breaks (`lineHeight`)
 * - word spacing (`wordSpacing`)
 * - glyph spacing (`letterSpacing`, `fontKerning`)
 */
export const TEXT_LAYOUT_DEFAULTS: React.CSSProperties = {
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
  wordSpacing: "-0.04em",
  fontKerning: "normal",
};

/**
 * TEXT_LAYOUT_BODY_DEFAULTS: Slightly looser spacing for subtitle/body copy.
 * This keeps smaller text from feeling cramped while preserving the
 * tighter display-heading defaults above.
 */
export const TEXT_LAYOUT_BODY_DEFAULTS: React.CSSProperties = {
  lineHeight: 1.01,
  letterSpacing: "-0.01em",
  wordSpacing: "-0.02em",
  fontKerning: "normal",
};

/**
 * TEXT_FINISH: Static style constant containing the settled values of
 * useInnerBevel and useSubpixelSmooth. Spread into any text element
 * for default finishing polish.
 *
 * Includes `TEXT_LAYOUT_DEFAULTS` so text elements inherit the baseline
 * spacing defaults unless a scene intentionally overrides them.
 *
 * - `textShadow`: inner bevel (top highlight + bottom shadow)
 * - `filter`: subpixel blur (0.4px)
 *
 * The textShadow can also be applied to a parent element to cascade
 * to all text children. The filter must stay per-element (would blur
 * images/panels if on a parent).
 *
 * Usage:
 * ```tsx
 * import { TEXT_FINISH } from "./animations";
 * <span style={{ ...TEXT_FINISH, fontSize: 80 }}>Polished text</span>
 * ```
 */
export const TEXT_FINISH: React.CSSProperties = {
  ...TEXT_LAYOUT_DEFAULTS,
  textShadow:
    "0 -1px 1px rgba(255, 255, 255, 0.15), 0 -2px 4px rgba(255, 255, 255, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)",
  filter: "blur(0.4px)",
};

/**
 * TEXT_FINISH_SHADOW: Just the textShadow portion of TEXT_FINISH.
 * Safe to apply on a parent element — cascades to all text children
 * without affecting non-text elements.
 */
export const TEXT_FINISH_SHADOW: React.CSSProperties = {
  textShadow:
    "0 -1px 1px rgba(255, 255, 255, 0.15), 0 -2px 4px rgba(255, 255, 255, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)",
};

/**
 * Utility: Combines textShadow values from multiple style objects.
 * Use when stacking useBloom + useInnerBevel + useFloatingShadow.
 *
 * Usage:
 * ```tsx
 * const bloom = useBloom(frame, fps, { delay: 5, color: "#5E6BFF" });
 * const bevel = useInnerBevel(frame, fps, { delay: 5 });
 * const shadow = useFloatingShadow(frame, fps, { delay: 5 });
 * const combined = combineTextShadows(bloom, bevel, shadow);
 * return <span style={{ textShadow: combined, fontSize: 80 }}>Depth</span>;
 * ```
 */
export function combineTextShadows(
  ...styles: React.CSSProperties[]
): string {
  return styles
    .map((s) => s.textShadow)
    .filter(Boolean)
    .join(", ");
}

// =====================================================================
// Background layer primitives
// =====================================================================

/**
 * Scene palette presets for temporal color shifting.
 * Each palette defines center, mid, and outer gradient stops.
 */
export const SCENE_PALETTES = {
  intro: { center: "#EEEEFF", mid: "#D5D5F5", outer: "#B8B8E8" },
  integration: { center: "#E8E0F8", mid: "#CFC2F0", outer: "#A898D8" },
  feature: { center: "#E0E4FF", mid: "#C5CCFA", outer: "#9AA4E8" },
} as const;

export type ScenePalette = { center: string; mid: string; outer: string };

/**
 * Radial Vignette: The base background layer. A radial gradient with an
 * offset center (40% from top), producing a soft vignette from light
 * center to muted edges.
 *
 * Colors default to the lavender-white palette used in the Simplex promo.
 * Override `colors` to use output from `useTemporalShift`.
 *
 * Usage:
 * ```tsx
 * const bgStyle = useRadialVignette(frame, fps, { delay: 0 });
 * return <div style={bgStyle} />;
 * ```
 */
export function useRadialVignette(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    colors?: ScenePalette;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    colors = SCENE_PALETTES.intro,
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    position: "absolute" as const,
    inset: 0,
    background: `radial-gradient(ellipse 150% 150% at 50% 40%, ${colors.center} 0%, ${colors.mid} 50%, ${colors.outer} 100%)`,
    opacity,
  };
}

/**
 * Temporal Shift: Smoothly interpolates between scene-specific color
 * palettes over time using Remotion's `interpolateColors`.
 *
 * Pass an array of frame keypoints and matching palette array. The
 * returned colors can be fed directly into `useRadialVignette`'s
 * `colors` option.
 *
 * Usage:
 * ```tsx
 * const palette = useTemporalShift(frame, fps, {
 *   keyframes: [0, 45, 89],
 *   palettes: [SCENE_PALETTES.intro, SCENE_PALETTES.integration, SCENE_PALETTES.feature],
 * });
 * const bgStyle = useRadialVignette(frame, fps, { colors: palette });
 * ```
 */
export function useTemporalShift(
  frame: number,
  _fps: number,
  options: {
    keyframes: number[];
    palettes: ScenePalette[];
  },
): ScenePalette {
  const { keyframes, palettes } = options;

  const centers = palettes.map((p) => p.center);
  const mids = palettes.map((p) => p.mid);
  const outers = palettes.map((p) => p.outer);

  const center = interpolateColors(frame, keyframes, centers);
  const mid = interpolateColors(frame, keyframes, mids);
  const outer = interpolateColors(frame, keyframes, outers);

  return { center, mid, outer };
}

/**
 * Corner Glow: A soft radial gradient positioned at a corner, creating
 * a directional light overlay for 3D depth.
 *
 * Default is top-left at 5% opacity, which adds a subtle "window light"
 * effect without washing out content.
 *
 * Usage:
 * ```tsx
 * const glowStyle = useCornerGlow(frame, fps, { delay: 5 });
 * return <div style={glowStyle} />;
 * ```
 */
export function useCornerGlow(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    color?: string;
    size?: number;
    targetOpacity?: number;
    springConfig?: Partial<SpringConfig>;
  } = {},
): React.CSSProperties {
  const {
    delay = 0,
    position = "top-left",
    color = "white",
    size = 60,
    targetOpacity = 0.05,
    springConfig = { damping: 200, stiffness: 80 },
  } = options;

  const progress = spring({ frame, fps, config: springConfig, delay });

  const opacity = interpolate(progress, [0, 1], [0, targetOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posMap: Record<string, string> = {
    "top-left": "at 0% 0%",
    "top-right": "at 100% 0%",
    "bottom-left": "at 0% 100%",
    "bottom-right": "at 100% 100%",
  };

  return {
    position: "absolute" as const,
    inset: 0,
    background: `radial-gradient(circle ${size}% ${posMap[position]}, ${color}, transparent)`,
    opacity,
    pointerEvents: "none" as const,
  };
}
