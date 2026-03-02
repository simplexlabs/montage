# Animation Reference

All reusable animation functions live in `src/remotion/shared/animations.ts`. Each function takes `(frame, fps, options)` and returns style objects or values you can apply directly to elements. All motion uses Remotion's `spring()` and `interpolate()` — no CSS animations.

**Demo compositions** for visual verification:
- `AnimationReference` — **All 26 animations** in one composition (2340 frames, 26 sections × 90 frames)
- `AnimationDemo` — Text animations only (450 frames, 5 sections × 90 frames)
- `AnimationDemo2` — Cursor & interaction animations only (540 frames, 6 sections × 90 frames)
- `BackgroundExamples` — Background layer primitives (450 frames, 5 sections × 90 frames)

```bash
# Full reference — section N starts at frame (N-1) × 90
npx remotion still AnimationReference --frame=<N> --output=/tmp/ref.png

npx remotion still AnimationDemo --frame=<N> --output=/tmp/demo.png
npx remotion still AnimationDemo2 --frame=<N> --output=/tmp/demo2.png
```

---

## Text Animations

### `useTypingAnimation`

Character-by-character text reveal with a blinking cursor. Simulates real-time typing.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | *required* | The full string to type out |
| `charFrames` | `number` | `2` | Frames between each character (lower = faster) |
| `delay` | `number` | `0` | Frames to wait before typing starts |
| `cursorBlinkFrames` | `number` | `16` | Full blink cycle length in frames |

**Returns:** `{ typedText, doneTyping, cursorOpacity, typingEndFrame }`

- `typedText` — The visible substring at the current frame
- `doneTyping` — `true` when all characters are revealed
- `cursorOpacity` — 0→1→0 blink value for the cursor
- `typingEndFrame` — Frame number when typing finishes (useful for chaining)

**Use for:** Terminal commands, code typing, form field input, real-time text entry effects.

```tsx
import { useTypingAnimation } from "./animations";

const { typedText, doneTyping, cursorOpacity, typingEndFrame } = useTypingAnimation(frame, fps, {
  text: "npm install simplex",
  charFrames: 2,
  delay: 10,
});

return (
  <span>{typedText}</span>
  <span style={{ opacity: cursorOpacity }}>|</span>
);
```

---

### `useLetterPopIn`

Each letter scales from 0→1 with a fast opacity ramp, creating a bouncy pop-up effect. Letters are staggered so they appear one after another.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | *required* | Letter index (0-based) for stagger timing |
| `stagger` | `number` | `2` | Frames between each letter's entrance |
| `springConfig` | `SpringConfig` | `{ damping: 17, stiffness: 288 }` | Spring physics |

**Returns:** `React.CSSProperties` — Apply directly to a `<span>` wrapping each letter.

**Spring character:** Bouncy, fast pop. Letters snap into place with energy.

**Use for:** Bold headlines, logo text, hero titles — any text that needs dramatic presence.

```tsx
import { useLetterPopIn } from "./animations";

const text = "Simplex";
return (
  <div>
    {text.split("").map((letter, i) => {
      const style = useLetterPopIn(frame, fps, { index: i, stagger: 2 });
      return <span key={i} style={{ ...style, fontSize: 100 }}>{letter}</span>;
    })}
  </div>
);
```

---

### `useWordDragIn`

Words fade and drag into place from below. Scale 0.7→1, translateY 20→0, with a non-linear opacity curve (0→0.8→1) that pops in fast then gently reaches full opacity.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | *required* | Word index for stagger timing |
| `stagger` | `number` | `3` | Frames between each word's entrance |
| `baseDelay` | `number` | `0` | Extra delay before stagger starts |
| `origin` | `"center bottom"` \| `"center top"` | `"center bottom"` | Transform origin |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 180 }` | Spring physics |

**Returns:** `React.CSSProperties` — Apply directly to a `<span>` wrapping each word.

**Spring character:** Smooth, no bounce. Words glide gently into position.

**Use for:** Taglines, body copy, subtitles, CTAs — lighter text that supports the main headline.

```tsx
import { useWordDragIn } from "./animations";

const words = ["Use", "Simplex", "for", "workflows"];
return (
  <div style={{ display: "flex", gap: 18 }}>
    {words.map((word, i) => {
      const style = useWordDragIn(frame, fps, { index: i, stagger: 3, baseDelay: 10 });
      return <span key={i} style={{ ...style, fontSize: 56 }}>{word}</span>;
    })}
  </div>
);
```

---

### `useMaskedRise`

Text slides up from behind an invisible horizontal clip mask. The container uses `overflow: hidden` to clip, while the inner content translates upward with motion blur proportional to velocity. Apple "pop-up slide" effect.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `yOffset` | `number` | `60` | How far below the text starts (px) |
| `springConfig` | `SpringConfig` | `{ damping: 20, stiffness: 100 }` | Spring physics |

**Returns:** `{ containerStyle, contentStyle }` — Two style objects. Container clips, content moves.

**Spring character:** Fast start, smooth settle. The text shoots up and decelerates naturally.

**Motion blur:** Applied automatically via `filter: blur()` proportional to velocity — strongest mid-transition, zero at rest.

**Use for:** Section headers, main titles, dramatic text reveals where text appears to emerge from below.

```tsx
import { useMaskedRise } from "./animations";

