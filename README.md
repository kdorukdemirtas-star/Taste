# Taste Engine

Taste Engine, frontend gelistiriciler icin AI destekli Design QA ve Auto-Fixer studyosudur. Kod kalitesi icin ESLint ne yapiyorsa, arayuz kalitesi icin Taste Engine benzer bir deneyim sunar: Tailwind tabanli UI kodunu analiz eder, tasarim karnesi uretir ve Magic Swap ile daha premium siniflar onerir.

## Temel Ozellikler

- Gercek zamanli tasarim linting: renk, spacing, tipografi, hiyerarsi ve premium hissiyat metrikleri
- Taste HUD: glassmorphism rapor paneli ve aciklanabilir tasarim bulgulari
- Magic Swap: kotu UI classlarini premium Tailwind siniflariyla degistiren otomatik duzeltme
- Before / After demo: tasarim donusumunu jurinin aninda gorebilecegi karsilastirma
- LLM provider ayarlari: simulated, Ollama, OpenRouter ve Anthropic secenekleri

## Calistirma

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
