import { describe, expect, it } from "vitest";

import { roadmap } from "./roadmap.data.ts";
import {
  getDeliverableProgress,
  getFeatureProgress,
  getMilestoneProgress,
  getRoadmapProgress,
} from "./roadmap.progress.ts";

describe("roadmap progress", () => {
  it("counts only completed deliverables", () => {
    expect(
      getDeliverableProgress([
        { id: "one", status: "done" },
        { id: "two", status: "inProgress" },
        { id: "three", status: "planned" },
      ]),
    ).toEqual({ completed: 1, total: 3, percentage: 33 });
  });

  it("handles an empty milestone without dividing by zero", () => {
    expect(getMilestoneProgress({ id: "empty", deliverables: [] })).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    });
  });

  it("rolls up milestone and feature progress from the same deliverables", () => {
    const feature = roadmap.find((item) => item.id === "building");
    expect(feature).toBeDefined();
    if (!feature) return;

    const sum = feature.milestones.map(getMilestoneProgress);
    const progress = getFeatureProgress(feature);
    expect(progress.completed).toBe(
      sum.reduce((count, current) => count + current.completed, 0),
    );
    expect(progress.total).toBe(
      sum.reduce((count, current) => count + current.total, 0),
    );
  });

  it("maintains distinct unique keys across all roadmap levels", () => {
    const keys = roadmap.flatMap((feature) => [
      feature.id,
      ...feature.milestones.flatMap((milestone) => [
        `${feature.id}.${milestone.id}`,
        ...milestone.deliverables.map(
          (deliverable) => `${feature.id}.${milestone.id}.${deliverable.id}`,
        ),
      ]),
    ]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("rolls up the entire roadmap, including future work", () => {
    const whole = getRoadmapProgress(roadmap);
    expect(whole.total).toBeGreaterThan(whole.completed);
    expect(whole.completed).toBeGreaterThan(0);
    expect(whole.completed).toBe(
      roadmap.reduce(
        (total, feature) => total + getFeatureProgress(feature).completed,
        0,
      ),
    );
  });
});
