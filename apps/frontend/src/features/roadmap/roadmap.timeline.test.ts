import { describe, expect, it } from "vitest";

import { roadmap, roadmapReleases } from "./roadmap.data.ts";
import { getRoadmapProgress } from "./roadmap.progress.ts";
import { createRoadmapTimeline } from "./roadmap.timeline.ts";

describe("roadmap release markers", () => {
  it("places the estimated v2.0 public release after Games and before Integrations", () => {
    const timeline = createRoadmapTimeline(roadmap, roadmapReleases);
    const ids = timeline.map((item) =>
      item.kind === "feature" ? item.feature.id : item.release.id,
    );
    const gamesIndex = ids.indexOf("games");

    expect(gamesIndex).toBeGreaterThanOrEqual(0);
    expect(ids.slice(gamesIndex, gamesIndex + 3)).toEqual([
      "games",
      "v2-public",
      "integrations",
    ]);
  });

  it("does not include release markers in progress totals", () => {
    const timeline = createRoadmapTimeline(roadmap, roadmapReleases);
    const features = timeline.flatMap((item) =>
      item.kind === "feature" ? [item.feature] : [],
    );

    expect(getRoadmapProgress(features)).toEqual(getRoadmapProgress(roadmap));
    expect(timeline.length).toBe(roadmap.length + roadmapReleases.length);
  });
});