const { containerStyle, contentStyle } = useMaskedRise(frame, fps, { delay: 10 });
return (
  <div style={containerStyle}>
    <h1 style={{ ...contentStyle, fontSize: 80 }}>Section Title</h1>
  </div>
);
```

---

### `useGradientFill`

Text starts as a light/muted color and "fills in" with the target color from left to right. Uses `background-clip: text` with an animated linear gradient position. The gradient has a soft 20% transition edge.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `color` | `string` | `"#111827"` | Target fill color |
| `baseColor` | `string` | `"#D1D5DB"` | Starting muted color |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Includes `backgroundImage`, `backgroundClip`, `WebkitBackgroundClip`, and `color: "transparent"`.

**Spring character:** Steady, linear-feeling sweep. No bounce — just a clean color fill.

**Use for:** Emphasizing specific phrases, tagline reveals, progressive text coloring.

```tsx
import { useGradientFill } from "./animations";

const style = useGradientFill(frame, fps, {
  delay: 5,
  color: "#6366F1",        // indigo target
  baseColor: "#C7D2FE",    // light indigo start
});
return <span style={{ ...style, fontSize: 72, fontWeight: 700 }}>Simplex</span>;
```

---

### `useWipeReveal`

Content is progressively revealed by an animated `clip-path: inset()` wipe. Can wipe from left-to-right or right-to-left.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `direction` | `"left"` \| `"right"` | `"left"` | Wipe origin direction |
| `springConfig` | `SpringConfig` | `{ damping: 20, stiffness: 200 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `clipPath` and `WebkitClipPath`.

**Spring character:** Snappy, fast reveal. Content appears decisively.

**Use for:** Scene transitions, content reveals, before/after comparisons, dramatic entrances.

```tsx
import { useWipeReveal } from "./animations";

const style = useWipeReveal(frame, fps, { delay: 0, direction: "left" });
return <div style={style}>Revealed content</div>;
```

---

### `useScalePop`

Element scales from 0.6 → overshoot (~1.1) → settle at 1.0 with fast opacity ramp. Uses a bouncy spring that naturally overshoots. Supports staggered entrances for groups of elements.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | `0` | Element index for stagger timing |
| `stagger` | `number` | `5` | Frames between each element's entrance |
| `delay` | `number` | `0` | Base delay before stagger starts |
| `springConfig` | `SpringConfig` | `{ damping: 12, stiffness: 200 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `transform: scale()`, `opacity`, and `transformOrigin`.

**Spring character:** Bouncy overshoot. Elements pop in with playful energy then settle.

**Use for:** Icons, badges, buttons, avatar groups, feature cards — any small UI elements that appear in sequence.

```tsx
import { useScalePop } from "./animations";

const icons = ["A", "B", "C", "D"];
return (
  <div style={{ display: "flex", gap: 20 }}>
    {icons.map((icon, i) => {
      const style = useScalePop(frame, fps, { index: i, stagger: 6, delay: 10 });
      return <div key={i} style={{ ...style, width: 80, height: 80 }}>{icon}</div>;
    })}
  </div>
);
```

---

### `useGrowingUnderline`

A thin line grows from center outward (or left-to-right) underneath text. Uses `scaleX` animation on a colored bar. Place inside an `inline-flex` wrapper to match text width automatically.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `height` | `number` | `3` | Line thickness in px |
| `color` | `string` | `"#6366F1"` | Line color |
| `direction` | `"center"` \| `"left"` | `"center"` | Growth origin |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 120 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `width: "100%"`, `height`, `backgroundColor`, `transform: scaleX()`, `transformOrigin`, and `borderRadius`.

**Spring character:** Smooth, no bounce. Clean line extension.

**Use for:** URL emphasis, CTA underlines, section dividers, active tab indicators.

```tsx
import { useGrowingUnderline } from "./animations";

const underlineStyle = useGrowingUnderline(frame, fps, {
  delay: 20,
  height: 4,
  color: "#6366F1",
  direction: "center",
});
return (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
    <span style={{ fontSize: 72 }}>https://simplex.sh</span>
    <div style={{ marginTop: 4 }}>
      <div style={underlineStyle} />
    </div>
  </div>
);
```

---

### `useFloatingText`

Subtle keyframed wave motion for whole words/phrases. The loop matches:

- `0%` → `translateY(0)`
- `50%` → `translateY(-20px)`
- `100%` → `translateY(0)`

Default loop timing is `0.7s` (at 30fps: `21` frames), repeated infinitely.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before the float starts |
| `amplitude` | `number` | `20` | Peak upward displacement (px) |
| `cycleDurationInFrames` | `number` | `Math.round(0.7 * fps)` | Frames per full wave cycle |
| `centeredAroundZero` | `boolean` | `false` | When `true`, oscillates around baseline (`-amplitude/2` to `+amplitude/2`) |

**Returns:** `React.CSSProperties` — Contains `transform: translateY(...)` plus stable inline-block layout styles.

**Motion character:** Ease-in-out wave, repeating continuously with smooth turnaround at top and bottom.

**Use for:** Hero words, callouts, and short phrases that need gentle movement without per-letter animation.

```tsx
import { useFloatingText, TEXT_FINISH } from "./animations";

const floatStyle = useFloatingText(frame, fps, {
  amplitude: 20,
  centeredAroundZero: true,
});

return (
  <span style={{ ...TEXT_FINISH, ...floatStyle, fontSize: 120, fontWeight: 700 }}>
    WAVE
  </span>
);
```

---

### `useXZPlaneSway`

Subtle 3D emphasis motion for text that rotates back and forth across the X and Z axes (with perspective), then settles. Useful for feature callouts that need extra energy without becoming hard to read.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before sway starts |
| `durationInFrames` | `number` | `Math.round(1.2 * fps)` | Total sway window |
| `rotateXDeg` | `number` | `5` | Maximum X-axis tilt (degrees) |
| `rotateZDeg` | `number` | `2` | Maximum Z-axis tilt (degrees) |
| `oscillations` | `number` | `2` | Number of back-and-forth cycles |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 120 }` | Envelope spring |

**Returns:** `{ containerStyle, contentStyle }`

- `containerStyle` — wrapper with perspective and 3D context
- `contentStyle` — animated rotateX/rotateZ/translateZ transform

**Use for:** Feature headlines, launch callouts, momentary emphasis text in hero sections.

```tsx
import { useXZPlaneSway } from "./animations";

const { containerStyle, contentStyle } = useXZPlaneSway(frame, fps, {
  delay: 24,
  durationInFrames: 42,
  rotateXDeg: 6,
  rotateZDeg: 2.5,
  oscillations: 2.2,
});

return (
  <div style={containerStyle}>
    <span style={contentStyle}>Live Question Answering + Question Banks</span>
  </div>
);
```

---

## Cursor Animations

### `useCursorPath`

Moves a cursor along a natural, asymmetric curved path from a start point to a target. The arc drifts to one side early in the motion, then straightens as it approaches the target — mimicking how a human hand moves a mouse. The curve is NOT a symmetric parabola.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | `{ x, y }` | *required* | Start position |
| `to` | `{ x, y }` | *required* | Target position |
| `delay` | `number` | `0` | Frames before movement starts |
| `arcIntensity` | `number` | `150` | How much the path curves (px). Use 200-400 for visible arcs. Negative values curve in the opposite direction. |
| `cursorSize` | `number` | `0` | When set, returned x/y are pre-adjusted for cursor.png tip offset. Pass the displayed width of the cursor image. |
| `springConfig` | `SpringConfig` | `{ damping: 20, stiffness: 30 }` | Spring physics |

**Returns:** `{ x, y, opacity }` — When `cursorSize` is set, x/y are image `left`/`top` values (tip-aligned). When 0, x/y are raw tip coordinates.

**Arc behavior:** The perpendicular offset peaks at ~35% of progress and tapers with a `(1-progress)^0.6` envelope. A subtle S-correction near the end adds realism.

**Use for:** Cursor movement to click targets, pointer travel animations, interactive demos.

```tsx
import { useCursorPath } from "./animations";

const CURSOR_SIZE = 60;
const { x, y, opacity } = useCursorPath(frame, fps, {
  from: { x: 400, y: 900 },
  to: { x: 1600, y: 500 },
  delay: 5,
  arcIntensity: 350,
  cursorSize: CURSOR_SIZE,
  springConfig: { damping: 25, stiffness: 20, mass: 1.5 },
});

return (
  <Img
    src={staticFile("cursor.png")}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: CURSOR_SIZE,
      height: CURSOR_SIZE,
      opacity,
    }}
  />
);
```

---

### `useCursorClick`

Simulates a mouse click: the cursor presses down (scales to 0.88), releases (back to 1.0), and an expanding ripple ring appears at the click point.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frame when the click occurs |

**Returns:** `{ cursorScale, rippleStyle }`

- `cursorScale` — Apply to the cursor's `transform: scale()`. Dips to 0.88 then returns to 1.0.
- `rippleStyle` — Full CSS for the ripple ring. Position it at the click point with `left`/`top`. Includes `position: absolute`, border, scale, and fading opacity.

**Use for:** Button click demos, interactive walkthroughs, UI interaction showcases.

```tsx
import { useCursorClick } from "./animations";

const { cursorScale, rippleStyle } = useCursorClick(frame, fps, { delay: 40 });

return (
  <>
    {/* Ripple at click point */}
    <div style={{ ...rippleStyle, left: clickX, top: clickY }} />

    {/* Cursor with press/release scale */}
    <Img
      src={staticFile("cursor.png")}
      style={{
        transform: `scale(${cursorScale})`,
        transformOrigin: "top left",
      }}
    />
  </>
);
```

---

### `useTextSelection`

Expanding highlight rectangle behind text, simulating a click-and-drag text selection. The highlight grows from left to right using `scaleX`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before selection starts |
| `color` | `string` | `"rgba(96, 165, 250, 0.3)"` | Highlight color (use semi-transparent) |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 120 }` | Spring physics |

**Returns:** `React.CSSProperties` — Absolute-positioned highlight. Apply to a div inside a `position: relative` wrapper.

**Use for:** Text selection animations, code highlighting, reading progress indicators.

```tsx
import { useTextSelection } from "./animations";

