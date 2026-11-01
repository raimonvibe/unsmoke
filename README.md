# Unsmoke — Quit Smoking & Vaping Tracker

A frontend-only Next.js app that helps you track your smoke-free journey. All data stays in your browser via `localStorage` — no account, no backend, works offline. **Not medical advice**; not affiliated with CDC, WHO, or any health authority.

## Features

- **Onboarding** — quit date/time, products used, daily usage, costs
- **Dashboard** — live counter, money saved, units avoided, milestone progress
- **Health timeline** — 56 sourced milestones from 20 minutes to 30 years (16 in the first 3 weeks, 21 after year one) from CDC, WHO, NHS, ACS, ALA, NCI, NIDA and peer-reviewed studies; every milestone has its own progress bar and countdown, plus recovery-window bars for 3 weeks, 3 months, 1, 5, 10, 20 and 30 years
- **Product-aware** — cigarettes and rolling tobacco see every milestone; vaping-only quitters see nicotine-related milestones (smoke-specific ones such as carbon monoxide are hidden)
- **Craving support** — 60-second 4-4-4 breathing exercise and motivational messages
- **Stats** — craving log, 7-day chart, streak, achieved milestones
- **Sources & disclaimer** — expandable panel with official references

## Data & sources

| What you see | Source |
|--------------|--------|
| Timer, money, cigarettes/ml/grams | Your inputs + in-app math |
| Nicotine (vape / pack label) | Your bottle or pouch label |
| Nicotine (tobacco, est.) | Approximate blend defaults — use pack label when possible |
| Health milestones | [CDC benefits of quitting](https://www.cdc.gov/tobacco/about/benefits-of-quitting.html), [WHO cessation Q&A](https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation), [NHS smoke free timeline](https://111.wales.nhs.uk/LiveWell/QuitSmokingTimeline/), [Smokefree.gov withdrawal](https://smokefree.gov/challenges-when-quitting/withdrawal/understanding-withdrawal), [NIDA receptor study](https://archives.drugabuse.gov/news-events/nida-notes/2009/10/abstinent-smokers-nicotinic-receptors-take-more-than-a-month-to-normalize), and studies on taste, mood, insulin, HDL, gums, lung function, life expectancy, cardiovascular disease, lung cancer, diabetes, teeth, eyesight and rheumatoid arthritis — full list in `src/lib/health-sources.ts` |

The app does **not** fetch live data from these sites; milestones are stored locally and matched to published timelines.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Branding & link previews

Assets in `public/`:

| File | Used for |
|------|----------|
| `favicon.ico` | Browser tab icon, Apple touch icon, PWA install icon |
| `social-share.png` | Open Graph / Twitter / iMessage link preview image |

When deploying, set your public URL so share previews resolve images correctly:

```bash
cp .env.example .env.local
# Edit NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com
```

## Tests

```bash
npm test
```

## localStorage keys

| Key | Description |
|-----|-------------|
| `quitData` | Quit date, product sections, daily usage, costs |
| `cravingLog` | Array of ISO timestamps for craving button taps |

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
