# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js + Remotion programmatic video editing project. There are two dev services:

- **Remotion Studio** — interactive preview/editing environment for video compositions
- **Next.js dev server** — web UI with embedded `@remotion/player`

No database, Docker, or external services are required for local development.

### Running services

See `README.md` for standard commands (`npm run dev`, `npx remotion studio`, etc.).

- Remotion Studio (local non-Cursor only): `npx remotion studio src/remotion/index.ts` (default port 3000; use `--port 3123` to avoid conflicts with Next.js)
- Cursor/Cloud containers: **do not run `npx remotion studio`** (it can crash Cursor containers). Instead, render **individual frames** (`npx remotion still`) and **individual section segments** (`npx remotion render --frames=<start>-<end>`).
- Next.js dev: `npm run dev` (port 3000)
- Render a still frame: `npx remotion still src/remotion/index.ts <CompositionId> --frame=<N> --output=/tmp/frame.png`

### Rendering workflow

**Do NOT one-shot all sections at once without viewing them.** For each section and each change you make to a section/sequence in the master composition, you MUST render stills and visually inspect them before moving on. Build one section → register it → render key frames → verify → then move to the next. Always show the rendered stills inline so the user can glance at progress. Do NOT ask for approval — just show and keep moving.

**Render stills to inspect animations frame-by-frame:**
```bash
npx remotion still src/remotion/index.ts <CompositionId> --frame=<N> --output=/tmp/frame.png
```

**Render a section as MP4 to show completed work:**
```bash
npx remotion render src/remotion/index.ts <CompositionId> --output=/opt/cursor/artifacts/<name>.mp4 --frames=<start>-<end> --concurrency=1
```

**Render the full composition:**
```bash
npx remotion render src/remotion/index.ts <CompositionId> --output=/opt/cursor/artifacts/<name>.mp4 --concurrency=1
```

After every change: render key frames (entrance, mid, settled) → read the PNGs to inspect → fix issues → then render the section as MP4 to show the user. Commit and push before rendering.

### Non-obvious caveats

- The first `npx remotion still` or `npx remotion render` invocation downloads Chrome Headless Shell (~87 MB). Subsequent runs use the cached binary.
- Remotion/video-editing conventions (spring configs, easing rules, composition IDs) are documented below and in `ANIMATION.md`.
- **Use SF Pro Display as the default sans font.** Import `FONT_FAMILY` from `animations.ts` — never use Geist or Inter. Use weights `300` (Light), `400` (Regular), and `700` (Bold). The font files `SF-Pro-Display-Light.otf`, `SF-Pro-Display-Regular.otf`, and `SF-Pro-Display-Bold.otf` are in `public/`. Use `monospace` for terminal/code elements only.
- ESLint and TypeScript report pre-existing unused-import errors in `Root.tsx`, `SimplexBanner.tsx`, and `SimplexLogo.tsx`. These are not regressions.
- AWS Lambda rendering (`deploy.mjs`) is optional and requires `REMOTION_AWS_ACCESS_KEY_ID` and `REMOTION_AWS_SECRET_ACCESS_KEY` env vars. Local rendering works without them.

---

## Animation Reference

All reusable animation functions are documented in **`ANIMATION.md`** at the project root. When the user requests a specific animation effect, always check `ANIMATION.md` first to see if it already exists, how to use it, and what parameters it accepts.

## Text Finishing — Always Apply

All text in this project must use the `TEXT_FINISH` style from `animations.ts`. This applies a subtle inner bevel (top-edge highlight + bottom shadow) and subpixel smoothing (0.4px blur) for a polished, premium look.

- **`TEXT_FINISH_SHADOW`** is already applied globally on the Master composition root — the bevel cascades to all text via `textShadow` inheritance.
- **`TEXT_FINISH`** (bevel + subpixel blur) should be spread into individual text element styles for the full effect. The `filter: blur(0.4px)` cannot go on a parent without blurring images/panels, so it's opt-in per element.

```tsx
import { TEXT_FINISH } from "./animations";

// Apply to any text element for full finishing:
<span style={{ ...TEXT_FINISH, fontSize: 80, fontWeight: 700 }}>Polished text</span>
```

When creating new text elements, always spread `TEXT_FINISH` into their style.

## Text Transitions — Vary Them

**Do NOT default to `useLetterPopIn` for every text entrance.** Vary text transitions across sections to keep the video visually interesting. Combine and layer these for richer reveals:

- **`useMaskedRise`** — text slides up from behind a mask (clean, editorial feel)
- **`useWipeReveal`** — clip-path wipe reveals text left-to-right
- **`useGradientFill`** — color sweeps across text via gradient mask
- **`useWordDragIn`** — words fade and drag into place (good for body/subtext)
- **`useLetterPopIn`** — bouncy letter-by-letter scale (use sparingly, e.g. hero titles only)

