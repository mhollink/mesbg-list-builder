import type {
  GuestRoster,
  GuestRosterUnit,
  GuestWarband,
} from "../../guest/guest-roster.types.ts";
import type {
  BuilderRoster,
  BuilderUnit,
  BuilderWarband,
} from "../domain/roster.types.ts";

export function mapGuestRoster(roster: GuestRoster): BuilderRoster {
  return {
    id: roster.id,
    name: roster.name,
    armyListId: roster.armyListId,
    pointsLimit: roster.pointsLimit,
    tags: [...(roster.tags ?? [])],

    locked: false,

    armyOptionIds: [...(roster.armyOptionIds ?? [])],
    generalUnitId: roster.generalUnitId ?? null,

    warbands: roster.warbands.map(mapGuestWarband),
  };
}

function mapGuestWarband(warband: GuestWarband): BuilderWarband {
  return {
    id: warband.id,

    leader: warband.leader ? mapGuestUnit(warband.leader) : null,

    followers: warband.followers.map(mapGuestUnit),
  };
}

function mapGuestUnit(unit: GuestRosterUnit): BuilderUnit {
  return {
    id: unit.id,
    profileId: unit.profileId,
    quantity: unit.quantity,
    optionIds: [...unit.optionIds],
  };
}
