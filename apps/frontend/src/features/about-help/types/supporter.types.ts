import type { SupporterTier } from "~/features/about-help/types/support-tiers.types.ts";

export interface Supporter {
  id: string;
  name: string;
  tier?: SupporterTier;
  avatarUrl?: string;
  profileUrl?: string;
}
