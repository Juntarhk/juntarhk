# JuntarHK website

The bilingual JuntarHK activities and education website, imported from
[the Replit prototype](https://replit.com/@thesophiaman/Juntarhk-school-hub).
GitHub is the source-code home. This import does not change the live Replit
deployment, production database, domain, or service configuration.

## Requirements

- Node.js 24 and pnpm 10.34.9
- PostgreSQL for the API and database-backed prerendering
- Git LFS for the website's videos

```sh
git lfs install
git clone https://github.com/Juntarhk/juntarhk.git
cd juntarhk
git lfs pull
pnpm install --frozen-lockfile
```

For an unmerged import, check out the pull request's branch before running
`git lfs pull`.

## Layout

| Directory | Purpose |
| --- | --- |
| `artifacts/activity-platform` | React 19, Vite, Tailwind frontend and production static server |
| `artifacts/api-server` | Express API, enquiries, administration, storage and Stripe integration |
| `lib/api-spec` | OpenAPI specification and Orval generation |
| `lib/api-client-react`, `lib/api-zod` | Generated client hooks and validation schemas |
| `lib/db` | PostgreSQL connection and Drizzle schemas |
| `lib/programmes-data` | Shared programme content |
| `lib/object-storage-web` | Upload components |
| `attached_assets` | Only the original uploads imported directly by website source |

Unused uploads, unrelated proposal applications, dependency directories, build
output, credentials and production database records are not part of this import.

## Local development

Copy `.env.example` to `.env`, fill it locally, and export those variables into
both development shells. Node/pnpm do not automatically load this file.
Never commit `.env`. Store production credentials in the host's secret manager.

Use a **new disposable PostgreSQL database**, not the production database.
`DATABASE_URL` is required. Set `ADMIN_PASSWORD` for local admin access.
`GMAIL_USER` and `GMAIL_APP_PASSWORD` are optional; without the app password,
notification email is skipped.

Apply the schema only after checking which database `DATABASE_URL` identifies:

```sh
pnpm --filter @workspace/db push
```

Start the API in the first shell:

```sh
PORT=3001 pnpm --filter @workspace/api-server dev
```

Start the frontend in the second shell:

```sh
PORT=3000 pnpm --filter @workspace/activity-platform dev
```

Open `http://localhost:3000`. The Vite development server proxies `/api` and
`/sitemap.xml` to port 3001. Set `API_ORIGIN` to use another API address.
Chinese pages use `/`; English pages use `/en`.

**Existing startup behavior:** the API seeds an empty database, runs activity
patches, and attempts Stripe synchronization after it starts. A missing Stripe
connection is logged without stopping the API. Do not point this startup at an
existing database until those operations have been reviewed.

## Checks and builds

```sh
pnpm run typecheck
pnpm test
pnpm run build
```

Run typechecking from the repository root because packages use TypeScript project
references. The frontend build includes prerendering. Supply an isolated
`DATABASE_URL` for activity-specific prerendered pages; a build without a
database can omit that content.

To regenerate the checked-in API client and Zod schemas after OpenAPI edits:

```sh
pnpm --filter @workspace/api-spec run codegen
```

The API build is `artifacts/api-server/dist/index.mjs`; the frontend output is
`artifacts/activity-platform/dist/public`. The frontend production server is
`artifacts/activity-platform/server.mjs`. Production routing must send `/api`
requests to the API service. Preserve the existing Replit deployment while
reviewing this import; GitHub Pages cannot run this backend.

## Integrations and remaining production work

- **PostgreSQL:** source schemas and seed code are included, but live activity
  edits, enquiries, orders and settings remain in the existing Replit database.
  No database dump or migration is run by cloning this repository.
- **Storage:** retain the existing Replit object-storage configuration for
  uploaded objects. A Git clone does not copy that bucket. Public website media
  and directly imported images are included in the repository.
- **Stripe:** the current code obtains credentials through Replit's integration
  runtime and uses `stripe-replit-sync`. Those paths require Replit runtime
  configuration and cannot be validated by a Git clone alone. Do not copy
  runtime identity tokens into GitHub.
- **Email:** existing Gmail SMTP notification configuration stays on the host.
- **Administration:** the imported implementation uses a shared password.
  Replace it with appropriate authenticated sessions before broadening access.
- **Domain and SEO:** existing canonical redirects and SEO metadata refer to
  `www.juntarhk.com`. Do not switch the domain during the source-code import.

This is a curated source snapshot, not a transfer of the Replit project's Git
history or deployment settings. See `docs/import-status.md` for provenance and
verification evidence.
