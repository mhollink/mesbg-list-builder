import type { RosterSummary } from "@mlb/api-client";

import {
  useFavoriteRosterMutation,
  useLockRosterMutation,
  useUnfavoriteRosterMutation,
  useUnlockRosterMutation,
} from "~/features/armies/rosters/api/roster-api.ts";

export function useRosterMetadata(roster: RosterSummary) {
  const [favoriteRoster, favorite] = useFavoriteRosterMutation();
  const [unfavoriteRoster, unfavorite] = useUnfavoriteRosterMutation();

  const [lockRoster, lock] = useLockRosterMutation();
  const [unlockRoster, unlock] = useUnlockRosterMutation();

  const onFavorite = () => {
    if (roster.favorite) {
      return unfavoriteRoster(roster.id);
    }

    return favoriteRoster(roster.id);
  };

  const onLock = () => {
    if (roster.locked) {
      return unlockRoster(roster.id);
    }

    return lockRoster(roster.id);
  };

  return {
    onFavorite,
    onLock,

    isFavoriteLoading: favorite.isLoading || unfavorite.isLoading,
    isLockLoading: lock.isLoading || unlock.isLoading,

    isError:
      favorite.isError || unfavorite.isError || lock.isError || unlock.isError,
  };
}
