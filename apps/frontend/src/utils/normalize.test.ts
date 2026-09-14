import { describe, expect, test } from "vitest";

import { normalizeSearchText } from "./normalize.ts";

describe("normalize", () => {
  describe("normalizeSearchText", () => {
    test.each([
      ["Éowyn", "eowyn"],
      ["Théoden", "theoden"],
      ["Uruk-hai", "uruk hai"],
      ["Uruk-hai", "uruk hai"],
      ["Witch—King", "witch king"],
      ["  Minas   Tirith  ", "minas tirith"],
      ["Baruk Khazâd", "baruk khazad"],
    ])("normalizes %s to %s", (input, expected) => {
      expect(normalizeSearchText(input)).toBe(expected);
    });
  });
});
