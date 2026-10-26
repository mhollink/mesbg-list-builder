import type { SearchProvider } from "./search-provider.types.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";
import {
  type SearchDocument,
  searchDocuments,
} from "~/features/search/domain/search.engine.ts";

export function createArmyListProvider(
  lists: LocalizedArmyList[],
): SearchProvider {
  const documents: SearchDocument[] = lists.map((list) => ({
    key: `armies:${list.id}`,
    category: "armies",
    title: list.name,
    subtitle: list.sourceName,
    keywords: [
      list.sourceName,
      ...list.profiles.map(({ profile }) => profile.name),
      ...list.specialRules.map((rule) => rule.name),
      ...list.additionalRules.map((rule) => rule.name),
    ],
    target: {
      type: "route",
      path: `/reference/armylists/${list.id}`,
    },
  }));

  return {
    id: "armies",
    category: "armies",
    search: (request) => searchDocuments(documents, request),
  };
}
