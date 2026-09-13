import type {
  LocalizedProfile,
  Source,
} from "~/features/reference/profiles/profiles.types.ts";

export type ArmyListAlignment = "good" | "evil";

export type ArmyListTier =
  | "hero-of-legend"
  | "hero-of-valour"
  | "hero-of-fortitude"
  | "minor-hero"
  | "independent-hero"
  | "warrior"
  | "siege-engine";

export type WarbandCapability = "leader" | "follower" | "standalone";

export type ArmyListProfileOptionState = "available" | "preselected";

export interface ArmyListProfileOption {
  id: string;
  optionId: string;
  state: ArmyListProfileOptionState;
  nameKeyOverride?: string;
  pointsOverride?: number;
  upgradeFrom?: string;
}

export interface ArmyListProfileOverrides {
  addKeywords?: string[];
  removeKeywords?: string[];
  removeWargear?: string[];
}

export interface ArmyListProfile {
  id: string;
  profileId: string;
  tier: ArmyListTier;
  warbandCapabilities?: WarbandCapability[];
  options: ArmyListProfileOption[];
  overrides?: ArmyListProfileOverrides;
}

export interface ArmyListWarbandDefinition {
  id: string;
  leaderId?: string;
  followerIds: string[];
  minSize?: number;
  maxSize?: number;
}

export type ArmyListWarbandStructure =
  | {
      type: "standard";
      definitions: ArmyListWarbandDefinition[];
    }
  | {
      type: "single";
    }
  | {
      type: "choice";
      definitions: ArmyListWarbandDefinition[];
      singleWarbandWhen?: ArmyListProfileSelector;
    };

export interface ArmyListProfileSelector {
  profileIds?: string[];
  races?: string[];
  factions?: string[];
  unitTypes?: string[];
}

export type ArmyListGeneralRule =
  | {
      type: "fixed";
      profileId: string;
    }
  | {
      type: "selector";
      selector: ArmyListProfileSelector;
    }
  | {
      type: "priority";
      profileIds: string[];
    };

export type ArmyListRequirement =
  | {
      id: string;
      type: "minimum";
      selector: ArmyListProfileSelector;
      count: number;
    }
  | {
      id: string;
      type: "maximum";
      selector: ArmyListProfileSelector;
      count: number;
    }
  | {
      id: string;
      type: "requires";
      selector: ArmyListProfileSelector;
      requires: ArmyListProfileSelector;
    }
  | {
      id: string;
      type: "excludes";
      selector: ArmyListProfileSelector;
      excludes: ArmyListProfileSelector;
    }
  | {
      id: string;
      type: "ratio";
      selector: ArmyListProfileSelector;
      relativeTo: ArmyListProfileSelector;
      maxRatio: number;
    };

export interface ArmyListLimit {
  limit: number;
  exclusions?: ArmyListProfileSelector;
}

export interface ArmyListLimits {
  bow?: ArmyListLimit;
  throwingWeapons?: ArmyListLimit;
  breakPoint?: number;
}

export interface ArmyListOption {
  id: string;
  points: number;
  preselected?: boolean;
  nameKeyOverride?: string;
}

export interface ArmyListRule {
  id: string;
}

export interface ArmyList {
  id: string;
  alignment: ArmyListAlignment;
  profiles: ArmyListProfile[];
  warbands: ArmyListWarbandStructure;
  general?: ArmyListGeneralRule;
  requirements?: ArmyListRequirement[];
  limits?: ArmyListLimits;
  options?: ArmyListOption[];
  specialRules: ArmyListRule[];
  additionalRules: ArmyListRule[];
  source: Source;
}

export interface LocalizedArmyListProfileOption extends ArmyListProfileOption {
  name: string;
  points?: number;
}

export interface LocalizedArmyListProfile
  extends Omit<ArmyListProfile, "options"> {
  profile: LocalizedProfile;
  tierName: string;
  options: LocalizedArmyListProfileOption[];
}

export interface LocalizedArmyListRule extends ArmyListRule {
  name: string;
  description: string;
}

export interface LocalizedArmyListOption extends ArmyListOption {
  name: string;
}

export interface LocalizedArmyList
  extends Omit<
    ArmyList,
    "profiles" | "specialRules" | "additionalRules" | "options"
  > {
  name: string;
  sourceName: string;
  profiles: LocalizedArmyListProfile[];
  specialRules: LocalizedArmyListRule[];
  additionalRules: LocalizedArmyListRule[];
  options?: LocalizedArmyListOption[];
}

export type ArmyListRow =
  | {
      key: string;
      type: "letter";
      letter: string;
    }
  | {
      key: string;
      type: "army-list";
      letter: string;
      armyList: LocalizedArmyList;
    };
