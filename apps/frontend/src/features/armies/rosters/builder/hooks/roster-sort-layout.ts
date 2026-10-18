import type {
  BuilderUnitId,
  BuilderWarband,
  BuilderWarbandId,
} from "../domain/roster.types.ts";

export type RosterSortLayout = Record<string, string[]>;

export const warbandSortId = (id: BuilderWarbandId) => `warband:${id}`;

export const followerSortId = (id: BuilderUnitId) => `follower:${id}`;

export function createRosterSortLayout(
  warbands: BuilderWarband[],
): RosterSortLayout {
  return Object.fromEntries(
    warbands.map((warband) => [
      warbandSortId(warband.id),
      warband.followers.map((follower) => followerSortId(follower.id)),
    ]),
  );
}

export function applyRosterSortLayout(
  warbands: BuilderWarband[],
  layout: RosterSortLayout,
): BuilderWarband[] {
  const followersById = new Map(
    warbands.flatMap((warband) =>
      warband.followers.map(
        (follower) => [followerSortId(follower.id), follower] as const,
      ),
    ),
  );

  const positionedIds = new Set(Object.values(layout).flat());

  return warbands.map((warband) => {
    const ids =
      layout[warbandSortId(warband.id)] ??
      warband.followers.map((follower) => followerSortId(follower.id));

    const ordered = ids.flatMap((id) => {
      const follower = followersById.get(id);
      return follower ? [follower] : [];
    });

    // Include followers added by another roster mutation
    // while a drag or save was in progress.
    const added = warband.followers.filter(
      (follower) => !positionedIds.has(followerSortId(follower.id)),
    );

    return {
      ...warband,
      followers: [...ordered, ...added],
    };
  });
}

export function appendFollower(
  layout: RosterSortLayout,
  followerId: string,
  targetWarbandId: string,
): RosterSortLayout {
  if (!Object.hasOwn(layout, targetWarbandId)) {
    return layout;
  }

  const source = Object.entries(layout).find(([, followers]) =>
    followers.includes(followerId),
  );

  if (!source) {
    return layout;
  }

  const [sourceWarbandId] = source;

  const withoutFollower = layout[sourceWarbandId].filter(
    (id) => id !== followerId,
  );

  return {
    ...layout,
    [sourceWarbandId]: withoutFollower,
    [targetWarbandId]: [
      ...(sourceWarbandId === targetWarbandId
        ? withoutFollower
        : layout[targetWarbandId]),
      followerId,
    ],
  };
}

export function findFollowerPosition(
  layout: RosterSortLayout,
  followerId: string,
) {
  for (const [warbandId, followers] of Object.entries(layout)) {
    const index = followers.indexOf(followerId);

    if (index !== -1) {
      return { warbandId, index };
    }
  }

  return null;
}

export function sameRosterSortLayout(
  a: RosterSortLayout,
  b: RosterSortLayout,
): boolean {
  const keys = Object.keys(a);

  return (
    keys.length === Object.keys(b).length &&
    keys.every(
      (key) =>
        a[key].length === b[key]?.length &&
        a[key].every((id, index) => id === b[key][index]),
    )
  );
}