const highlightStyle = useTextSelection(frame, fps, {
  delay: 10,
  color: "rgba(96, 165, 250, 0.3)",
});

return (
  <div style={{ position: "relative", display: "inline-block", padding: "8px 12px" }}>
    <div style={highlightStyle} />
    <span style={{ position: "relative" }}>Selected text here</span>
  </div>
);
```

---

### `useMultiCursorSwarm`

Multiple cursors start distributed in a grid pattern and converge on a single target point in unison. All cursors follow the same spring timing.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `count` | `number` | *required* | Number of cursors |
| `target` | `{ x, y }` | *required* | Convergence point |
| `spread` | `number` | `600` | Initial grid spread radius (px) |
| `delay` | `number` | `0` | Frames before movement starts |
| `springConfig` | `SpringConfig` | `{ damping: 20, stiffness: 80 }` | Spring physics |

**Returns:** `Array<{ x, y, opacity }>` — One entry per cursor with position and fade-in.

**Use for:** Collaborative editing demos, multi-user cursors, "many users" visualization.

```tsx
import { useMultiCursorSwarm } from "./animations";

const cursors = useMultiCursorSwarm(frame, fps, {
  count: 12,
  target: { x: 1536, y: 864 },
  spread: 1200,
  delay: 5,
});

return cursors.map((c, i) => (
  <div
    key={i}
    style={{
      position: "absolute",
      left: c.x,
      top: c.y,
      opacity: c.opacity,
      transform: "translate(-50%, -50%)",
    }}
  >
    <CursorIcon color={colors[i]} />
  </div>
));
```

---

## UI Transition Animations

### `usePanelReveal`

A panel/window slides in from any direction with motion blur and a deep drop shadow. Motion blur is proportional to velocity — strongest during movement, zero at rest.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before entrance |
| `from` | `"bottom"` \| `"left"` \| `"right"` \| `"top"` | `"bottom"` | Slide-in direction |
| `distance` | `number` | `120` | How far offscreen the panel starts (px) |
| `springConfig` | `SpringConfig` | `{ damping: 20, stiffness: 100 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `transform`, `opacity`, `filter: blur()`, and `boxShadow`.

**Spring character:** Natural entrance with deceleration. Panel arrives with presence.

**Use for:** Code editor windows, browser panels, dashboard cards, modal entrances, split-view reveals.

```tsx
import { usePanelReveal } from "./animations";

const style = usePanelReveal(frame, fps, { delay: 5, from: "bottom", distance: 200 });
return (
  <div style={{ ...style, width: 600, height: 400, borderRadius: 24, backgroundColor: "white" }}>
    Panel content
  </div>
);
```

---

### `useDynamicResize`

An element scales up into focus while surrounding background elements simultaneously fade out and blur. Creates a "zoom to detail" effect with spring overshoot.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before transition |
| `fromScale` | `number` | `0.6` | Starting scale of the foreground |
| `toScale` | `number` | `1` | Final scale of the foreground |
| `yOffset` | `number` | `40` | Vertical displacement to animate (px) |
| `springConfig` | `SpringConfig` | `{ damping: 14, stiffness: 80 }` | Spring physics |

**Returns:** `{ foregroundStyle, backgroundStyle }`

- `foregroundStyle` — Apply to the element that scales up: `transform`, `opacity`
- `backgroundStyle` — Apply to surrounding elements: `opacity` (fades to 0), `transform` (scales to 0.9), `filter` (blurs to 8px)

**Spring character:** Overshoot with settle. The foreground element slightly overshoots its final size then settles back — feels energetic and intentional.

**Use for:** Card expansion, zoom-to-detail, focus transitions, thumbnail→fullscreen, list→detail view.

```tsx
import { useDynamicResize } from "./animations";

const { foregroundStyle, backgroundStyle } = useDynamicResize(frame, fps, {
  delay: 10,
  fromScale: 0.6,
  toScale: 1,
});

return (
  <>
    <div style={backgroundStyle}>Background grid of items...</div>
    <div style={foregroundStyle}>Focused detail card</div>
  </>
);
```

---

## Scene Transition & Scene Navigation Animations

### `usePowerWipeTransition`

Primary chapter-change transition. A full-screen light panel wipes left→right with exponential in-out timing, a soft leading edge, and strong mid-motion blur. Includes an optional `incomingStyle` for text that should start right as the wipe crosses center.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before the wipe starts |
| `durationInFrames` | `number` | `Math.round(0.7 * fps)` | Wipe duration (~0.6s–0.8s at 30fps) |
| `color` | `string` | `"#ECEBFF"` | Main wipe panel color |
| `highlightColor` | `string` | `"rgba(255, 255, 255, 0.95)"` | Leading-edge highlight color |
| `revealAtProgress` | `number` | `0.5` | Where incoming text starts (`0`–`1`) |
| `revealSpringConfig` | `SpringConfig` | `{ damping: 200, stiffness: 180 }` | Incoming text spring |

**Returns:** `{ wipeStyle, incomingStyle, progress }`

- `wipeStyle` — full-screen overlay panel style (place above previous scene, below new headline text)
- `incomingStyle` — text entrance style synchronized to wipe midpoint
- `progress` — normalized transition progress (`0`→`1`)

**Use for:** Major scene changes and chapter boundaries.

```tsx
import { usePowerWipeTransition } from "./animations";

const { wipeStyle, incomingStyle } = usePowerWipeTransition(frame, fps, {
  delay: 6,
  durationInFrames: 22,
  revealAtProgress: 0.5,
});

return (
  <>
    <PreviousScene />
    <div style={wipeStyle} />
    <h1 style={incomingStyle}>New Chapter</h1>
  </>
);
```

---

### `useCameraPanTransition`

Simulated camera move for related UI navigation. Returns parallax-ready styles for background/midground/foreground layers, with quintic-out timing and directional motion blur (strongest at launch, softens during settle).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before panning starts |
| `durationInFrames` | `number` | `Math.round(0.65 * fps)` | Pan duration |
| `direction` | `"left"` \| `"right"` \| `"up"` \| `"down"` | `"left"` | Pan direction |
| `distance` | `number` | `640` | Total pan distance (px) |
| `backgroundParallax` | `number` | `0.35` | Background layer speed multiplier |
| `midgroundParallax` | `number` | `0.65` | Midground layer speed multiplier |
| `foregroundParallax` | `number` | `1` | Foreground layer speed multiplier |
| `blurStrength` | `number` | `30` | Max directional blur amount |

**Returns:** `{ backgroundStyle, midgroundStyle, foregroundStyle, progress }`

**Use for:** Navigating between related panels in the same section while preserving spatial continuity.

```tsx
import { useCameraPanTransition } from "./animations";

const { backgroundStyle, midgroundStyle, foregroundStyle } = useCameraPanTransition(frame, fps, {
  direction: "left",
  distance: 1120,
  backgroundParallax: 0.32,
  midgroundParallax: 0.62,
  foregroundParallax: 1,
});

return (
  <>
    <div style={backgroundStyle}><BackgroundDecor /></div>
    <div style={midgroundStyle}><Rails /></div>
    <div style={foregroundStyle}><UIPanelStrip /></div>
  </>
);
```

---

### `useFocusShiftTransition`

Zoom-and-blur transition from broad context to focused detail. The context layer scales/translates while fading and blurring out; the target layer fades in sharp with a subtle spring settle.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before transition starts |
| `durationInFrames` | `number` | `Math.round(0.75 * fps)` | Transition duration |
| `zoomScale` | `number` | `2.5` | Final context scale |
| `zoomTranslateX` | `number` | `0` | Context X translation during zoom (px) |
| `zoomTranslateY` | `number` | `-170` | Context Y translation during zoom (px) |
| `contextBlur` | `number` | `16` | Max blur applied to context layer |
| `focusSpringConfig` | `SpringConfig` | `{ damping: 200, stiffness: 160 }` | Target detail spring |

**Returns:** `{ contextStyle, focusStyle, progress }`

**Use for:** Macro→detail transitions (e.g. zooming into an address bar, button, or form field).

```tsx
import { useFocusShiftTransition } from "./animations";

const { contextStyle, focusStyle } = useFocusShiftTransition(frame, fps, {
  zoomScale: 2.45,
  zoomTranslateX: -260,
  zoomTranslateY: -210,
});

return (
  <>
    <div style={contextStyle}><FullUIContext /></div>
    <div style={focusStyle}><FocusedDetail /></div>
  </>
);
```

---

### `useStaggeredDissolveExit`

Reverse-entry exit transition with Last-In, First-Out staggering. Each element slides down through an overflow mask while fading and blurring out, making clearance transitions feel intentional instead of abrupt.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | *required* | Element index in the group |
| `total` | `number` | *required* | Total element count (for LIFO ordering) |
| `delay` | `number` | `0` | Base delay before exits start |
| `stagger` | `number` | `4` | Frames between exits |
| `distance` | `number` | `52` | Downward exit distance (px) |
| `blur` | `number` | `7` | Max blur during dissolve |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 220 }` | Exit spring |

**Returns:** `{ containerStyle, contentStyle, progress }`

- `containerStyle` — overflow mask wrapper
- `contentStyle` — animated content style (slide + fade + blur)

**Use for:** Clearing existing content before a new information set appears without doing a full-screen wipe.

```tsx
import { useStaggeredDissolveExit } from "./animations";

