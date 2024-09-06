import { Roster } from "../../../types/roster.ts";
import {
  calculatePointsForRoster,
  calculatePointsForUnit,
  calculatePointsForWarband,
} from "../../../utils/points.ts";
import {
  calculateRosterTotalBowCount,
  calculateRosterUnitCount,
  calculateWarbandModelCount,
  calculateWarbandTotalBowCount,
} from "../../../utils/unit-count.ts";
import {
  calculateAllianceLevel,
  calculateModelCount,
  getFactionList,
  getFactionSpecialRules,
  getFactionType,
  getUniqueModels,
  getWarningsForCreatedRoster,
  makeAllianceSpecificRosterAjustments,
} from "../calculations";

export const recalculate = (set) => {
  set(
    ({ roster }) => ({ ...updateFactionData(roster) }),
    undefined,
    "UPDATE_FACTION_DATA",
  );
  set(
    ({ roster, allianceLevel, factions }) => ({
      roster: makeAllianceSpecificRosterAjustments(
        factions,
        allianceLevel,
        roster,
      ),
    }),
    undefined,
    "ADJUST_MODELS_BASED_ON_SELECTION",
  );
  set(
    ({ roster }) => ({ ...updateFactionData(roster) }),
    undefined,
    "UPDATE_FACTION_DATA",
  );
  set(
    ({ roster }) => ({ roster: updateUnitCount(roster) }),
    undefined,
    "RECALCULATE_UNIT_COUNT",
  );
  set(
    ({ roster }) => ({ roster: recalculatePoints(roster) }),
    undefined,
    "RECALCULATE_POINTS",
  );
};

export const recalculatePoints = (roster: Roster): Roster => {
  return {
    ...roster,
    points: calculatePointsForRoster(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      points: calculatePointsForWarband(warband),
      hero: {
        ...warband.hero,
        ...calculatePointsForUnit(warband.hero),
      },
      units: warband.units.map((unit) => ({
        ...unit,
        ...calculatePointsForUnit(unit),
      })),
    })),
  };
};

export const updateUnitCount = (roster: Roster) => {
  return {
    ...roster,
    num_units: calculateRosterUnitCount(roster),
    bow_count: calculateRosterTotalBowCount(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      num_units: calculateWarbandModelCount(warband),
      max_units: warband.hero?.warband_size || 0, // TODO: Handle special cases
      bow_count: calculateWarbandTotalBowCount(warband),
    })),
  };
};

export const updateFactionData = (roster: Roster) => {
  const factionType = getFactionType(roster.warbands);
  const factionList = getFactionList(roster.warbands);
  const factionEnabledSpecialRules = getFactionSpecialRules(roster.warbands);
  const uniqueModels = getUniqueModels(roster.warbands);
  const { warnings, losesArmyBonus, newAllianceLevel } =
    getWarningsForCreatedRoster(
      factionList,
      calculateAllianceLevel(factionList, factionType),
      calculateModelCount(roster.warbands),
      uniqueModels,
    );
  const armyBonusActive =
    ["Historical", "Legendary Legion"].includes(newAllianceLevel) &&
    !losesArmyBonus;

  return {
    factionType: factionType,
    factions: factionList,
    factionEnabledSpecialRules: factionEnabledSpecialRules,
    uniqueModels: uniqueModels,
    allianceLevel: newAllianceLevel,
    rosterBuildingWarnings: warnings,
    armyBonusActive: armyBonusActive,
    factionMetaData: calculateModelCount(roster.warbands),
  };
};
