type ProfileType = "primary" | "composite" | "subprofile";

interface Profile {
  profile: string;
  origin: string;
  type: ProfileType;

  parentProfile?: string;
  displayStatRow: boolean;

  source: {
    book: string;
    page?: number;
  };

  armyLists: string[];

  stats: Stats;

  heroicActions: string[];
  specialRules: string[];
  wargear: string[];

  options: ProfileOption[];

  profileRules: ProfileRule[];
  magicPowers: MagicPower[];
  additionalText: string[];
}
