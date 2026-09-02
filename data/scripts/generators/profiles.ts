import type { OptionWorkbook } from "../loader/loadOptions";
import type { ProfileWorkbook } from "../loader/loadProfiles";
import {
  MagicalPowerRow,
  MagicPower,
  OptionEffect,
  OptionEffectRow,
  OptionRequirement,
  OptionRequirementRow,
  Profile,
  ProfileOption,
  ProfileRule,
  ProfileRuleRow, Stats,
} from "../types/profile";
import { groupBy } from "../utils/groupBy";
import { splitList } from "../utils/lists";

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

    const { profile, ...profileStats } = stats;

    return {
      profile: row.id,
      origin: row.origin,
      ...(row.points ? { points: Number(row.points) } : {}),
      ...(row.race ? { race: row.race } : {}),
      faction: splitList(row.faction),
      unitType: splitList(row.unit_type),
      ...(row.base_size ? { baseSize: Number(row.base_size) } : {}),
      selectable: row.selectable,
      source: {
        book: row.source_book,
        page: Number(row.source_page),
      },
      stats: profileStats,
      heroicActions: splitList(row.heroic_actions),
      specialRules: splitList(row.special_rules),
      wargear: splitList(row.wargear),
      additionalProfiles: splitList(row.additional_profiles),
      additionalText: splitList(row.additional_text),
      options: optionsByProfile.get(row.id) ?? [],
      profileRules: mapRules(rulesByProfile.get(row.id) ?? []),
      magicPowers: mapPowers(powersByProfile.get(row.id) ?? []),
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
