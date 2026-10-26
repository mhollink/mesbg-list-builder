import type { SearchProvider } from "./search-provider.types.ts";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";
import {
  type SearchDocument,
  searchDocuments,
} from "~/features/search/domain/search.engine.ts";

export type GetRoster = () => GuestRoster | null;

export function createGuestRosterProvider(
  getRoster: GetRoster,
  armyListNames: Map<string, string>,
): SearchProvider {
  return {
    id: "guest-rosters",
    category: "rosters",

    search(request) {
      const roster = getRoster();
      if (!roster) return { results: [], total: 0 };

      const armyName =
        armyListNames.get(roster.armyListId) ?? roster.armyListId;
      const documents: SearchDocument[] = [
        {
          key: "rosters:guest",
          category: "rosters",
          title: roster.name,
          subtitle: armyName,
          keywords: [...(roster.tags ?? []), armyName],
          target: { type: "route", path: "/armies/rosters/guest" },
        },
      ];

      return searchDocuments(documents, request);
    },
  };
}
