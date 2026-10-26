import { describe, expect, it } from "vitest";

import { searchPageUrl } from "./useSearchNavigation.ts";

describe("searchPageUrl", () => {
  it("encodes the query without a category", () => {
    expect(searchPageUrl("Éomer & Théoden")).toBe(
      "/search?q=%C3%89omer+%26+Th%C3%A9oden",
    );
  });

  it("includes the optional category", () => {
    expect(searchPageUrl("eomer", "rules")).toBe("/search?q=eomer&c=rules");
  });
});
