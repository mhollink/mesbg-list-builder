import type {
  BuilderUnitId,
  BuilderWarbandId,
} from "../domain/roster.types.ts";

export interface UpdateBuilderUnit {
  quantity?: number;
  optionIds?: string[];
}

export interface RosterPersistence {
  createWarband(): Promise<void>;

  deleteWarband(warbandId: BuilderWarbandId): Promise<void>;

  duplicateWarband(warbandId: BuilderWarbandId): Promise<void>;

  moveWarband(warbandId: BuilderWarbandId, position: number): Promise<void>;

  setLeader(
    warbandId: BuilderWarbandId,
    armyListProfileId: string,
    optionIds: string[],
  ): Promise<void>;

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
