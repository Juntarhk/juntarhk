# Source import

- Source project: https://replit.com/@thesophiaman/Juntarhk-school-hub
- Source revision: `e7a6a344eab4461787a0d79eb163a9d1695277c5`
- Target: https://github.com/Juntarhk/juntarhk
- Live hosting: unchanged on Replit

The import includes the activity-platform frontend, Express API, six shared
libraries, supporting scripts, 376 public files, and 13 uploads directly
referenced by source imports. Public files are compared by SHA-256 with the
source snapshot. Videos are stored with Git LFS.

Import-specific changes are limited to repository setup documentation, secret
ignore rules, Node/pnpm version declarations, a root test command, Git LFS
attributes, and local-development API proxying. Application product behavior is
otherwise preserved. Existing startup database mutations, shared-password admin
access, and Replit-dependent integrations are documented rather than silently
rewritten.

The existing Stripe utility script needed a response-type annotation to pass
TypeScript's `unknown` JSON response check. This is a type-only change matching
the API server's existing implementation.
The root TypeScript build also needed the existing `programmes-data` package in
its project references so a clean checkout generates its declarations before
checking the applications.

## Verification

- A clean `pnpm install --frozen-lockfile` passed.
- Root `pnpm run build` passed, including all TypeScript checks, API/frontend
  builds, and database-backed prerendering against a disposable local database.
- `pnpm test` passed all eight tests, including the database-backed idempotency
  test; no tests were skipped in that run.
- All 376 public files matched the source snapshot's SHA-256 hashes. All 13
  directly imported images are included.
- API checks passed for the seeded catalog, enquiry creation, authenticated
  enquiry listing, unauthenticated rejection, and test-record cleanup.
- A high-confidence hardcoded credential scan found no matching credentials in
  the imported source. This was not a comprehensive security audit.
- A fresh clone of the published GitHub branch, including `git lfs pull`,
  reproduced all 376 public files with matching SHA-256 hashes.
- Browser checks passed for Chinese-to-English navigation, the seeded catalog
  and category filter, a photography course detail, and opening/closing its
  enquiry modal without submission. A recording is attached to the pull request.
- The browser journey also exposed an existing AI programme-link mismatch,
  described below. The overall browser run was therefore not an all-pass run.

Production credentials and databases were not used. Real email delivery,
Stripe checkout/webhooks, and Replit bucket uploads were not exercised.
Existing large-bundle and missing decorative `/pattern.svg` build warnings are
preserved rather than addressed as part of the import.

## Existing source issue found during browser verification

The AI Thinking & Communication activity links through an App.tsx redirect to
`/programmes/ai-thinking-communication`, but the static `PROGRAMME_MAP` contains
the slug `ai-thinking-communication-course`. The imported development build
therefore displays "Programme not found" on that journey. Both affected source
files are byte-for-byte identical to the prototype snapshot; this is not an
import regression. The production site's current runtime outcome was not
tested.

This behavior is preserved for a separate product fix rather than silently
changing the approved source baseline. Some seeded English catalog content
also still contains Chinese labels or descriptions.

No GitHub CI checks were reported for the import branch, and no required status
checks were returned for the base branch when checked. Local results above
are not a claim that GitHub CI ran.
