import type { ArmyListsWorkbook } from "../schemas/army-lists";
import type {
  ArmyList,
  ArmyListGeneralRule,
  ArmyListLimit,
  ArmyListLimits,
  ArmyListOption,
  ArmyListProfile,
  ArmyListProfileOption,
  ArmyListProfileSelector,
  ArmyListRequirement,
  ArmyListRule,
  ArmyListWarbandDefinition,
  ArmyListWarbandStructure,
} from "../types/army-list";

export function generateArmyList(
  armyListsWorkbook: ArmyListsWorkbook,
): ArmyList[] {
  const profilesByArmy = groupBy(
    armyListsWorkbook.armyListProfiles,
    (row) => row.army_list,
  );

  const profileOptionsByArmyAndProfile = groupBy(
    armyListsWorkbook.profileOptions,
    (row) => compositeKey(row.army_list, row.profile),
  );

  const warbandsByArmy = groupBy(
    armyListsWorkbook.warbands,
    (row) => row.army_list,
  );

  const generalRulesByArmy = groupBy(
    armyListsWorkbook.generalRules,
    (row) => row.army_list,
  );

  const requirementsByArmy = groupBy(
    armyListsWorkbook.requirements,
    (row) => row.army_list,
  );

  const armyOptionsByArmy = groupBy(
    armyListsWorkbook.armyOptions,
    (row) => row.army_list,
  );

  const rulesByArmy = groupBy(armyListsWorkbook.rules, (row) => row.army_list);

  return armyListsWorkbook.armyLists.map((row) => {
    const profileRows = profilesByArmy.get(row.id) ?? [];
    const warbandRows = warbandsByArmy.get(row.id) ?? [];
    const generalRuleRows = generalRulesByArmy.get(row.id) ?? [];
    const requirementRows = requirementsByArmy.get(row.id) ?? [];
    const armyOptionRows = armyOptionsByArmy.get(row.id) ?? [];
    const ruleRows = rulesByArmy.get(row.id) ?? [];

    const general = mapGeneralRule(generalRuleRows, row.id);

    return {
      id: row.id,
      alignment: row.alignment,

      profiles: profileRows.map((profile) =>
        mapArmyListProfile(
          profile,
          profileOptionsByArmyAndProfile.get(
            compositeKey(row.id, profile.id),
          ) ?? [],
        ),
      ),

      warbands: mapWarbands(row, warbandRows),

      ...(general ? { general } : {}),

      requirements: requirementRows.map(mapRequirement),

      limits: mapLimits(row),

      options: armyOptionRows.map(mapArmyOption),

      specialRules: ruleRows
        .filter((rule) => rule.category === "special")
        .map(mapArmyListRule),

      additionalRules: ruleRows
        .filter((rule) => rule.category === "additional")
        .map(mapArmyListRule),

      source: {
        book: row.book,
        page: Number(row.page),
      },
    } satisfies ArmyList;
  });
}

type ArmyListRow = ArmyListsWorkbook["armyLists"][number];
type ArmyListProfileRow = ArmyListsWorkbook["armyListProfiles"][number];
type ProfileOptionRow = ArmyListsWorkbook["profileOptions"][number];
type WarbandRow = ArmyListsWorkbook["warbands"][number];
type GeneralRuleRow = ArmyListsWorkbook["generalRules"][number];
type RequirementRow = ArmyListsWorkbook["requirements"][number];
type ArmyOptionRow = ArmyListsWorkbook["armyOptions"][number];
type RuleRow = ArmyListsWorkbook["rules"][number];

function mapArmyListProfile(
  row: ArmyListProfileRow,
  optionRows: ProfileOptionRow[],
): ArmyListProfile {
  return {
    id: row.id,
    profileId: row.profile,
    tier: row.tier,
    options: optionRows.map(mapProfileOption),
  };
}

function mapProfileOption(row: ProfileOptionRow): ArmyListProfileOption {
  return {
    id: row.option,
    optionId: row.option,
    state: row.state,

    ...(row.points_override !== undefined
      ? { pointsOverride: row.points_override }
      : {}),
  };
}

function mapWarbands(
  armyList: ArmyListRow,
  rows: WarbandRow[],
): ArmyListWarbandStructure {
  switch (armyList.warband_mode) {
    case "single":
      return {
        type: "single",
      };

    case "standard":
      return {
        type: "standard",
        definitions: rows.map(mapWarbandDefinition),
      };

    case "choice":
      return {
        type: "choice",
        definitions: rows.map(mapWarbandDefinition),

        ...(armyList.single_warband_unit_types.length > 0
          ? {
              singleWarbandWhen: {
                unitTypes: armyList.single_warband_unit_types,
              },
            }
          : {}),
      };

    default:
      return assertNever(
        armyList.warband_mode,
        `Unsupported warband mode for army list "${armyList.id}"`,
      );
  }
}

