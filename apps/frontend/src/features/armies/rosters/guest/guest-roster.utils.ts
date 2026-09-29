import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";
import type { CreateRosterValues } from "~/features/armies/rosters/management/hooks/useCreateRoster.ts";

export function createGuestRoster(values: CreateRosterValues): GuestRoster {
  return {
    id: "guest",
    name: values.name,
    armyListId: values.armyListId,
    pointsLimit: values.pointsLimit,
    tags: values.tags,
    armyOptionIds: [],
    generalUnitId: null,
    warbands: [],
    createdAt: "",
    updatedAt: "",
  };
}