const total = chips.length;
return chips.map((chip, i) => {
  const dissolve = useStaggeredDissolveExit(frame, fps, {
    index: i,
    total,
    delay: 18,
    stagger: 4,
  });

  return (
    <div key={chip} style={dissolve.containerStyle}>
      <div style={dissolve.contentStyle}>{chip}</div>
    </div>
  );
});
```

---

## Professional Text Finishing Effects

These are "always-on" style treatments that add depth and polish to text. Each animates from 0% to 100% intensity via spring, so they work both as timed effects (with delay) and as persistent finishes (applied at frame 0).

**Note:** `TEXT_FINISH_SHADOW` is applied globally on the Master composition root. `TEXT_FINISH` should be spread into individual text elements for the full effect (bevel + subpixel blur).

---

### `useMetallicText`

Applies a metallic silver gradient to text with a shimmer highlight that sweeps across during entrance. Simulates brushed-metal text used for secondary labels like "Engineered for".

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `fromColor` | `string` | `"#707070"` | Dark end of the metallic gradient |
| `toColor` | `string` | `"#B0B0B0"` | Light end of the metallic gradient |
| `highlightColor` | `string` | `"#D4D4D4"` | Shimmer highlight band color |
| `angle` | `number` | `135` | Gradient angle in degrees |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 60 }` | Spring physics |

