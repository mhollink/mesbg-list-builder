import type { OptionWorkbook } from "../loader/loadOptions";
import type { ProfileWorkbook } from "../loader/loadProfiles";
import type {
  MagicalPowerRow,
  MagicPower,
  OptionEffect,
  OptionEffectRow,
  OptionRequirement,
  OptionRequirementRow,
  Profile,
  ProfileOption,
  ProfileRule,
  ProfileRuleRow,
  RuleReference,
  Stats,
  StatsRow,
} from "../types/profile";
import { groupBy } from "../utils/groupBy";
import { optionalArray, splitList } from "../utils/lists";

export function generateProfiles(
  profileData: ProfileWorkbook,
  optionData: OptionWorkbook,
): Profile[] {
  const statsByProfile = new Map(
    profileData.stats.map((row) => [row.profile, row]),
  );

  const rulesByProfile = groupBy(
    profileData.profileRules,
    (row) => row.profile,
  );

  const powersByProfile = groupBy(
    profileData.magicalPowers,
    (row) => row.profile,
  );

  const optionsByProfile = buildOptions(optionData);

  return profileData.profiles.map((row) => {
    const stats = statsByProfile.get(row.id);

    if (!stats) {
      throw new Error(`Missing stats for profile '${row.id}'`);
    }

    return {
      profile: row.id,
      origin: row.origin,
      alignment: row.alignment,
      ...(row.points ? { points: Number(row.points) } : {}),
      race: splitList(row.race),
      factions: splitList(row.factions),
      unitTypes: splitList(row.unit_types),
      baseSize: row.base_size,
      selectable: row.selectable,
      source: {
        book: row.source_book,
        page: Number(row.source_page),
      },
      stats: mapStats(stats),
      wargear: splitList(row.wargear),
      ...optionalArray("heroicActions", splitList(row.heroic_actions)),
      ...optionalArray("specialRules", splitRuleReferences(row.special_rules)),
      ...optionalArray(
        "additionalProfiles",
        splitList(row.additional_profiles),
      ),
      ...optionalArray("additionalText", splitList(row.additional_text)),
      ...optionalArray("options", optionsByProfile.get(row.id) ?? []),
      ...optionalArray(
        "profileRules",
        mapRules(rulesByProfile.get(row.id) ?? []),
      ),
      ...optionalArray(
        "magicPowers",
        mapPowers(powersByProfile.get(row.id) ?? []),
      ),
    };
  });
}

function mapStats(row: StatsRow): Stats {
  if (row.range) {
    return {
      type: "siege",
      range: row.range,
      s: row.s,
      d: row.d,
      w: row.w,
    };
  }

  if (row.might || row.will || row.fate) {
    return {
      type: "hero",
      mv: row.mv,
      fv: row.fv,
      sv: row.sv,
      s: row.s,
      d: row.d,
      a: row.a,
      w: row.w,
      c: row.c,
      i: row.i,
      might: row.might,
      will: row.will,
      fate: row.fate,
    };
  }

  return {
    type: "warrior",
    mv: row.mv,
    fv: row.fv,
    sv: row.sv,
    s: row.s,
    d: row.d,
    a: row.a,
    w: row.w,
    c: row.c,
    i: row.i,
  };
}

export function splitRuleReferences(value?: string): RuleReference[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, parameter] = entry.split(":", 2);

      return {
        id,
        ...(parameter ? { parameter } : {}),
      };
    });
}

function mapPowers(magicalPowerRows: MagicalPowerRow[]): MagicPower[] {
  return magicalPowerRows.map(
    (row) =>
      ({
        id: row.power,
        cast: `${row.cast}+`,
        range: row.range,
        target: row.target,
      }) satisfies MagicPower,
  );
}

function mapRules(profileRuleRows: ProfileRuleRow[]): ProfileRule[] {
  return profileRuleRows.map(
    (row) =>
      ({
        id: row.rule,
        type: row.type,
        option: row.option_dependency,
      }) satisfies ProfileRule,
  );
}

function buildOptions(
  optionData: OptionWorkbook,
): Map<string, ProfileOption[]> {
  const requirementsByOption = groupOptionRows(optionData.requirements);
  const effectsByOption = groupOptionRows(optionData.effects);

  const optionsByProfile = new Map<string, ProfileOption[]>();

  for (const row of optionData.options) {
    const key = optionKey(row.profile, row.option);

    const option: ProfileOption = {
      id: row.option,
      points: row.cost,
      requirements: (requirementsByOption.get(key) ?? []).map(
        mapOptionRequirement,
      ),
      effects: (effectsByOption.get(key) ?? []).map(mapOptionEffect),
    };

    const profileOptions = optionsByProfile.get(row.profile);

    if (profileOptions) {
      profileOptions.push(option);
    } else {
      optionsByProfile.set(row.profile, [option]);
    }
  }

  return optionsByProfile;
}

function groupOptionRows<T extends { profile: string; option: string }>(
  rows: T[],
): Map<string, T[]> {
  const result = new Map<string, T[]>();

  for (const row of rows) {
    const key = optionKey(row.profile, row.option);
    const existing = result.get(key);

    if (existing) {
      existing.push(row);
    } else {
      result.set(key, [row]);
    }
  }

  return result;
}

function optionKey(profile: string, option: string): string {
  return `${profile}:${option}`;
}

function mapOptionRequirement(row: OptionRequirementRow): OptionRequirement {
  return {
    type: row.type,
    target: row.target,
    ...(row.scope ? { scope: row.scope } : {}),
    ...(row.value ? { value: row.value } : {}),
  };
}

function mapOptionEffect(row: OptionEffectRow): OptionEffect {
  return {
    type: row.type,
    target: row.target,
    ...(row.value ? { value: row.value } : {}),
  };
}
