import type { BuilderUnit } from "./roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export function getEffectiveUnitOptions(
  unit: BuilderUnit,
  profile: LocalizedArmyListProfile,
) {
  const selected = new Set(unit.optionIds);

  for (const option of profile.options) {
    if (option.state === "preselected") {
      selected.add(option.id);
    }
  }

  return profile.options.filter((option) => selected.has(option.id));
}

export function getUnitCost(
  unit: BuilderUnit,
  profile: LocalizedArmyListProfile,
): number {
  const base = profile.profile.points ?? 0;

  const options = getEffectiveUnitOptions(unit, profile).reduce(
    (total, option) => total + (option.points ?? 0),
    0,
  );

  return base + options;
}

export function getUnitTotalCost(
  unit: BuilderUnit,
  profile: LocalizedArmyListProfile,
): number {
  return getUnitCost(unit, profile) * unit.quantity;
}

export function isOptionSelected(unit: BuilderUnit, optionId: string): boolean {
  return unit.optionIds.includes(optionId);
}

export function isOptionLocked(
  profile: LocalizedArmyListProfile,
  optionId: string,
): boolean {
  return profile.options.some(
    (option) => option.id === optionId && option.state === "preselected",
  );
}
