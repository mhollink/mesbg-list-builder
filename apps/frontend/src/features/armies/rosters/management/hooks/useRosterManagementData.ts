import { useMemo } from "react";

import { useGetRostersQuery } from "~/features/armies/rosters/api/roster-api.ts";
import { useGetRosterGroupsQuery } from "~/features/armies/rosters/api/roster-group-api.ts";

export function useRosterManagementData() {
  const rostersQuery = useGetRostersQuery();

  const groupsQuery = useGetRosterGroupsQuery();

  const rosters = rostersQuery.data ?? [];

  const groups = groupsQuery.data ?? [];

  const tagSuggestions = useMemo(() => {
    const tags = new Map<string, string>();

    for (const roster of rosters) {
      for (const tag of roster.tags ?? []) {
        const normalized = tag.toLocaleLowerCase();

        if (!tags.has(normalized)) {
          tags.set(normalized, tag);
        }
      }
    }

    return [...tags.values()].sort((a, b) => a.localeCompare(b));
  }, [rosters]);

  return {
    rosters,
    groups,
    tagSuggestions,

    isLoading: rostersQuery.isLoading || groupsQuery.isLoading,

    isError: rostersQuery.isError || groupsQuery.isError,
  };
}
