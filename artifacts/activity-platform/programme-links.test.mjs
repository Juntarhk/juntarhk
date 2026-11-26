import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(new URL("./src/App.tsx", import.meta.url), "utf8");
const courseSource = await readFile(
  new URL("./src/pages/AiThinkingCommunication.tsx", import.meta.url),
  "utf8",
);
const programmeSource = await readFile(
  new URL("./src/data/programmes-data.ts", import.meta.url),
  "utf8",
);
const programmeSlugs = new Set(
  [...programmeSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]),
);
const expectedSlug = "ai-thinking-communication-course";

test("AI thinking activity redirects to its existing programme", () => {
  const destination = appSource.match(
    /function RedirectToAiThinkingProgramme\(\)[\s\S]*?setLocation\("([^"]+)"/,
  )?.[1];
  assert.equal(destination, `/programmes/${expectedSlug}`);
  assert.ok(programmeSlugs.has(expectedSlug));
});

test("AI thinking landing-page CTA links to its existing programme", () => {
  const slug = courseSource.match(/programmeSlug:\s*"([^"]+)"/)?.[1];
  assert.equal(slug, expectedSlug);
  assert.ok(programmeSlugs.has(slug));
});
