import { describe, expect, it } from "vitest";

import { type SearchDocument, searchDocuments } from "./search.engine.ts";

const docs: SearchDocument[] = [
  {
    key: "1",
    category: "profiles",
    title: "Éomer",
    keywords: ["Rohan"],
    target: { type: "drawer", drawer: "profile", id: "eomer" },
  },
  {
    key: "2",
    category: "profiles",
    title: "Rohan Captain",
    keywords: ["eomer"],
    target: { type: "drawer", drawer: "profile", id: "captain" },
  },
  {
    key: "3",
    category: "rules",
    title: "Horse Lord",
    keywords: [],
    description: "Éomer is mentioned",
    target: { type: "drawer", drawer: "rule", id: "horse-lord" },
  },
];
describe("searchDocuments", () => {
  it("ranks accent-insensitive exact name matches first", () => {
    const response = searchDocuments(docs, {
      query: "eomer",
      normalizedQuery: "eomer",
      limit: 10,
    });
    expect(response.results.map((result) => result.key)).toEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("preserves total matches when limiting preview results", () => {
    const response = searchDocuments(docs, {
      query: "eomer",
      normalizedQuery: "eomer",
      limit: 1,
    });
    expect(response.total).toBe(3);
    expect(response.results).toHaveLength(1);
  });
  it("does not match an empty query", () => {
    expect(
      searchDocuments(docs, { query: "", normalizedQuery: "", limit: 10 })
        .total,
    ).toBe(0);
  });
});
