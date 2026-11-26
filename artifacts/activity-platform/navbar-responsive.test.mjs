import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navbarSource = await readFile(
  new URL("./src/components/layout/Navbar.tsx", import.meta.url),
  "utf8",
);
const translationsSource = await readFile(
  new URL("./src/i18n/translations.ts", import.meta.url),
  "utf8",
);

const expectedLinks = [
  ["/", "home"],
  ["/photography", "photography"],
  ["/ai-education", "aiEducation"],
  ["/activities", "activities"],
  ["/case-studies", "caseStudies"],
  ["/corporate-team-building", "corporateTeamBuilding"],
  ["/about", "about"],
  ["/contact", "contact"],
];

test("mobile menu keeps every navigation entry in the required order", () => {
  let previousIndex = -1;

  for (const [href, translationKey] of expectedLinks) {
    const entry = `{ href: "${href}", label: t.nav.${translationKey} }`;
    const index = navbarSource.indexOf(entry);
    assert.ok(index > previousIndex, `Missing or out-of-order navigation entry: ${href}`);
    previousIndex = index;
  }

  assert.match(navbarSource, /\{NAV_LINKS\.map\(\(link\) => \{/g);
  assert.match(navbarSource, /data-testid="nav-mobile"/);
});

test("Chinese and English provide labels for every navigation entry", () => {
  for (const [, translationKey] of expectedLinks) {
    const occurrences = translationsSource.match(
      new RegExp(`^\\s+${translationKey}:\\s*"[^"]+",?$`, "gm"),
    );
    assert.equal(
      occurrences?.length,
      2,
      `Expected Chinese and English labels for nav.${translationKey}`,
    );
  }
});

test("responsive visibility is safe at mobile, narrow desktop, and wide desktop widths", () => {
  assert.match(navbarSource, /data-testid="nav-desktop"[\s\S]*?hidden 2xl:flex/);
  assert.match(navbarSource, /data-testid="button-language-desktop"[\s\S]*?hidden 2xl:flex/);
  assert.match(navbarSource, /className="hidden 2xl:flex rounded-full[\s\S]*?data-testid="link-navbar-enquire"/);
  assert.match(navbarSource, /data-testid="button-open-mobile-menu"[\s\S]*?2xl:hidden/);
  assert.match(navbarSource, /data-testid="nav-mobile"[\s\S]*?2xl:hidden/);
});

test("wide desktop navigation cannot wrap and fixed controls cannot shrink", () => {
  assert.match(navbarSource, /data-testid=\{`link-desktop-nav-[\s\S]*?whitespace-nowrap/);
  assert.match(navbarSource, /className="flex shrink-0 items-center group"/);
  assert.match(navbarSource, /className="flex shrink-0 items-center gap-2"/);
  assert.match(navbarSource, /link-navbar-enquire[\s\S]*?\{t\.nav\.enquire\}/);
});