**Returns:** `React.CSSProperties` — Uses `backgroundClip: "text"`. Cannot stack with other gradient-text effects.

**Use for:** Secondary labels, "Engineered for" text, industrial/premium feel.

```tsx
import { useMetallicText } from "./animations";

const style = useMetallicText(frame, fps, { delay: 5 });
return <span style={{ ...style, fontSize: 80 }}>Engineered for</span>;
```

---

### `useBrandGradient`

Applies a vibrant multi-stop gradient to text (default: Simplex blue #2D3FE3 → #5E6BFF). Fades in with a subtle scale-up entrance.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `colors` | `string[]` | `["#2D3FE3", "#5E6BFF"]` | Gradient color stops |
| `angle` | `number` | `90` | Gradient angle in degrees |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Uses `backgroundClip: "text"`. Cannot stack with other gradient-text effects.

**Use for:** Brand keywords ("Simplex", "control"), vibrant emphasis text.

```tsx
import { useBrandGradient } from "./animations";

const style = useBrandGradient(frame, fps, { delay: 10 });
return <span style={{ ...style, fontSize: 100 }}>Simplex</span>;

// Custom colors:
const warm = useBrandGradient(frame, fps, { colors: ["#EC4899", "#F59E0B"], angle: 135 });
```

---

### `useBloom`

Soft outer glow (bloom) around text via layered text-shadow. Fades in from invisible to target intensity. Keep `strength` under 0.10 for subtlety in production.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before glow appears |
| `color` | `string` | `"#5E6BFF"` | Glow color (hex) |
| `blurRadius` | `number` | `20` | Inner glow blur radius (px) |
| `strength` | `number` | `0.08` | Max opacity (0–1). Keep under 0.10 for subtlety. |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 60 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `textShadow` with two layers (tight + wide).

**Composing:** `textShadow` values from `useBloom`, `useInnerBevel`, and `useFloatingShadow` can be combined using `combineTextShadows()`.

**Use for:** Emphasizing keywords on dark backgrounds, "light-emitting" digital feel.

```tsx
import { useBloom } from "./animations";

const style = useBloom(frame, fps, { delay: 5, color: "#5E6BFF", strength: 0.08 });
return <span style={{ ...style, fontSize: 80, color: "#5E6BFF" }}>control</span>;
```

---

### `useInnerBevel`

A thin highlight on the top edge of letters with a subtle bottom shadow, creating a faux-3D embossed appearance. Fades in with spring.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before effect appears |
| `color` | `string` | `"#FFFFFF"` | Highlight color (hex) |
| `strength` | `number` | `0.15` | Max highlight opacity (0–1) |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `textShadow` with top highlight + bottom shadow layers.

**Note:** Best visible on medium-tone backgrounds. On white backgrounds the highlight is invisible. Applied globally via `TEXT_FINISH_SHADOW` on Master root.

**Use for:** Tactile depth on text, premium 3D feel.

```tsx
import { useInnerBevel } from "./animations";

const style = useInnerBevel(frame, fps, { delay: 5, strength: 0.15 });
return <span style={{ ...style, fontSize: 80, color: "#111827" }}>reliability</span>;
```

---

### `useFloatingShadow`

A soft, distant drop shadow that makes text appear to float above the background. Shadow grows during entrance (offset + blur increase with spring). Uses background-tinted color, not black.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before shadow appears |
| `color` | `string` | `"#4A4063"` | Shadow color (dark muted lavender) |
| `offsetY` | `number` | `15` | Vertical shadow offset (px) |
| `blur` | `number` | `35` | Shadow blur radius (px) |
| `strength` | `number` | `0.06` | Max shadow opacity (0–1) |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 60 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains animated `textShadow`.

**Use for:** Floating text over light backgrounds, depth separation.

```tsx
import { useFloatingShadow } from "./animations";

const style = useFloatingShadow(frame, fps, { delay: 5 });
return <span style={{ ...style, fontSize: 80, color: "#111827" }}>floating text</span>;
```

---

### `useSubpixelSmooth`

Applies a subtle Gaussian blur (0.3–0.5px) to text for anti-aliasing. Mimics the natural softening of high-end camera lenses or high-DPI displays.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before effect appears |
| `amount` | `number` | `0.4` | Blur amount in px (0.3–0.5 for production) |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 100 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `filter: blur()`.

**Note:** Uses `filter: blur()` — cannot go on a parent element without blurring images/panels. Applied per-element via `TEXT_FINISH`.

**Use for:** Removing "raw digital" edge from text, premium anti-aliasing.

```tsx
import { useSubpixelSmooth } from "./animations";

const style = useSubpixelSmooth(frame, fps, { delay: 5, amount: 0.4 });
return <span style={{ ...style, fontSize: 80 }}>Smooth text</span>;
```

---

### `useTracking`

Animates letter-spacing from tight to open, creating a modern "airy" tech look. The expansion is spring-driven so it naturally decelerates.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before animation starts |
| `from` | `number` | `-0.02` | Starting letter-spacing in em |
| `to` | `number` | `0.04` | Final letter-spacing in em |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `letterSpacing`.

**Use for:** Uppercase headings, brand text, tech-forward typography.

```tsx
import { useTracking } from "./animations";

const style = useTracking(frame, fps, { delay: 5, from: -0.02, to: 0.06 });
return <span style={{ ...style, fontSize: 80, textTransform: "uppercase" }}>SIMPLEX</span>;
```

---

## Static Style Constants

### `TEXT_FINISH`

Static style constant containing the settled values of `useInnerBevel` and `useSubpixelSmooth`. Spread into any text element for default finishing polish.

```tsx
import { TEXT_FINISH } from "./animations";

<span style={{ ...TEXT_FINISH, fontSize: 80, fontWeight: 700 }}>Polished text</span>
```

### `TEXT_FINISH_SHADOW`

Just the `textShadow` portion of `TEXT_FINISH`. Safe to apply on a parent element — cascades to all text children without affecting non-text elements. Already applied on the Master composition root.

### `combineTextShadows(...styles)`

Utility that joins `textShadow` values from multiple style objects. Use when stacking `useBloom` + `useInnerBevel` + `useFloatingShadow` on the same element.

```tsx
import { useBloom, useInnerBevel, useFloatingShadow, combineTextShadows } from "./animations";

const bloom = useBloom(frame, fps, { delay: 5 });
const bevel = useInnerBevel(frame, fps, { delay: 5 });
const shadow = useFloatingShadow(frame, fps, { delay: 5 });
const combined = combineTextShadows(bloom, bevel, shadow);
return <span style={{ textShadow: combined, fontSize: 80 }}>Full depth</span>;
```

---

## Spring Config Quick Reference

Most animations accept a `springConfig` override (and some use easing-first timing). Here are the presets used across this project:

| Feel | Config | Character | Used by |
|------|--------|-----------|---------|
| **Bouncy pop** | `{ damping: 17, stiffness: 288 }` | Fast snap with overshoot | `useLetterPopIn` |
| **Smooth glide** | `{ damping: 200, stiffness: 180 }` | No bounce, steady arrival | `useWordDragIn` |
| **Fast start** | `{ damping: 20, stiffness: 100 }` | Quick launch, smooth settle | `useMaskedRise` |
| **Steady sweep** | `{ damping: 200, stiffness: 80 }` | Linear-feeling, no bounce | `useGradientFill` |
| **Snappy** | `{ damping: 20, stiffness: 200 }` | Decisive, fast reveal | `useWipeReveal` |
| **Bouncy overshoot** | `{ damping: 12, stiffness: 200 }` | Playful, overshoots then settles | `useScalePop` |
| **Clean extend** | `{ damping: 200, stiffness: 120 }` | Smooth, no drama | `useGrowingUnderline`, `useTextSelection` |
| **Keyframed wave** | `0%: 0px, 50%: -20px, 100%: 0px` | 0.7s ease-in-out loop for whole-word floating | `useFloatingText` |
| **Natural movement** | `{ damping: 20, stiffness: 30 }` | Slow, organic feel | `useCursorPath` |
| **Instant snap** | `{ damping: 200, stiffness: 400 }` | Near-instant, for micro-interactions | `useCursorClick` (press/release) |
| **Entrance slide** | `{ damping: 20, stiffness: 100 }` | Panel slides in with deceleration | `usePanelReveal` |
| **Energetic resize** | `{ damping: 14, stiffness: 80 }` | Overshoot then settle | `useDynamicResize` |
| **Exponential wipe** | `revealSpring: { damping: 200, stiffness: 180 }` | Major chapter wipe, synced incoming headline | `usePowerWipeTransition` |
| **Quintic decelerate pan** | `easing: Easing.out(Easing.poly(5))` | Fast launch, smooth settle with parallax | `useCameraPanTransition` |
| **Focus lock-in** | `{ damping: 200, stiffness: 160 }` | Focus detail settles while context blurs out | `useFocusShiftTransition` |
| **LIFO dissolve exit** | `{ damping: 200, stiffness: 220 }` | Reverse-order downward dissolve | `useStaggeredDissolveExit` |
| **Gentle fade** | `{ damping: 200, stiffness: 60 }` | Slow, smooth reveal | `useMetallicText`, `useBloom`, `useFloatingShadow` |
| **Steady sweep** | `{ damping: 200, stiffness: 80 }` | Linear-feeling, no bounce | `useBrandGradient`, `useInnerBevel`, `useTracking` |
| **Quick settle** | `{ damping: 200, stiffness: 100 }` | Fast, clean arrival | `useSubpixelSmooth` |
| **Steady sweep** | `{ damping: 200, stiffness: 80 }` | Smooth fade-in, no bounce | `useRadialVignette`, `useCornerGlow` |

---

## Cursor Tip Offset

The `useCursorPath` function handles tip alignment automatically when you pass `cursorSize`. Internally it offsets by 25% left and 15% top of the cursor image size, matching `cursor.png`'s tip position. Just pass `cursorSize: 60` (or whatever size you're rendering) and use the returned `x, y` directly as `left, top`.

