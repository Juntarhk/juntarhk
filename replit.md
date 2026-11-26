# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.
This project is a JuntarHK extracurricular activity platform targeting kindergartens, primary schools, and secondary schools in Hong Kong.

## Bilingual System (zh / en)

- `artifacts/activity-platform/src/i18n/translations.ts` — all zh/en translation strings for every page
- `artifacts/activity-platform/src/contexts/LanguageContext.tsx` — `LanguageProvider` + `useLanguage()` hook, persists via localStorage (`juntarhk_lang`)
- Toggle button in Navbar ("EN" / "中") switches the entire site between Traditional Chinese and English
- All pages (Home, About, Contact, Activities, Partners), Navbar, Footer, EnquiryModal use `useLanguage()` / `t.*` for all user-visible text
- `About.tsx` fully translated — credentials (outdoor/training/photo), team member roles/bios, Bula Land section, About JuntarHK section, USP section, and trust/partner schools section all use translation keys
- `ActivityCard.tsx` fully translated — category badges, featured label, photo count, target group label all use language context; category names use `CATEGORY_NAMES_EN` mapping
- `Activities.tsx` category dropdown uses `CATEGORY_NAMES_EN` mapping for English display; error states translated
- `ActivityDetail.tsx` fully translated — all UI labels use `t.activityDetail.*`; displays English title/description/duration/location when in EN mode (falls back to Chinese if EN not set)
- `Partners.tsx` fully translated — backLink uses `pl.backLink` translation key
- SEO meta tags on About and Activities pages are language-aware
- **Activity EN content**: DB has `descriptionEn`, `durationEn`, `locationEn` columns (nullable); admin panel "英文內容" tab allows filling in English content per activity via PATCH `/api/activities/:id`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + Shadcn UI + Framer Motion + React Query

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── activity-platform/  # React frontend (JuntarHK platform)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## JuntarHK Platform Features

- **Homepage**: Hero banner, featured activities, category grid, "Why Choose Us", CTA
- **Activities listing**: Filterable by category, school type (kindergarten/primary/secondary), and search
- **Activity detail**: Full description, duration, participant count, location, enquiry button
- **About page**: Founder Kingston Chan (KC) profile + team section; sister company Bula Land
- **Contact/Enquiry page**: Generic enquiry form (supports schools, NGOs, companies); 7 org types

## Database Content (as of March 2026)

### Categories (8 total)
- 野外活動 (id:1) — Outdoor Activities: 5 activities
- 鄒戲運動 (id:2) — Sports & Games: 6 activities
- 中華文化活動 (id:3) — Chinese Cultural Activities: 4 activities
- 藝術創作 (id:4) — Arts & Crafts: 2 activities
- STEM活動 (id:5) — STEM: 2 activities
- 生態探索 (id:6) — Ecology Exploration: 5 activities
- 歷奇訓練 (id:7) — Adventure Training: 7 activities
- 環球文化體驗 (id:8) — Global Cultural Experience: 1 activity

### Activities (32 total)
Batch 1: sports day (KinBall, Roundnet, Pickleball, Futnet, Floor Curling, Moikky, etc.), rock climbing, campus adventure, leadership training, forest education, wild cooking, wilderness survival, bamboo scaffolding, orienteering.
Batch 2: 烽火台 (Beacon Tower bamboo challenge), Formula 1 極速挑戰, War Game 團隊戰略訓練, 薩摩亞文化體驗日 (Samoan Cultural Day).

### Activity Images (in `artifacts/activity-platform/public/`)
- `/sports-day-cover.jpg`, `/sports-day-list.jpg` — sports day posters
- `/rock-climbing.jpg` — bouldering workshop
- `/campus-adventure.jpg`, `/campus-adventure-list.jpg` — campus adventure
- `/forest-education.jpg`, `/forest-education-detail.jpg` — forest education day
- `/wild-cooking.jpg` — wild cooking training
- `/wilderness-survival.jpg` — wilderness survival
- `/bamboo-scaffolding.jpg` — bamboo scaffolding workshop
- `/mangrove-ecosystem.jpg` — mangrove ecology tour
- `/beacon-tower.jpg`, `/beacon-tower-detail.jpg` — beacon tower
- `/formula1-challenge.jpg`, `/formula1-detail.jpg` — F1 speed challenge
- `/war-game.jpg`, `/war-game-detail.jpg` — war game strategy training
- `/samoan-cultural-day.jpg`, `/samoan-cultural-detail.jpg` — Samoan cultural day

## API Endpoints

- `GET /api/activities` - List activities (filters: category, targetGroup, search)
- `GET /api/activities/:id` - Activity detail
- `GET /api/categories` - Activity categories
- `POST /api/enquiries` - Submit school enquiry
- `GET /api/enquiries` - List enquiries (admin)
- `GET /api/seo-settings` - Public; returns SEO key-value settings from DB
- `POST /api/admin/seo-settings` - Protected; saves SEO settings (title, description, keywords, OG, Google verification)
- `GET /api/healthz` - Health check

## Database Schema

- `categories` - Activity categories with icons and colors
- `activities` - Activity listings with target group, duration, participants
- `enquiries` - School enquiry submissions

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client & Zod schemas
- `pnpm --filter @workspace/db run push` — push schema to database