The recommended default for section headings is a **combo of `useMaskedRise` + `useWipeReveal` + `useGradientFill`** — the text rises up, wipes in, and the color sweeps across simultaneously. Reserve `useLetterPopIn` for the main intro title or moments that need extra emphasis.

## Scene Transitions — Chapter Navigation

Use these reusable scene-transition hooks from `animations.ts` for section-to-section flow:

- **`usePowerWipeTransition`** — major chapter changes; full-screen left→right wipe with exponential in-out timing and synced incoming text reveal.
- **`useCameraPanTransition`** — related UI navigation; layered parallax pan with quintic-out deceleration and directional blur.
- **`useFocusShiftTransition`** — macro→detail movement; context zoom/blur out while focused detail stays sharp.
- **`useStaggeredDissolveExit`** — partial clear-out; reverse-entry, Last-In-First-Out dissolve with downward masked motion.

Reference implementation: `AnimationReference` sections **15–18**.

## Pacing — No Dead Frames

**Every frame should have something animating.** Avoid gaps where nothing moves — dead frames kill pacing and feel sluggish. The only exception is a brief 20–30 frame hold at the end of a section before transitioning out.

Guidelines:
- Overlap animations: the next element should start entering before the previous one fully settles (stagger, premount)
- Terminal typing should begin as soon as the terminal entrance is ~70% complete, not after it fully lands
- Section headings should start animating immediately at frame 0 of their sequence
- Fade-outs at section ends should overlap with the next section's entrance via premount
- If you render a still and nothing is moving, the timing is too loose — tighten delays
- But don't over-tighten: the viewer needs a beat to register each piece of content. Aim for the sweet spot between "snappy" and "readable" — roughly 5–10 frames of breathing room between major elements settling and the next animation starting

## Background Layers — Always Use

All scenes should use the reusable background system from `animations.ts` and `FilmGrainOverlay.tsx`. Never use flat `backgroundColor` — always layer the background primitives.

### Quick setup (recommended stack)

```tsx
import { useRadialVignette, useCornerGlow, SCENE_PALETTES } from "./animations";
import { FilmGrainOverlay } from "./FilmGrainOverlay";

// Inside your composition:
const bgStyle = useRadialVignette(frame, fps, { colors: SCENE_PALETTES.intro });
const glowStyle = useCornerGlow(frame, fps, { position: "top-left" });

<AbsoluteFill>
  <div style={bgStyle} />
  <FilmGrainOverlay intensity={15} />
  <div style={glowStyle} />
  <YourContent />
</AbsoluteFill>
```

### Available palettes (`SCENE_PALETTES`)

- **`intro`** — Bright lavender-purple (`#EEEEFF` → `#B8B8E8`)
- **`integration`** — Deeper violet (`#E8E0F8` → `#A898D8`)
- **`feature`** — Cooler indigo-blue (`#E0E4FF` → `#9AA4E8`)

Use `useTemporalShift` to smoothly morph between palettes over time. See `ANIMATION.md` for full docs.

## Session Startup

At the start of every session in Cursor/Cloud containers, **do not start** Remotion Studio.
Use still/render commands directly for verification by rendering individual key frames and per-section segments:

```bash
npx remotion still src/remotion/index.ts <CompositionId> --frame=<N> --output=/tmp/frame.png
npx remotion render src/remotion/index.ts <CompositionId> --output=/opt/cursor/artifacts/<name>.mp4 --frames=<start>-<end> --concurrency=1
```

For non-Cursor local development, running `npx remotion studio src/remotion/index.ts` is still allowed.

## Core Instruction

Operate as if you are working inside **Premiere Pro or DaVinci Resolve**. This is the most important framing for this project. You understand timelines, layers, keyframes, and non-linear editing. Apply that mental model to every Remotion task.

## Video Editing Concepts (mapped to Remotion)

### Ripple Editing
When a section is removed, everything after it shifts forward to fill the gap — no empty space left behind. In Premiere Pro, this is "Ripple Delete": you remove a clip and the timeline closes the hole automatically.

**In Remotion:** When the user says "remove this part," delete the component/section AND adjust all subsequent `from` offsets so the timeline is continuous. Never leave dead frames. Always update `durationInFrames` on the parent composition.

```tsx
// BEFORE: 3 sequences
<Sequence from={0} durationInFrames={60}><SceneA /></Sequence>
<Sequence from={60} durationInFrames={90}><SceneB /></Sequence>  // ← remove this
<Sequence from={150} durationInFrames={60}><SceneC /></Sequence>

// AFTER: ripple delete — SceneC shifts forward, fix all `from` offsets
<Sequence from={0} durationInFrames={60}><SceneA /></Sequence>
<Sequence from={60} durationInFrames={60}><SceneC /></Sequence>
```

