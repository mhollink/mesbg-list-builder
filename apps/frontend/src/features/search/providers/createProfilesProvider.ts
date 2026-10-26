import type { SearchProvider } from "./search-provider.types";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types";
import {
  type SearchDocument,
  searchDocuments,
} from "~/features/search/domain/search.engine.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";

export function createProfilesProvider(
  profiles: LocalizedProfile[],
): SearchProvider {
  // Build normalized searchable documents.
  const documents: SearchDocument[] = profiles.map((profile) => {
    return {
      key: `profiles:${profile.profile}`,
      category: "profiles",
      title: profile.name,
      description: "",
      subtitle: profile.originName,
      keywords: [
        profile.originName,
        ...profile.raceNames,
        ...profile.factionNames,
        ...profile.unitTypeNames,
        ...profile.wargearNames,
      ].map(normalizeSearchText),
      target: {
        type: "drawer",
        drawer: "profile",
        id: profile.profile,
      },
    };
  });

  return {
    id: "profiles",
    category: "profiles",

    search(request) {
      return searchDocuments(documents, request);
    },
  };
}
