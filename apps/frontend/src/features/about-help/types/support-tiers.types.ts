export const supporterTiers = [
  "Hero of Legend",
  "Hero of Valour",
  "Hero of Fortitude",
  "Minor Hero",
  "Independent Hero",
  "Rank and File Warrior",
] as const;

export type SupporterTier = (typeof supporterTiers)[number];

export const supporterTierColors: Record<SupporterTier, string> = {
  "Hero of Legend": "#D4A43A",
  "Hero of Valour": "#9673D6",
  "Hero of Fortitude": "#5C9BD5",
  "Minor Hero": "#55AA91",
  "Independent Hero": "#BB8562",
  "Rank and File Warrior": "#bf93b6",
};
