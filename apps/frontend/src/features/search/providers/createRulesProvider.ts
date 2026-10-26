import type { SearchProvider } from "./search-provider.types";
import type { Rule } from "~/features/reference/rules/rules.types.ts";
import {
  type SearchDocument,
  searchDocuments,
} from "~/features/search/domain/search.engine.ts";

export function createRulesProvider(rules: Rule[]): SearchProvider {
  // Build normalized searchable documents.
  const documents: SearchDocument[] = rules.map((rule) => {
    return {
      key: `rules:${rule.id}`,
      category: "rules",
      title: rule.name,
      description: rule.description,
      subtitle: rule.type,
      keywords: [rule.category, rule.type ?? ""],
      target: {
        type: "drawer",
        drawer: "rule",
        id: rule.id,
      },
    };
  });

  return {
    id: "rules",
    category: "rules",

    search(request) {
      return searchDocuments(documents, request);
    },
  };
}
