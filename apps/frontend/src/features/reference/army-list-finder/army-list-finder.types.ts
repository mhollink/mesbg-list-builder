import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";

export interface ArmyListMatch {
  armyList: LocalizedArmyList;
  matchedProfileIds: string[];
  missingProfileIds: string[];
  matchCount: number;
  exactMatch: boolean;
}
