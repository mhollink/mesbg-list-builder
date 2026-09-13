import type {
  ArmyListTier,
  LocalizedArmyListProfile,
} from "./army-lists.types.ts";

export interface ArmyListTierGroup {
  tier: ArmyListTier;
  profiles: LocalizedArmyListProfile[];
  weight: number;
}

const TIER_ORDER: ArmyListTier[] = [
  "hero-of-legend",
  "hero-of-valour",
  "hero-of-fortitude",
  "minor-hero",
  "independent-hero",
  "warrior",
  "siege-engine",
];

export function createTierGroups(
  profiles: LocalizedArmyListProfile[],
): ArmyListTierGroup[] {
  return TIER_ORDER.flatMap((tier) => {
    const tierProfiles = profiles.filter((profile) => profile.tier === tier);

    if (tierProfiles.length === 0) {
      return [];
    }

    return [
      {
        tier,
        profiles: tierProfiles,
        weight: getTierWeight(tierProfiles),
      },
    ];
  });
}

export function splitTierGroups(groups: ArmyListTierGroup[]): {
  left: ArmyListTierGroup[];
  right: ArmyListTierGroup[];
} {
  if (groups.length <= 1) {
    return {
      left: groups,
      right: [],
    };
  }

  const totalWeight = groups.reduce((total, group) => total + group.weight, 0);

  let leftWeight = 0;
  let bestSplitIndex = 1;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < groups.length; index++) {
    leftWeight += groups[index - 1].weight;

    const rightWeight = totalWeight - leftWeight;
    const difference = Math.abs(leftWeight - rightWeight);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestSplitIndex = index;
    }
  }

  return {
    left: groups.slice(0, bestSplitIndex),
    right: groups.slice(bestSplitIndex),
  };
}

function getTierWeight(profiles: LocalizedArmyListProfile[]): number {
  const headingWeight = 2;

  const profilesWeight = profiles.reduce((total, profile) => {
    const includedOptions = profile.options.filter(
      (option) => option.state === "preselected",
    );

    const availableOptions = profile.options.filter(
      (option) => option.state === "available",
    );

    const profileName = 1;
    const includedLine = includedOptions.length > 0 ? 1 : 0;
    const optionsHeading = availableOptions.length > 0 ? 1 : 0;
    const optionLines = availableOptions.length;
    const profileSpacing = 1;

    return (
      total +
      profileName +
      includedLine +
      optionsHeading +
      optionLines +
      profileSpacing
    );
  }, 0);

  return headingWeight + profilesWeight;
}
