import type { RosterSummary } from "@mlb/api-client";

import type { SearchProvider } from "./search-provider.types.ts";
import {
  type SearchDocument,
  searchDocuments,
} from "~/features/search/domain/search.engine.ts";

export type LoadRosters = () => Promise<RosterSummary[]>;

export function createRostersProvider(
  loadRosters: LoadRosters,
  armyListNames: Map<string, string>,
): SearchProvider {
  return {
    id: "authenticated-rosters",
    category: "rosters",

    async search(request) {
      const rosters = await loadRosters();
      const documents: SearchDocument[] = rosters.map((roster) => {
        const armyName =
          armyListNames.get(roster.armyListId) ?? roster.armyListId;
        return {
          key: `rosters:${roster.id}`,
          category: "rosters",
          title: roster.name,
          subtitle: `${armyName} · ${roster.points} points`,
          keywords: [...(roster.tags ?? []), armyName],
          target: { type: "route", path: `/armies/rosters/${roster.id}` },
        };
      });

      return searchDocuments(documents, request);
    },
  };
}
