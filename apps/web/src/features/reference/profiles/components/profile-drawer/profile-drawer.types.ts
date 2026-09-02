import type { LocalizedProfile } from "../../profiles.types";

export interface ProfileDrawerRuleLink {
  id: string;
  name: string;
}

export interface ProfileDrawerRule {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface ProfileDrawerMagicPower {
  id: string;
  name: string;
  range: string;
  cast: string;
  target?: string;
}

export interface ProfileDrawerOption {
  id: string;
  name: string;
  points: number;
}

export interface ProfileDrawerRelatedProfile {
  id: string;
  name: string;
}

export interface ProfileDrawerContent {
  profile: LocalizedProfile;

  races: string[];
  factions: string[];
  unitTypes: string[];
  wargear: string[];

  heroicActions: ProfileDrawerRuleLink[];
  specialRules: ProfileDrawerRuleLink[];
  profileRules: ProfileDrawerRule[];
  magicalPowers: ProfileDrawerMagicPower[];
  options: ProfileDrawerOption[];
  additionalProfiles: ProfileDrawerRelatedProfile[];
}
