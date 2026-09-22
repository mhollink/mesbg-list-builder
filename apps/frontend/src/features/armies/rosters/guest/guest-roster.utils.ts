import type {
  GuestRoster,
  GuestRosterStats,
  GuestRosterUnit,
} from "~/features/armies/rosters/guest/guest-roster.types.ts";
import type { CreateRosterValues } from "~/features/armies/rosters/management/hooks/useCreateRoster.ts";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

export function createGuestRoster(values: CreateRosterValues): GuestRoster {
  return {
    id: "guest",
    name: values.name,
    armyListId: values.armyListId,
    pointsLimit: values.pointsLimit,
    tags: values.tags,
    warbands: [],
    createdAt: "",
    updatedAt: "",
  };
}

export function calculateGuestRosterStats(
  roster: GuestRoster,
  profiles: Map<string, LocalizedProfile>,
): GuestRosterStats {
  const stats: GuestRosterStats = {
    points: 0,
    modelCount: 0,
    warbandCount: roster.warbands.length,
    might: 0,
    bowCount: 0,
    throwingWeaponCount: 0,
  };

  for (const warband of roster.warbands) {
    addUnitStats(stats, warband.leader, profiles);

    for (const follower of warband.followers) {
      addUnitStats(stats, follower, profiles);
    }
  }

  return stats;
}

function addUnitStats(
  stats: GuestRosterStats,
  unit: GuestRosterUnit,
  profiles: Map<string, LocalizedProfile>,
) {
  const profile = profiles.get(unit.profileId);

  if (!profile) {
    return;
  }

  const quantity = unit.quantity;

  stats.modelCount += quantity;
  stats.points += (profile.points ?? 0) * quantity;

  if (profile.stats.type === "hero") {
    const might = Number(profile.stats.might);
    stats.might += (might ?? 0) * quantity;
  }

  // todo: Add bow / throwing weapon / selected option calculations here.
}
