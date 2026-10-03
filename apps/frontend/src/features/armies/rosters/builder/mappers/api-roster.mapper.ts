import type { Roster, RosterUnit, Warband } from "@mlb/api-client";

import type {
  BuilderRoster,
  BuilderUnit,
  BuilderWarband,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";

export function mapApiRoster(roster: Roster): BuilderRoster {
  return {
    id: roster.id,
    name: roster.name,
    armyListId: roster.armyListId,
    pointsLimit: roster.pointsLimit,
    tags: roster.tags,
    locked: roster.locked,
    armyOptionIds: [...roster.armyOptionIds],
    generalUnitId: roster.generalUnitId,
    warbands: roster.warbands.map(mapWarband),
  };
}

function mapWarband(warband: Warband): BuilderWarband {
  return {
    id: warband.id,
    leader: warband.leader ? mapRosterUnit(warband.leader) : null,
    followers: warband.followers.map(mapRosterUnit),
  };
}

function mapRosterUnit(unit: RosterUnit): BuilderUnit {
  return {
    id: unit.id,
    armyListProfileId: unit.armyListProfileId,
    optionIds: [...unit.optionIds],
    quantity: unit.quantity,
  };
}
