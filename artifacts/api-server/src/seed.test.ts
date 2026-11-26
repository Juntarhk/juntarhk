/**
 * Tests for patchProgrammeTags — verifies that the shared PROGRAMME_TAGS
 * source drives DB updates and that a second run is a no-op.
 *
 * Unit tests (always run): validate the shared source structure.
 * Integration test (needs DATABASE_URL): idempotency check against a live DB.
 *
 * Run with:
 *   pnpm --filter @workspace/api-server test
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PROGRAMME_TAGS } from "@workspace/programmes-data";

describe("PROGRAMME_TAGS (shared source of truth)", () => {
  test("exports at least one tagged programme", () => {
    assert.ok(
      Object.keys(PROGRAMME_TAGS).length > 0,
      "PROGRAMME_TAGS should not be empty"
    );
  });

  test("every slug has a non-empty string-array of tags", () => {
    for (const [slug, tags] of Object.entries(PROGRAMME_TAGS)) {
      assert.ok(
        Array.isArray(tags) && tags.length > 0,
        `slug "${slug}" must have at least one tag`
      );
      for (const tag of tags) {
        assert.equal(
          typeof tag,
          "string",
          `tag in slug "${slug}" must be a string`
        );
        assert.ok(tag.length > 0, `tag in slug "${slug}" must not be empty`);
      }
    }
  });

  test("no duplicate tags within the same slug", () => {
    for (const [slug, tags] of Object.entries(PROGRAMME_TAGS)) {
      const unique = new Set(tags);
      assert.equal(
        unique.size,
        tags.length,
        `slug "${slug}" has duplicate tag values`
      );
    }
  });
});

// Integration: run patchProgrammeTags twice and confirm second call is a no-op.
// Skipped when DATABASE_URL is not available (e.g. pure unit-test environments).
const hasDb = typeof process.env["DATABASE_URL"] === "string" &&
  process.env["DATABASE_URL"].length > 0;

describe("patchProgrammeTags (integration — requires DATABASE_URL)", () => {
  test(
    "second run updates 0 rows (idempotent)",
    { skip: hasDb ? false : "DATABASE_URL not set — skipping integration test" },
    async () => {
      // First run: bring DB into sync (may update rows if they were out of date)
      const { patchProgrammeTags } = await import("./seed.js");
      await patchProgrammeTags();

      // Second run: must be a complete no-op
      const second = await patchProgrammeTags();
      assert.equal(second.updated, 0, "second run should update 0 rows");
      assert.equal(second.failed.length, 0, "second run should have no failures");
    }
  );
});