---

## Background Layer Primitives

Reusable background layers that stack together to create the multi-layered, dynamic backgrounds used in the Simplex promo. These are not text effects — they produce full-screen `<div>` backgrounds.

**Demo composition:** `BackgroundExamples` — 5 sections × 90 frames = 450 frames (15 seconds at 30fps)

```bash
npx remotion still BackgroundExamples --frame=<N> --output=/tmp/bg.png
```

---

### `SCENE_PALETTES`

Constant object with preset color palettes for different scene moods. Each palette has `center`, `mid`, and `outer` color stops.

| Palette | Center | Mid | Outer | Feel |
|---------|--------|-----|-------|------|
| `intro` | `#EEEEFF` | `#D5D5F5` | `#B8B8E8` | Bright lavender-purple, open |
| `integration` | `#E8E0F8` | `#CFC2F0` | `#A898D8` | Deeper violet, focused |
| `feature` | `#E0E4FF` | `#C5CCFA` | `#9AA4E8` | Cooler indigo-blue tint |

```tsx
import { SCENE_PALETTES } from "./animations";

// Use directly:
const colors = SCENE_PALETTES.intro;

// Or feed into useRadialVignette:
const bgStyle = useRadialVignette(frame, fps, { colors: SCENE_PALETTES.feature });
```

