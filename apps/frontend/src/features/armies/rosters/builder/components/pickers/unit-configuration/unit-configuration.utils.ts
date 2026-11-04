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

/** A selectable equipment/upgrade combination in the warrior editor. */
export interface WarriorDraftLoadout extends UnitLoadout {
  key: string;
  name: string;
  /** Null represents a regular warrior without a special upgrade. */
  upgradeId: string | null;
}

export function loadoutKey(optionIds: readonly string[]): string {
  return JSON.stringify([...new Set(optionIds)].sort());
}

/**
 * Builds one row per valid equipment choice and upgrade. Persisted combinations
 * are also kept, so a change to game data cannot silently remove roster units.
 */
export function createWarriorDrafts(
  profile: LocalizedArmyListProfile,
  existingUnits: readonly BuilderUnit[] = [],
): WarriorDraftLoadout[] {
  const drafts = new Map<string, WarriorDraftLoadout>();
  const equipment = profile.options
    .filter(
      (option) => !isSpecialUpgrade(option) && option.state === "available",
    )
    .sort((a, b) => (a.points ?? 0) - (b.points ?? 0));
  const upgrades = profile.options.filter(isSpecialUpgrade);
  const compulsoryUpgrade = upgrades.find(
    (option) => option.state === "preselected",
  );
  const upgradeChoices: (LocalizedArmyListProfileOption | undefined)[] =
    compulsoryUpgrade
      ? [compulsoryUpgrade]
      : [
          undefined,
          ...upgrades.filter((option) => option.state === "available"),
        ];

  const add = (ids: readonly string[], quantity = 0) => {
    const optionIds = normalizeOptionIds(profile, ids);
    const key = loadoutKey(optionIds);
    const present = drafts.get(key);
    if (present) {
      present.quantity += quantity;
      return;
    }

    const upgrade = upgrades.find(
      (option) =>
        option.state === "preselected" || optionIds.includes(option.id),
    );
    const equipmentNames = profile.options
      .filter(
        (option) => !isSpecialUpgrade(option) && optionIds.includes(option.id),
      )
      .map((option) => option.name);

    drafts.set(key, {
      key,
      optionIds,
      quantity,
      upgradeId: upgrade?.id ?? null,
      name: equipmentNames.join(" + ") || "No additional equipment",
    });
  };

  for (const upgrade of upgradeChoices) {
    for (const choice of [undefined, ...equipment]) {
      const ids = [upgrade?.id, choice?.id].filter(
        (id): id is string => id !== undefined,
      );
      if (getEquipmentSelectionLimits(profile, ids).valid) {
        add(ids);
      }
    }
  }

  // Existing entries may use a combination that is no longer generated.
  for (const unit of existingUnits) {
    if (unit.armyListProfileId === profile.id) {
      add(unit.optionIds, unit.quantity);
    }
  }

  const result = [...drafts.values()];
  if (
    result.length === 1 &&
    existingUnits.length === 0 &&
    equipment.length === 0 &&
    upgrades.length === 0
  ) {
    result[0].quantity = 1;
    result[0].name = "Standard equipment";
  }
  return result;
}
