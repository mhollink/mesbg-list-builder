import { describe, expect, test } from "vitest";

import { stripHtml } from "./stripHtml.ts";

describe("normalize", () => {
  describe("normalizeSearchText", () => {
    test.each([
      [
        "<p><strong>Éomer</strong> may reroll failed &quot;To Hit&quot; rolls.</p>",
        `Éomer may reroll failed "To Hit" rolls.`,
      ],
      [
        "<p>May declare a <rule id='heroic-march'>Heroic March</rule> for free</p>",
        `May declare a Heroic March for free`,
      ],
    ])("normalizes %s to %s", (input, expected) => {
      expect(stripHtml(input)).toBe(expected);
    });
  });
});
