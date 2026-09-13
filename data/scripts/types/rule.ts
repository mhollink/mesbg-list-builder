import type { Source } from "./common";

export type SpecialRuleType = "active" | "passive";
export type SpecialRule = {
  id: string;
  category: "special-rule";
  type: SpecialRuleType;
  source: Source;
};

export type MagicalPowerType = "exhaustion" | "instant" | "temporary";
export type MagicalPower = {
  id: string;
  category: "magical-power";
  type: MagicalPowerType;
  source: Source;
};

export type HeroicPhase = "move-phase" | "shoot-phase" | "fight-phase";
export type HeroicAction = {
  id: string;
  category: "heroic-action";
  type: HeroicPhase;
  source: Source;
};

export type BrutalPowerAttack = {
  id: string;
  category: "brutal-power-attack";
  source: Source;
};

export type Equipment = {
  id: string;
  category: "equipment" | "siege-equipment";
  source: Source;
};

export type Rule =
  | SpecialRule
  | MagicalPower
  | HeroicAction
  | BrutalPowerAttack
  | Equipment;
