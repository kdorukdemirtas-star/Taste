# Taste Engine

Taste Engine is an OpenRouter-powered AI Design QA and Auto-Fixer studio for frontend developers. It works like a design linter for Tailwind UI: paste or upload component code, run an audit, inspect the Taste HUD scorecard, and use Magic Swap to transform rough UI classes into a more premium design system.

## Features

- Real-time design linting for contrast, spacing, typography, hierarchy, and premium feel
- Taste HUD with glassmorphism styling and explainable AI findings
- Magic Swap to rewrite weak Tailwind classes into polished product UI
- Before / After comparison for a clear demo story
- Curated demo presets for needs-work, balanced, and premium CTA states
- One-click jury demo that runs the full audit-to-fix transformation
- OpenRouter-only API settings for a focused production deployment path

## Jury Demo Flow

1. Click **Start Jury Demo** in the hero.
2. Watch Taste Engine load a weak CTA, run the design audit, and open the Taste HUD.
3. Magic Swap automatically upgrades the Tailwind classes and the live preview becomes premium.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel Deployment

This repository is ready to import directly into Vercel.

- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The same settings are also defined in `vercel.json`, so Vercel should detect the correct deployment configuration automatically.
