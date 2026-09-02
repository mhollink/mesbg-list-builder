import type { z } from "zod";

import type {
  optionEffectRowSchema,
  optionRequirementRowSchema,
  optionRowSchema,
  profileMagicPowerRowSchema,
  profileRowSchema,
  profileRuleRowSchema,
  profileStatsRowSchema,
} from "../schemas";

export type ProfileRow = z.infer<typeof profileRowSchema>;
export type StatsRow = z.infer<typeof profileStatsRowSchema>;
export type ProfileRuleRow = z.infer<typeof profileRuleRowSchema>;
export type MagicalPowerRow = z.infer<typeof profileMagicPowerRowSchema>;
export type OptionRow = z.infer<typeof optionRowSchema>;
export type OptionRequirementRow = z.infer<typeof optionRequirementRowSchema>;
export type OptionEffectRow = z.infer<typeof optionEffectRowSchema>;

export interface Stats {
  mv: string;
  fv: string;
  sv: string;
  s: string;
  d: string;
  a: string;
  w: string;
  c: string;
  i: string;

  might?: string | undefined;
  will?: string | undefined;
  fate?: string | undefined;

  range?: string | undefined;
}

export type ProfileRule = {
  id: string;
  type: string;
  option?: string;
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

export type ProfileAlignment = "good" | "evil" | "siege-equipment";

export type Source = { book: string; page: number };

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
  specialRules?: string[];
  wargear: string[];
  additionalProfiles?: string[];
  additionalText?: string[];
  options?: ProfileOption[];
  profileRules?: ProfileRule[];
  magicPowers?: MagicPower[];
}
