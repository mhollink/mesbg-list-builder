import type {
  BuilderUnitId,
  BuilderWarbandId,
} from "../domain/roster.types.ts";

export interface UpdateBuilderUnit {
  quantity?: number;
  optionIds?: string[];
}

export interface RosterPersistence {
  /** Atomically replace the configurations of one profile in a warband. */
  replaceFollowerLoadouts(
    warbandId: BuilderWarbandId,
    armyListProfileId: string,
    loadouts: readonly { quantity: number; optionIds: string[] }[],
  ): Promise<void>;

  createWarband(leader: {
    armyListProfileId: string;
    optionIds: string[];
  }): Promise<void>;

  deleteWarband(warbandId: BuilderWarbandId): Promise<void>;

  duplicateWarband(warbandId: BuilderWarbandId): Promise<void>;

  moveWarband(warbandId: BuilderWarbandId, position: number): Promise<void>;

  addFollower(
    warbandId: BuilderWarbandId,
    armyListProfileId: string,
    quantity: number,
    optionIds: string[],
  ): Promise<void>;

  updateUnit(
    warbandId: BuilderWarbandId,
    unitId: BuilderUnitId,
    changes: UpdateBuilderUnit,
  ): Promise<void>;

  deleteUnit(warbandId: BuilderWarbandId, unitId: BuilderUnitId): Promise<void>;

  moveUnit(
    sourceWarbandId: BuilderWarbandId,
    unitId: BuilderUnitId,
    targetWarbandId: BuilderWarbandId,
    position: number,
  ): Promise<void>;

  setGeneral(unitId: BuilderUnitId): Promise<void>;

  clearGeneral(): Promise<void>;

  setArmyOptions(optionIds: string[]): Promise<void>;
}
