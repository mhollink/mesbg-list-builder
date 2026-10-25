import type { RoadmapFeature, RoadmapRelease } from "./roadmap.data.ts";

export type RoadmapTimelineItem =
  | { kind: "feature"; feature: RoadmapFeature }
  | { kind: "release"; release: RoadmapRelease };

export function createRoadmapTimeline(
  features: readonly RoadmapFeature[],
  releases: readonly RoadmapRelease[],
): RoadmapTimelineItem[] {
  return features.flatMap((feature): RoadmapTimelineItem[] => {
    const followingReleases: RoadmapTimelineItem[] = releases
      .filter((release) => release.afterFeatureId === feature.id)
      .map((release) => ({ kind: "release", release }));

    return [{ kind: "feature", feature }, ...followingReleases];
  });
}
