import type {
  RoadmapDeliverable,
  RoadmapFeature,
  RoadmapMilestone,
} from "./roadmap.data.ts";

export interface RoadmapProgress {
  completed: number;
  total: number;
  percentage: number;
}

export function getDeliverableProgress(
  deliverables: readonly RoadmapDeliverable[],
): RoadmapProgress {
  const completed = deliverables.filter(
    (item) => item.status === "done",
  ).length;
  const total = deliverables.length;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getMilestoneProgress(
  milestone: RoadmapMilestone,
): RoadmapProgress {
  return getDeliverableProgress(milestone.deliverables);
}

export function getFeatureProgress(feature: RoadmapFeature): RoadmapProgress {
  return getDeliverableProgress(
    feature.milestones.flatMap((milestone) => milestone.deliverables),
  );
}

export function getRoadmapProgress(
  features: readonly RoadmapFeature[],
): RoadmapProgress {
  return getDeliverableProgress(
    features.flatMap((feature) =>
      feature.milestones.flatMap((milestone) => milestone.deliverables),
    ),
  );
}
