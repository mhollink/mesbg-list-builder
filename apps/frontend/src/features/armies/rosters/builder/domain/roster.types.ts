export type BuilderRosterId = number | "guest";
export type BuilderWarbandId = number | string;
export type BuilderUnitId = number | string;

export interface BuilderRoster {
  id: BuilderRosterId;

  name: string;
  armyListId: string;
  pointsLimit?: number;
  tags: string[];

  locked: boolean;

  armyOptionIds: string[];
  generalUnitId: BuilderUnitId | null;

  warbands: BuilderWarband[];
}

export interface BuilderWarband {
  id: BuilderWarbandId;

  leader: BuilderUnit | null;
  followers: BuilderUnit[];
}

export interface BuilderUnit {
  id: BuilderUnitId;

  profileId: string;
  quantity: number;
  optionIds: string[];
}
