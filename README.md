# Unsmoke — Quit Smoking & Vaping Tracker

A frontend-only Next.js app that helps you track your smoke-free journey. All data stays in your browser via `localStorage` — no account, no backend, works offline. **Not medical advice**; not affiliated with CDC, WHO, or any health authority.

## Features

- **Onboarding** — quit date/time, products used, daily usage, costs
- **Dashboard** — live counter, money saved, units avoided, milestone progress
- **Health timeline** — milestones aligned with the [U.S. CDC “benefits over time” table](https://www.cdc.gov/tobacco/about/benefits-of-quitting.html) (2024), with source links
- **Craving support** — 60-second 4-4-4 breathing exercise and motivational messages
- **Stats** — craving log, 7-day chart, streak, achieved milestones
- **Sources & disclaimer** — expandable panel with official references

## Data & sources

| What you see | Source |
|--------------|--------|
| Timer, money, cigarettes/ml/grams | Your inputs + in-app math |
| Nicotine (vape / pack label) | Your bottle or pouch label |
| Nicotine (tobacco, est.) | Approximate blend defaults — use pack label when possible |
| Health milestones | [CDC benefits of quitting](https://www.cdc.gov/tobacco/about/benefits-of-quitting.html); also [Surgeon General 2020](https://www.cdc.gov/tobacco/sgr/2020/index.htm), [WHO cessation Q&A](https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation) |

The app does **not** fetch live data from these sites; milestones are stored locally and matched to published timelines.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