### Easing
Acceleration and deceleration curves applied to animations instead of linear movement. In After Effects, these are the speed graph curves (Easy Ease, Ease In, Ease Out). Linear motion looks robotic; easing makes motion feel natural.

**In Remotion:** Use `interpolate()` with `Easing` functions, or use `spring()` for physics-based motion. Prefer `spring()` — this codebase uses it almost exclusively.

Available easing curves (most linear to most curved): `Easing.quad`, `Easing.sin`, `Easing.exp`, `Easing.circle`. Combine with `Easing.in()`, `Easing.out()`, or `Easing.inOut()`. Cubic bezier is also supported via `Easing.bezier()`.

```tsx
import { interpolate, Easing } from "remotion";

// Ease out — fast start, slow finish (object arriving)
const opacity = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.out(Easing.quad),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Ease in-out — smooth both ends (transitions between states)
const x = interpolate(frame, [0, 60], [0, 500], {
  easing: Easing.inOut(Easing.sin),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Cubic bezier (custom curve)
const y = interpolate(frame, [0, 60], [0, 300], {
  easing: Easing.bezier(0.8, 0.22, 0.96, 0.65),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### Speed Ramping
Changing the playback speed of a clip over time — typically starting slow, going fast, then slowing down again. In Premiere Pro this is "Time Remapping." Used for dramatic emphasis (e.g., a logo slam that starts fast and decelerates into place).

**In Remotion:** Use `spring()` — it naturally speed-ramps (fast snap then settle). This repo uses spring configs like `{ damping: 200 }` for smooth motion and `{ damping: 200, stiffness: 200 }` for snappy motion.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Smooth, no bounce — subtle reveals
const progress = spring({ frame, fps, config: { damping: 200 } });

// Snappy, minimal bounce — UI elements
const snap = spring({ frame, fps, config: { damping: 200, stiffness: 200 } });

// Bouncy entrance — playful animations
const bounce = spring({ frame, fps, config: { damping: 8 } });

// Delayed entrance (starts 20 frames in)
const delayed = spring({ frame, fps, delay: 20, config: { damping: 200 } });

// Map spring output (0→1) to custom ranges
const rotation = interpolate(progress, [0, 1], [0, 360]);
```

### Keyframes
Specific points in time where you define a property value. The software (or Remotion) interpolates between them. In After Effects, you place keyframes on the timeline for position, scale, opacity, rotation, etc.

**In Remotion:** The `interpolate()` input/output arrays ARE your keyframes. Write timing in seconds and multiply by `fps` for readability.

```tsx
const { fps } = useVideoConfig();

// Two keyframes: frame 0 → opacity 0, frame 30 → opacity 1
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Four keyframes: fade in, hold, fade out (using seconds × fps)
const opacity = interpolate(
  frame,
  [0, 0.5 * fps, 2.5 * fps, 3 * fps],
  [0, 1, 1, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// Color interpolation between keyframes
import { interpolateColors } from "remotion";
const color = interpolateColors(frame, [0, 30], ["#ff0000", "#0000ff"]);
```

### Compositing / Layering
Stacking visual elements on top of each other. In Premiere Pro/After Effects, this is your layer stack and track mattes.

**In Remotion:** Use `<AbsoluteFill>` for layer stacking. This codebase uses CSS masks (`maskImage`/`WebkitMaskImage`) for track mattes and `perspective`/`preserve-3d` for 3D compositing.

```tsx
// Layer stacking
<AbsoluteFill>
  <AbsoluteFill style={{ zIndex: 0 }}><Background /></AbsoluteFill>
  <AbsoluteFill style={{ zIndex: 1 }}><Particles /></AbsoluteFill>
  <AbsoluteFill style={{ zIndex: 2 }}><Title /></AbsoluteFill>
</AbsoluteFill>

// CSS mask (track matte equivalent)
<div style={{
  WebkitMaskImage: "url('/mask.png')",
  maskImage: "url('/mask.png')",
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
}}>
  <Content />
</div>

// 3D perspective compositing
<AbsoluteFill style={{ perspective: 2000 }}>
  <AbsoluteFill style={{
    transformStyle: "preserve-3d",
    transform: `rotateX(${rotX}deg) translateZ(${z}px)`,
  }}>
    <Card />
  </AbsoluteFill>
</AbsoluteFill>
```

## NEVER Use Linear Transitions

**Linear interpolation for displacement, scale, or rotation is FORBIDDEN.** Linear motion looks robotic and unnatural. Every movement must use easing or spring physics. There are no exceptions.

### Approved transition methods (use one of these for EVERY animation):

