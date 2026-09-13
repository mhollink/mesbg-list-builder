import type { Source } from "./common";

export interface WarriorStats {
  type: "warrior";

  mv: string;
  fv: string;
  sv: string;
  s: string;
  d: string;
  a: string;
  w: string;
  c: string;
  i: string;
}

export interface HeroStats extends Omit<WarriorStats, "type"> {
  type: "hero";

  might: string;
  will: string;
  fate: string;
}

export interface SiegeStats {
  type: "siege";

  range: string;
  s: string;
  d: string;
  w: string;
}

export type Stats = WarriorStats | HeroStats | SiegeStats;

export type ProfileRule = {
  id: string;
  type: string;
  option?: string;
};

export type RuleReference = {
  id: string;
  parameter?: string;
};

export type MagicPower = {
  id: string;
  range: string;
  cast: string;
  target?: string;
};

export interface ProfileOption {
  id: string;
  points: number;
  requirements: OptionRequirement[];
  effects: OptionEffect[];
}

export interface OptionRequirement {
  type: string;
  target: string;
  scope?: string;
  value?: string;
}

export interface OptionEffect {
  type: string;
  target: string;
  value?: string;
}

export type ProfileAlignment = "good" | "evil" | "both" | "siege-equipment";

export interface Profile {
  profile: string;
  origin: string;
  alignment: ProfileAlignment;
  points?: number;
  race: string[];
  factions: string[];
  unitTypes: string[];
  baseSize?: string;
  selectable: boolean;
  source: Source;
  stats: Stats;
  heroicActions?: string[];
  specialRules?: RuleReference[];
  wargear: string[];
  additionalProfiles?: string[];
  additionalText?: string[];
  options?: ProfileOption[];
  profileRules?: ProfileRule[];
  magicPowers?: MagicPower[];
}