---

### `useRadialVignette`

The base background layer. Radial gradient with an offset center (40% from top), producing a soft vignette from bright center to muted edges. Fades in via spring-driven opacity.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before fade-in starts |
| `colors` | `ScenePalette` | `SCENE_PALETTES.intro` | Color stops: `{ center, mid, outer }` |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `position: absolute`, `inset: 0`, `background` (radial-gradient), and `opacity`.

**Use for:** Base background layer in every scene. Apply to a `<div>` as the first layer in an `<AbsoluteFill>` stack.

```tsx
import { useRadialVignette, SCENE_PALETTES } from "./animations";

const bgStyle = useRadialVignette(frame, fps, {
  delay: 0,
  colors: SCENE_PALETTES.intro,
});
return <div style={bgStyle} />;
```

---

### `useTemporalShift`

Smoothly interpolates between scene-specific color palettes over time. Uses Remotion's `interpolateColors` for each of the 3 gradient stops. Feed the returned palette into `useRadialVignette`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keyframes` | `number[]` | *required* | Frame numbers where palette transitions occur |
| `palettes` | `ScenePalette[]` | *required* | Matching palette for each keyframe |

**Returns:** `ScenePalette` — `{ center: string, mid: string, outer: string }` with interpolated colors at the current frame.

**Use for:** Smooth background mood transitions between scenes without hard cuts.