function mapWarbandDefinition(row: WarbandRow): ArmyListWarbandDefinition {
  return {
    id: row.id,

    ...(row.leader ? { leaderId: row.leader } : {}),

    followerIds: row.followers,

    ...(row.max_size !== undefined ? { maxSize: row.max_size } : {}),
  };
}

function mapGeneralRule(
  rows: GeneralRuleRow[],
  armyListId: string,
): ArmyListGeneralRule | undefined {
  if (rows.length === 0) {
    return undefined;
  }

  if (rows.length > 1) {
    throw new Error(
      `Army list "${armyListId}" defines ${rows.length} general rules, but only one is supported.`,
    );
  }

  const row = rows[0];

  switch (row.type) {
    case "fixed":
      return {
        type: "fixed",
        profileId: requireNonEmptyString(
          row.profile,
          `General rule for army list "${armyListId}" requires a profile.`,
        ),
      };

    case "selector":
      return {
        type: "selector",
        selector: mapSelector({
          profiles: row.selector_profiles,
        }),
      };

    default:
      return assertNever(
        row.type,
        `Unsupported general rule type for army list "${armyListId}"`,
      );
  }
}

function mapRequirement(row: RequirementRow): ArmyListRequirement {
  const selector = mapSelector({
    profiles: row.selector_profiles,
    races: row.selector_races,
    factions: row.selector_factions,
    unitTypes: row.selector_unit_types,
  });

  const related = mapSelector({
    profiles: row.related_profiles,
    races: row.related_races,
    factions: row.related_factions,
    unitTypes: row.related_unit_types,
  });

  switch (row.type) {
    case "minimum":
      return {
        id: row.id,
        type: "minimum",
        selector,
        count: requireValue(
          row.count,
          `Requirement "${row.id}" requires count.`,
        ),
      };

    case "maximum":
      return {
        id: row.id,
        type: "maximum",
        selector,
        count: requireValue(
          row.count,
          `Requirement "${row.id}" requires count.`,
        ),
      };

    case "requires":
      return {
        id: row.id,
        type: "requires",
        selector,
        requires: related,
      };

    case "excludes":
      return {
        id: row.id,
        type: "excludes",
        selector,
        excludes: related,
      };

    case "ratio":
      return {
        id: row.id,
        type: "ratio",
        selector,
        relativeTo: related,
        maxRatio: requireValue(
          row.max_ratio,
          `Requirement "${row.id}" requires max_ratio.`,
        ),
      };

    default:
      return assertNever(
        row.type,
        `Unsupported requirement type for requirement "${row.id}"`,
      );
  }
}

interface RawSelector {
  profiles?: string[];
  races?: string[];
  factions?: string[];
  unitTypes?: string[];
}

function mapSelector(selector: RawSelector): ArmyListProfileSelector {
  const profileIds = selector.profiles ?? [];
  const races = selector.races ?? [];
  const factions = selector.factions ?? [];
  const unitTypes = selector.unitTypes ?? [];

  return {
    ...(profileIds.length > 0 ? { profileIds } : {}),
    ...(races.length > 0 ? { races } : {}),
    ...(factions.length > 0 ? { factions } : {}),
    ...(unitTypes.length > 0 ? { unitTypes } : {}),
  };
}

function mapLimits(row: ArmyListRow): ArmyListLimits {
  return {
    ...(row.bow_limit !== undefined ? { bow: mapLimit(row.bow_limit) } : {}),

    ...(row.throw_limit !== undefined
      ? { throwingWeapons: mapLimit(row.throw_limit) }
      : {}),

    ...(row.break_point !== undefined ? { breakPoint: row.break_point } : {}),
  };
}

function mapLimit(limit: number): ArmyListLimit {
  return { limit };
}

function mapArmyOption(row: ArmyOptionRow): ArmyListOption {
  return {
    id: row.id,
    points: row.points,
  };
}

function mapArmyListRule(row: RuleRow): ArmyListRule {
  return {
    id: row.id,
  };
}

function groupBy<T>(
  values: T[],
  keySelector: (value: T) => string,
): Map<string, T[]> {
  const result = new Map<string, T[]>();

  for (const value of values) {
    const key = keySelector(value);
    const existing = result.get(key);

    if (existing) {
      existing.push(value);
    } else {
      result.set(key, [value]);
    }
  }

  return result;
}

function compositeKey(...parts: string[]): string {
  return parts.join("\u0000");
}

function requireValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }

  return value;
}

function requireNonEmptyString(
  value: string | undefined,
  message: string,
): string {
  if (!value?.trim()) {
    throw new Error(message);
  }

  return value;
}

/**
 * Keeps switches exhaustive when their source fields are Zod enums / unions.
 *
 * If your current workbook schema still types these fields as plain strings,
 * change them to Zod enums so TypeScript can verify the switches exhaustively.
 */
function assertNever(value: never, message: string): never {
  throw new Error(`${message}: ${String(value)}`);
}
