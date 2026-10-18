import type {
  BuilderUnitId,
  BuilderWarband,
  BuilderWarbandId,
} from "../domain/roster.types.ts";

export interface RosterSortLayout {
  order: string[];
  followers: Record<string, string[]>;
}

export const warbandSortId = (id: BuilderWarbandId) => `warband:${id}`;

export const followerSortId = (id: BuilderUnitId) => `follower:${id}`;

export function createRosterSortLayout(
  warbands: BuilderWarband[],
): RosterSortLayout {
  return {
    order: warbands.map((warband) => warbandSortId(warband.id)),
    followers: Object.fromEntries(
      warbands.map((warband) => [
        warbandSortId(warband.id),
        warband.followers.map((follower) => followerSortId(follower.id)),
      ]),
    ),
  };
}

export function applyRosterSortLayout(
  warbands: BuilderWarband[],
  layout: RosterSortLayout,
): BuilderWarband[] {
  const warbandsById = new Map(
    warbands.map((warband) => [warbandSortId(warband.id), warband]),
  );

  const followersById = new Map(
    warbands.flatMap((warband) =>
      warband.followers.map(
        (follower) => [followerSortId(follower.id), follower] as const,
      ),
    ),
  );

  return layout.order.flatMap((warbandId) => {
    const warband = warbandsById.get(warbandId);

    if (!warband) {
      return [];
    }

    return [
      {
        ...warband,
        followers: (layout.followers[warbandId] ?? []).flatMap((followerId) => {
          const follower = followersById.get(followerId);
          return follower ? [follower] : [];
        }),
      },
    ];
  });
}