```tsx
import { useTemporalShift, useRadialVignette, SCENE_PALETTES } from "./animations";

const palette = useTemporalShift(frame, fps, {
  keyframes: [0, 90, 180],
  palettes: [SCENE_PALETTES.intro, SCENE_PALETTES.integration, SCENE_PALETTES.feature],
});
const bgStyle = useRadialVignette(frame, fps, { colors: palette });
return <div style={bgStyle} />;
```

---

### `useCornerGlow`

Soft radial gradient positioned at a corner, creating a directional light overlay for 3D depth. Defaults to top-left at 5% opacity — very subtle.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delay` | `number` | `0` | Frames before glow fades in |
| `position` | `"top-left"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-right"` | `"top-left"` | Corner position |
| `color` | `string` | `"white"` | Glow color |
| `size` | `number` | `60` | Gradient size as % of viewport |
| `targetOpacity` | `number` | `0.05` | Final opacity (0–1) |
| `springConfig` | `SpringConfig` | `{ damping: 200, stiffness: 80 }` | Spring physics |

**Returns:** `React.CSSProperties` — Contains `position: absolute`, `inset: 0`, `background` (radial-gradient at corner), `opacity`, and `pointerEvents: none`.

**Use for:** Simulating window light, adding depth to flat backgrounds, 3D lighting feel.

```tsx
import { useCornerGlow } from "./animations";

const glowStyle = useCornerGlow(frame, fps, {
  delay: 5,
  position: "top-left",
  targetOpacity: 0.05,
});
return <div style={glowStyle} />;
```

---

### `FilmGrainOverlay` (Component)

SVG noise overlay using `feTurbulence`. A React component (not a hook) because it renders SVG DOM elements.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `number` | `15` | Opacity 0–100 (15 = 15% opacity, ~1.5% perceived) |
| `animated` | `boolean` | `false` | When true, changes seed per frame for animated grain |
| `baseFrequency` | `number` | `0.65` | Turbulence granularity (higher = finer grain) |
| `blendMode` | `CSSProperties["mixBlendMode"]` | `"overlay"` | How grain composites with background |

**Import from:** `./FilmGrainOverlay` (separate file, not in animations.ts)

**Use for:** Adding analog texture to digital backgrounds. Layer on top of gradient backgrounds.

```tsx
import { FilmGrainOverlay } from "./FilmGrainOverlay";

<AbsoluteFill>
  <div style={bgStyle} />
  <FilmGrainOverlay intensity={15} />
  <Content />
</AbsoluteFill>
```

---

### Background Layer Stack (Recommended Order)

For the full Simplex promo background, layer these bottom-to-top:

```tsx
<AbsoluteFill>
  {/* 1. Base gradient (required) */}
  <div style={useRadialVignette(frame, fps, { colors: palette })} />

  {/* 2. Film grain (optional — adds analog texture) */}
  <FilmGrainOverlay intensity={15} />

  {/* 3. Corner glow (optional — adds directional light) */}
  <div style={useCornerGlow(frame, fps, { position: "top-left" })} />

  {/* 4. Content */}
  <YourContent />
</AbsoluteFill>
```

Use `useTemporalShift` to drive the `colors` prop of `useRadialVignette` for smooth palette transitions between scenes.
