import type { BuilderUnit } from "../../../domain/roster.types.ts";
import type { WarbandCapacity } from "../../../domain/warband-rules.ts";
import type {
  LocalizedArmyListProfile,
  LocalizedArmyListProfileOption,
} from "~/features/reference/army-lists/army-lists.types.ts";

/** One persisted roster entry, potentially representing multiple identical models. */
export interface UnitLoadout {
  optionIds: string[];
  quantity: number;
}

export function isSpecialUpgrade(
  option: LocalizedArmyListProfileOption,
): boolean {
  return option.category === "special-upgrade";
}

export function normalizeOptionIds(
  profile: LocalizedArmyListProfile,
  optionIds: readonly string[],
): string[] {
  // Preselected options are implicit when calculating points and displaying wargear.
  const preselected = new Set(
    profile.options
      .filter((option) => option.state === "preselected")
      .map((option) => option.id),
  );

  return [...new Set(optionIds)].filter((id) => !preselected.has(id)).sort();
}

/**
 * Warriors may choose one optional equipment option and one special upgrade.
 * Heroes retain support for multiple equipment selections; upgrades are still exclusive.
 * The preselected options remain implicit and cannot be toggled.
 */
export function toggleUnitOption(
  profile: LocalizedArmyListProfile,
  currentIds: readonly string[],
  optionId: string,
  checked: boolean,
): string[] {
  const option = profile.options.find((candidate) => candidate.id === optionId);
  if (!option || option.state === "preselected") {
    return normalizeOptionIds(profile, currentIds);
  }

  const isHero = profile.profile.stats.type === "hero";
  const exclusive = isSpecialUpgrade(option) || !isHero;
  // A compulsory upgrade cannot be replaced with an optional one.
  if (
    checked &&
    isSpecialUpgrade(option) &&
    profile.options.some(
      (candidate) =>
        candidate.id !== optionId &&
        candidate.state === "preselected" &&
        isSpecialUpgrade(candidate),
    )
  ) {
    return normalizeOptionIds(profile, currentIds);
  }
  const next = currentIds.filter((id) => {
    if (id === optionId) return false;
    if (!checked || !exclusive) return true;

    const other = profile.options.find((candidate) => candidate.id === id);
    return !other || isSpecialUpgrade(other) !== isSpecialUpgrade(option);
  });

  if (checked) next.push(optionId);
  return normalizeOptionIds(profile, next);
}

export function getEquipmentSelectionLimits(
  profile: LocalizedArmyListProfile,
  selectedIds: readonly string[],
) {
  const count = profile.options.filter(
    (option) =>
      !isSpecialUpgrade(option) &&
      (option.state === "preselected" || selectedIds.includes(option.id)),
  ).length;
  const minimum = profile.profile.optionLimits?.min ?? 0;
  const preselectedEquipment = profile.options.filter(
    (option) => !isSpecialUpgrade(option) && option.state === "preselected",
  ).length;
  const maximum =
    profile.profile.optionLimits?.max ??
    (profile.profile.stats.type === "hero"
      ? Number.POSITIVE_INFINITY
      : preselectedEquipment + 1);

  return {
    count,
    minimum,
    maximum,
    valid: count >= minimum && count <= maximum,
  };
}

export function getRemainingWarbandSlots(
  capacity: Pick<WarbandCapacity, "current" | "maximum"> | undefined,
  quantity: number,
  originalQuantity = 0,
): number | undefined {
  if (capacity?.maximum === undefined) {
    return undefined;
  }

  return capacity.maximum - (capacity.current - originalQuantity + quantity);
}

export function toDraftUnit(
  profile: LocalizedArmyListProfile,
  loadout: UnitLoadout,
): BuilderUnit {
  return {
    id: "configuration-preview",
    armyListProfileId: profile.id,
    optionIds: loadout.optionIds,
    quantity: loadout.quantity,
  };
}
