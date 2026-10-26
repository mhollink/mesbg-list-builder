import type { SEARCH_CATEGORIES } from "./search.constants";

export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];

export type SearchTarget =
  | {
      type: "drawer";
      drawer: "profile" | "rule";
      id: string;
    }
  | {
      type: "route";
      path: string;
    };

export interface SearchResult {
  key: string;
  category: SearchCategory;

  title: string;
  subtitle?: string;
  matchDescription?: string;

  score: number;

  target: SearchTarget;
}
