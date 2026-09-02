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

export type Source = { book: string; page: number };

export interface Profile {
  profile: string;
  origin: string;
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
