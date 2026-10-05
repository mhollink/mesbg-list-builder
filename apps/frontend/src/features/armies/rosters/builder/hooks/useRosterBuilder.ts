import { useCallback, useMemo } from "react";

import { useBuilderGameData } from "../data/useBuilderGameData.ts";
import {
  getAvailableFollowers as selectAvailableFollowers,
  getAvailableLeaders as selectAvailableLeaders,
} from "../domain/profile-selection.ts";
import type { BuilderRoster, BuilderWarband } from "../domain/roster.types.ts";
import {
  type BuilderRosterStatistics,
  calculateRosterStatistics,
} from "../domain/roster-statistics.ts";
import {
  canAddWarband as selectCanAddWarband,
  getWarbandCapacity as selectWarbandCapacity,
  type WarbandCapacity,
} from "../domain/warband-rules.ts";
import type { RosterPersistence } from "../persistence/roster-persistence.types.ts";
import type { BuilderGameData } from "~/features/armies/rosters/builder/data/builder-game-data.types.ts";
import {
  type RosterValidationIssue,
  validateRoster,
} from "~/features/armies/rosters/builder/domain/roster-validation.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface RosterBuilderModel {
  roster: BuilderRoster;
  gameData?: BuilderGameData;
  statistics?: BuilderRosterStatistics;
  issues?: RosterValidationIssue[];

  readonly: boolean;
  canAddWarband: boolean;

  actions: RosterPersistence;

  getAvailableLeaders(warband?: BuilderWarband): LocalizedArmyListProfile[];

  getAvailableFollowers(warband: BuilderWarband): LocalizedArmyListProfile[];

  getWarbandCapacity(warband: BuilderWarband): WarbandCapacity;
}

export function useRosterBuilder(
  roster: BuilderRoster,
  persistence: RosterPersistence,
): RosterBuilderModel {
  const gameData = useBuilderGameData(roster.armyListId);

  const statistics = useMemo(() => {
    if (!gameData) {
      return undefined;
    }

    return calculateRosterStatistics(roster, gameData);
  }, [roster, gameData]);

  const issues = useMemo(() => {
    if (!gameData || !statistics) {
      return [];
    }

    return validateRoster(roster, gameData, statistics);
  }, [roster, gameData, statistics]);

  const canAddWarband = useMemo(() => {
    if (!gameData) {
      return false;
    }

    return selectCanAddWarband(roster, gameData);
  }, [roster, gameData]);

  const getAvailableLeaders = useCallback(
    (warband?: BuilderWarband) => {
      if (!gameData) {
        return [];
      }

      return selectAvailableLeaders(roster, gameData, {
        ignoreUnitId: warband?.leader?.id,
      });
    },
    [roster, gameData],
  );

  const getAvailableFollowers = useCallback(
    (warband: BuilderWarband) => {
      if (!gameData) {
        return [];
      }

      return selectAvailableFollowers(roster, warband, gameData);
    },
    [roster, gameData],
  );

  const getWarbandCapacity = useCallback(
    (warband: BuilderWarband): WarbandCapacity => {
      if (!gameData) {
        return {
          current: 0,
          belowMinimum: false,
          overMaximum: false,
        };
      }

      return selectWarbandCapacity(warband, gameData);
    },
    [gameData],
  );

  return {
    roster,
    gameData,
    statistics,
    issues,

    readonly: roster.locked,
    canAddWarband,

    actions: persistence,

    getAvailableLeaders,
    getAvailableFollowers,
    getWarbandCapacity,
  };
}