1. **`spring()`** — Physics-based, the default choice. Naturally speed-ramps.
   - `{ damping: 200 }` — Smooth, no bounce (reveals, subtle shifts)
   - `{ damping: 20, stiffness: 200 }` — Snappy, fast start then decelerate (logo shifts, displacement)
   - `{ damping: 10, stiffness: 30, mass: 1.5 }` — Slow build with overshoot/settle (dramatic entrances)
   - `{ damping: 14, stiffness: 120, mass: 0.8 }` — Fast with slight drag at end
   - `{ damping: 17, stiffness: 180 }` — Subtle pop with minimal bounce (text pop-in)

2. **`interpolate()` with `Easing`** — Curve-based, for when spring doesn't fit.
   - `Easing.out(Easing.quad)` — Fast start, slow finish (arriving elements)
   - `Easing.in(Easing.quad)` — Slow start, fast finish (departing elements)
   - `Easing.inOut(Easing.sin)` — Smooth both ends (state transitions)
   - `Easing.bezier(0.8, 0.22, 0.96, 0.65)` — Custom curve

3. **Custom easing via multi-point `interpolate()`** — For complex timing curves.
   ```tsx
   // Slow at start, fast in middle, slow at end
   const eased = interpolate(progress, [0, 0.15, 0.5, 1], [0, 0.02, 0.6, 1], {
     extrapolateRight: "clamp",
   });
   ```

### What we've used in this project:
- **Logo spin-in entrance**: Custom multi-point easing + spring with overshoot (`damping: 10, stiffness: 30, mass: 1.5`)
- **Logo horizontal shift**: Snappy spring (`damping: 20, stiffness: 200`) — fast start, decelerate
- **Text letter pop-in**: Bouncy spring (`damping: 17, stiffness: 180`)
- **Terminal entrance**: Smooth spring (`damping: 200`) — no bounce
- **Terminal flip-out**: Snappy spring (`damping: 200, stiffness: 200`)

## Reusable Animation Styles

All animation hooks, text finishing effects, background primitives, and spring config presets are documented in **`ANIMATION.md`**. Always check there first before writing custom spring/interpolate logic.

## IMPORTANT: Visual Frame Inspection

**Before declaring any section finished, render and visually inspect key frames.** This is the only reliable way to catch overlap, misalignment, ghost artifacts, and timing issues. Code review alone is not enough.

### How to render a still frame

```bash
npx remotion still src/remotion/index.ts <CompositionId> --frame=<N> --output=/tmp/frame.png
```

Then read the PNG with the Read tool to visually inspect it.

### Inspection workflow

1. Identify the key phases of the animation (entrances, transitions, holds)
2. Render frames at the start, middle, and end of each phase
3. Read each PNG and check for: overlapping elements, ghost artifacts (borders/cursors visible too early), clipping, text crowding, z-order issues
4. Fix issues, re-render the affected frames, verify the fix
5. Only declare the section done after visual verification passes

### Common composition IDs

Check `Root.tsx` for the full list of registered compositions. Demo/reference compositions for browsing available animations:

- `AnimationReference` — all 26 animations (2340 frames)
- `AnimationDemo` — text animation templates (450 frames, 5×90)
- `AnimationDemo2` — cursor & interaction animations (540 frames, 6×90)
- `BackgroundExamples` — background layer primitives (450 frames, 5×90)

## Key Rules

1. **NEVER use linear interpolation for movement.** Every displacement, scale, rotation, or zoom MUST use `spring()` or `interpolate()` with an `Easing` function. Raw `interpolate(frame, [...], [...])` without easing is banned.
2. **"Remove this part" = ripple delete.** Delete the section and shift all subsequent `<Sequence>` `from` offsets forward. Update `durationInFrames` on the parent composition.
3. **Prefer `spring()` over `Easing`** for most animations. Use `{ damping: 200 }` as the safe default. This codebase uses `spring()` almost exclusively.
4. **Always clamp extrapolation.** Set `extrapolateLeft: "clamp"` and `extrapolateRight: "clamp"` on every `interpolate()` call. Unclamped values cause elements to fly off screen.
5. **Always premount sequences.** Add `premountFor={1 * fps}` to every `<Sequence>` so components load before they appear.
6. **CSS animations are forbidden.** Never use CSS `transition`, `animation`, `@keyframes`, or Tailwind animation classes. They don't render correctly in Remotion. All motion must go through `useCurrentFrame()` + `interpolate()`/`spring()`.
7. **Think in timelines.** Every `<Sequence>` is a clip on a track. `from` is the in-point. `durationInFrames` is the clip length. Compositions are nested timelines.
8. **Use `staticFile()` for assets.** Reference files in the `public/` folder with `staticFile("filename.png")`, not relative paths.
9. **Context is everything.** If you don't know how an effect works in motion graphics, ask — don't guess. If given a tutorial or reference, study the technique and replicate it in CSS/React.
10. **Learn and replicate.** When taught a new technique (parallax, morph, etc.), apply it consistently across similar elements.
