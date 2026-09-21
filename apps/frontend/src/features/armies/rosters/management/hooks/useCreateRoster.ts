import { selectGuestRoster } from "../../guest/guest-roster.selectors";
import { useAppDispatch, useAppSelector } from "~/app/store/hooks.ts";
import { keycloak } from "~/features/account/auth/keycloak.ts";
import { useCreateRosterMutation } from "~/features/armies/rosters/api/roster-api.ts";
import { replaceGuestRoster } from "~/features/armies/rosters/guest/guest-roster.slice.ts";
import { createGuestRoster } from "~/features/armies/rosters/guest/guest-roster.utils.ts";

export type CreateRosterValues = {
  name: string;
  armyListId: string;
  pointsLimit?: number | null;
  tags?: string[];
  groupId?: number;
};

interface CreateRosterOptions {
  replaceGuestRoster?: boolean;
}

export class GuestRosterAlreadyExistsError extends Error {
  constructor() {
    super("A guest roster already exists.");
    this.name = "GuestRosterAlreadyExistsError";
  }
}

export function useCreateRoster() {
  const dispatch = useAppDispatch();
  const guestRoster = useAppSelector(selectGuestRoster);

  const [createAccountRoster, accountMutation] = useCreateRosterMutation();

  const createRoster = async (
    values: CreateRosterValues,
    options: CreateRosterOptions = {},
  ): Promise<string> => {
    if (keycloak.authenticated) {
      const roster = await createAccountRoster({
        name: values.name,
        armyListId: values.armyListId,
        pointsLimit: values.pointsLimit,
        tags: values.tags,
        groupId: values.groupId,
      }).unwrap();

      return `/armies/rosters/${roster.id}`;
    }

    if (guestRoster && !options.replaceGuestRoster) {
      throw new GuestRosterAlreadyExistsError();
    }

    dispatch(replaceGuestRoster(createGuestRoster(values)));

    return "/armies/rosters/guest";
  };

  return {
    createRoster,
    isLoading: accountMutation.isLoading,
    isError: accountMutation.isError,
  };
}
