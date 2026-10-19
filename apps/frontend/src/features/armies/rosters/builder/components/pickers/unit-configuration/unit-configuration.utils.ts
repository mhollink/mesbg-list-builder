import type { BuilderUnit } from "../../../domain/roster.types.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface UnitLoadout {
  optionIds: string[];
  quantity: number;
}

export interface WarriorDraftLoadout extends UnitLoadout {
  key: string;
  name: string;
}

export function normalizeOptionIds(
  profile: LocalizedArmyListProfile,
  optionIds: readonly string[],
): string[] {
  // Preselected equipment is included automatically by getUnitCost.
  const preselected = new Set(
    profile.options
      .filter((option) => option.state === "preselected")
      .map((option) => option.id),
  );

  return [...new Set(optionIds)].filter((id) => !preselected.has(id)).sort();
}

export function loadoutKey(optionIds: readonly string[]): string {
  return JSON.stringify([...new Set(optionIds)].sort());
}

export function createWarriorDrafts(
  profile: LocalizedArmyListProfile,
  existingUnits: readonly BuilderUnit[],
): WarriorDraftLoadout[] {
  const drafts = new Map<string, WarriorDraftLoadout>();
  const optionalOptions = profile.options
    .filter((option) => option.state !== "preselected")
    .sort((a, b) => (a.points ?? 0) - (b.points ?? 0));

  const addDraft = (
    optionIds: readonly string[],
    name: string,
    quantity = 0,
  ) => {
    const normalized = normalizeOptionIds(profile, optionIds);
    const key = loadoutKey(normalized);
    const current = drafts.get(key);

    if (current) {
      current.quantity += quantity;
      return;
    }

    drafts.set(key, {
      key,
      name,
      optionIds: normalized,
      quantity,
    });
  };

  const preselectedCount = profile.options.filter(
    (option) => option.state === "preselected",
  ).length;
  const minimumOptions = profile.profile.optionLimits?.min ?? 0;

  // An optionless warrior has exactly one available configuration.
  // If a regular option is mandatory, do not offer an empty loadout.
  if (optionalOptions.length === 0 || preselectedCount >= minimumOptions) {
    addDraft(
      [],
      optionalOptions.length === 0
        ? "Standard equipment"
        : "No additional equipment",
    );
  }

  // Simple one-option warrior configurations.
  // Existing multi-option/upgrade combinations are appended below.
  for (const option of optionalOptions) {
    addDraft([option.id], option.name);
  }

  for (const unit of existingUnits) {
    const optionIds = normalizeOptionIds(profile, unit.optionIds);
    const name =
      optionIds
        .map(
          (id) =>
            profile.options.find((option) => option.id === id)?.name ?? id,
        )
        .join(" + ") || "Standard equipment";

    addDraft(optionIds, name, unit.quantity);
  }

  return [...drafts.values()];
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
