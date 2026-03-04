<h1 align="center">Montage</h1>

<h3 align="center">Build agentic product videos with Next.js + Remotion</h3>

<p align="center">
  Programmatic motion graphics for product demos, feature walkthroughs, and launch videos — all written in React.
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/simplexlabs/montage?style=for-the-badge&labelColor=000">
  <img alt="Works with" src="https://img.shields.io/badge/Works%20with-Cursor%20%7C%20Claude%20Code%20%7C%20Codex-blue?style=for-the-badge&labelColor=000">
</p>

---

## What is Montage?

Montage is an agentic fork of [Remotion](https://remotion.dev)'s NextJS app that's set up for agents to quickly churn out high quality launch videos. This repo is NOT meant to be run manually -- you should open it in Claude Code, Cursor, Codex, etc.

Using Montage, you can churn out high quality product videos in a few hours that look like this:

<video src="https://github.com/user-attachments/assets/e7257684-72e1-47a3-a9e6-0c94b801dc8f" width="720" controls></video>

## Quick Start

### Step 1: Install and create project

```bash
git clone https://github.com/simplexlabs/montage.git
cd montage
npm install
npx remotion studio
```

This opens the Remotion Studio where you can preview and edit compositions. You can also start the Next.js dev server with `npm run dev`, render locally with `npx remotion render`, or upgrade Remotion with `npx remotion upgrade`.

### Step 2: Import branding

Point your coding agent to your frontend or particular branding materials, and tell it to replace the background primitives and the logo with your own. This lets the agent match your brand's colors, gradients, and logo across all compositions automatically.

### Step 3: Start creating

Tell the agent to create a master sequence in a new folder and start creating! You can copy any of the examples to get started, and should tell the agent to reference `AGENTS.md` and to leverage all animations possible.

## Project Structure

```
src/remotion/
├── Root.tsx                          # Composition registry
├── index.ts                         # Remotion entry point
├── Examples/
│   ├── cli-deep-dive/               # CLI deep-dive video project
│   │   ├── CLIDeepDiveMaster.tsx     # Master composition
│   │   ├── CLIIntro.tsx
│   │   ├── CLIInstallSection.tsx
│   │   ├── CLISendEventsSection.tsx
│   │   ├── CLIPauseResumeSection.tsx
│   │   ├── CLIRunSection.tsx
│   │   ├── CLITerminal.tsx
│   │   └── TerminalContent.tsx
│   └── EditorFeature/               # Editor feature video project
│       ├── CLIDeepDiveMaster.tsx     # Master composition
│       ├── CLIIntro.tsx
│       ├── BrowserGrid.tsx
│       ├── EditorPeek.tsx
│       └── ... (19 files)
└── shared/                          # Reusable components
    ├── animations.ts                # Animation hooks & utilities
    ├── AnimationReference.tsx
    ├── EditorShowcase.tsx
    ├── EditorShowcase2.tsx
    └── ... (18 files)
```

## Animation System

Every animation uses spring physics or eased interpolation — no linear motion, no CSS transitions. The `shared/animations.ts` module exports:

- **Spring presets** — `{ damping: 200 }` for smooth reveals, `{ damping: 20, stiffness: 200 }` for snappy motion
- **Text effects** — typing animations, word-by-word reveals, masked rises, drag-in entrances
- **Background layers** — radial vignettes, corner glows, film grain, scene palettes
- **Scene transitions** — power wipes, camera pans, focus shifts, staggered dissolves

See [`ANIMATION.md`](ANIMATION.md) for the full API reference.

## Compositions

| Folder | Composition | Description |
| --- | --- | --- |
| Examples / CLI-Deep-Dive | `CLIDeepDiveMaster` | Full CLI deep-dive video |
| Examples / CLI-Deep-Dive | `CLI-Intro`, `CLI-Install`, `CLI-SendEvents`, `CLI-PauseResume`, `CLI-Run` | Individual sections |
| Examples / EditorFeature | `EditorFeatureMaster` | Full editor feature video |
| Examples / EditorFeature | `EditorFeature-Intro`, `EditorFeature-BrowserGrid` | Individual sections |
| Shared | `AnimationReference` | Animation library reference |
| Shared | `EditorShowcase`, `EditorShowcase2` | Editor UI mockups |
| Shared | `SimplexBanner`, `SimplexLogo`, `SimplexText`, etc. | Brand components |

## Acknowledgments

Built on the [Remotion Next.js App Router + Tailwind template](https://github.com/remotion-dev/template-next-app-dir-tailwind) by the [Remotion](https://remotion.dev) team.

## License

MIT — see [LICENSE](LICENSE).

Note: Remotion itself has its own license. Some entities may need a Remotion company license. [Read their terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

---

<p align="center">
  Built by <a href="https://simplex.sh">Simplex Labs</a>
</p>
