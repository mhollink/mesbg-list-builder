export type Alignment = "good" | "evil";

export type ArmyListTier =
  | "hero-of-legend"
  | "hero-of-valour"
  | "hero-of-fortitude"
  | "minor-hero"
  | "independent-hero"
  | "warrior";

export interface Source {
  book: string;
  page: number;
}

export interface ArmyList {
  id: string;
  alignment: Alignment;

  profiles: ArmyListProfile[];
  warbands: ArmyListWarbandStructure;

  general?: ArmyListGeneralRule;
  requirements: ArmyListRequirement[];

  limits: ArmyListLimits;

  options: ArmyListOption[];

  specialRules: ArmyListRule[];
  additionalRules: ArmyListRule[];

  source: Source;
}

/**
 * The representation of a base Profile within a particular Army List.
 *
 * `profileId` links back to the canonical profile. Everything else here
 * represents configuration that applies only while using this Army List.
 */
export interface ArmyListProfile {
  id: string;
  profileId: string;
  tier: ArmyListTier;

  options: ArmyListProfileOption[];

  overrides?: ArmyListProfileOverrides;
}

/**
 * An option as it is presented within an Army List.
 *
 * The referenced canonical option determines the resulting wargear/effects.
 * The Army List may change how that option is presented or purchased.
 */
export interface ArmyListProfileOption {
  id: string;
  optionId: string;

  state: ArmyListProfileOptionState;

  /**
   * Translation key to use instead of the canonical option name.
   */
  nameKeyOverride?: string;

  /**
   * When omitted, use the canonical option cost.
   *
   * 0 explicitly means the option is free.
   */
  pointsOverride?: number;

  /**
   * The canonical option this replaces/upgrades.
   *
   * Example:
   * Snowmane -> Snowmane with armour
   */
  upgradeFrom?: string;
}

export type ArmyListProfileOptionState = "available" | "preselected";

export interface ArmyListProfileOverrides {
  addKeywords?: string[];
  removeKeywords?: string[];

  removeWargear?: string[];
}

export type ArmyListWarbandStructure =
  | {
      type: "standard";
      definitions: ArmyListWarbandDefinition[];
    }
  | {
      /**
       * All selected models are placed into one Warband.
       */
      type: "single";
    };

/**
 * Defines a legal kind of Warband within this Army List.
 *
 * leaderId and followerIds reference ArmyListProfile.id rather than
 * canonical Profile IDs.
 *
 * A missing leaderId represents a leaderless Warband.
 */
export interface ArmyListWarbandDefinition {
  id: string;

  leaderId?: string;
  followerIds: string[];

  minSize?: number;
  maxSize?: number;
}

/**
 * Defines how the Army's General is selected.
 */
export type ArmyListGeneralRule =
  | FixedGeneralRule
  | GeneralSelectorRule
  | PriorityGeneralRule;

/**
 * A specific ArmyListProfile must be the General.
 */
export interface FixedGeneralRule {
  type: "fixed";
  profileId: string;
}

/**
 * The General must match the given selector.
 */
export interface GeneralSelectorRule {
  type: "selector";
  selector: ArmyListProfileSelector;
}

/**
 * The first included profile in the ordered list must be the General.
 *
 * If none are included, normal General selection applies.
 *
 * Useful for rules such as:
 * Legolas -> Tauriel -> normal selection.
 */
export interface PriorityGeneralRule {
  type: "priority";
  profileIds: string[];
}

/**
 * Selects ArmyListProfiles using either explicit IDs or attributes from
 * their canonical Profile.
 *
 * Multiple values within one property are OR conditions.
 * Different populated properties are AND conditions.
 *
 * Example:
 * {
 *   factions: ["goblin"],
 *   unitTypes: ["hero", "unique"]
 * }
 */
export interface ArmyListProfileSelector {
  profileIds?: string[];

  races?: string[];
  factions?: string[];
  unitTypes?: string[];
}

export type ArmyListRequirement =
  | MinimumRequirement
  | MaximumRequirement
  | RequiresRequirement
  | ExcludesRequirement
  | RatioRequirement;

/**
 * At least `count` matching models must be present.
 */
export interface MinimumRequirement {
  id: string;
  type: "minimum";

  selector: ArmyListProfileSelector;
  count: number;
}

/**
 * At most `count` matching models may be present.
 */
export interface MaximumRequirement {
  id: string;
  type: "maximum";

  selector: ArmyListProfileSelector;
  count: number;
}

/**
 * If anything matching `selector` is included,
 * something matching `requires` must also be included.
 */
export interface RequiresRequirement {
  id: string;
  type: "requires";

  selector: ArmyListProfileSelector;
  requires: ArmyListProfileSelector;
}

/**
 * If anything matching `selector` is included,
 * nothing matching `excludes` may be included.
 */
export interface ExcludesRequirement {
  id: string;
  type: "excludes";

  selector: ArmyListProfileSelector;
  excludes: ArmyListProfileSelector;
}

/**
 * Limits the number of matching models relative to another group.
 *
 * Example:
 * Fledgeling Great Eagles <= Great Eagles:
 *
 * maxRatio: 1
 */
export interface RatioRequirement {
  id: string;
  type: "ratio";

  selector: ArmyListProfileSelector;
  relativeTo: ArmyListProfileSelector;

  maxRatio: number;
}

export interface ArmyListLimits {
  bow?: ArmyListLimit;
  throwingWeapons?: ArmyListLimit;

  /**
   * Reserved for lists which override the normal break point calculation.
   */
  breakPoint?: number;
}

export interface ArmyListLimit {
  limit: number;

  /**
   * Models matching this selector do not count towards the limit.
   */
  exclusions?: ArmyListProfileSelector;
}

/**
 * Purchasable option affecting the Army rather than a single Profile.
 */
export interface ArmyListOption {
  id: string;
  points: number;

  preselected?: boolean;
  nameKeyOverride?: string;
}

/**
 * Human-readable Army List rule.
 *
 * Machine-readable builder behaviour lives in the structured Army List
 * configuration rather than inside these rules.
 */
export interface ArmyListRule {
  id: string;
}
