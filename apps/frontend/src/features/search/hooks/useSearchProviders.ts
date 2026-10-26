import { useCallback, useMemo } from "react";

import { createArmyListProvider } from "../providers/createArmyListProvider.ts";
import { createGuestRosterProvider } from "../providers/createGuestRosterProvider.ts";
import { createProfilesProvider } from "../providers/createProfilesProvider.ts";
import { createRostersProvider } from "../providers/createRostersProvider.ts";
import { createRulesProvider } from "../providers/createRulesProvider.ts";
import type { SearchProvider } from "../providers/search-provider.types.ts";
import { useAppSelector } from "~/app/store/hooks.ts";
import { keycloak } from "~/features/account/auth/keycloak.ts";
import { useLazyGetRostersQuery } from "~/features/armies/rosters/api/rosters-api.ts";
import { selectGuestRoster } from "~/features/armies/rosters/guest/guest-roster.selectors.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";
import { useGameProfiles } from "~/features/reference/profiles/hooks/useGameProfiles.ts";
import { useGameRules } from "~/features/reference/rules/hooks/useGameRules.ts";
export function useSearchProviders(): SearchProvider[] {
  const { profiles } = useGameProfiles();
  const { rules } = useGameRules();
  const { armyLists } = useGameArmyLists();
  const guestRoster = useAppSelector(selectGuestRoster);
  const [loadRosters] = useLazyGetRostersQuery();
  const fetchRosters = useCallback(
    () => loadRosters(undefined, true).unwrap(),
    [loadRosters],
  );
  const armyListNames = useMemo(
    () => new Map(armyLists.map((army) => [army.id, army.name])),
    [armyLists],
  );
  const profileProvider = useMemo(
    () => createProfilesProvider(profiles),
    [profiles],
  );
  const ruleProvider = useMemo(() => createRulesProvider(rules), [rules]);
  const armyProvider = useMemo(
    () => createArmyListProvider(armyLists),
    [armyLists],
  );
  const authenticated = Boolean(keycloak.authenticated);
  const rosterProvider = useMemo(
    () =>
      authenticated
        ? createRostersProvider(fetchRosters, armyListNames)
        : createGuestRosterProvider(() => guestRoster, armyListNames),
    [authenticated, fetchRosters, armyListNames, guestRoster],
  );
  return useMemo(
    () => [profileProvider, ruleProvider, armyProvider, rosterProvider],
    [profileProvider, ruleProvider, armyProvider, rosterProvider],
  );
}
