export interface GuestRoster {
  id: "guest";
  name: string;
  armyListId: string;
  pointsLimit?: number;
  tags?: string[];

  armyOptionIds: string[];
  generalUnitId: string | null;

  warbands: GuestWarband[];

  createdAt: string;
  updatedAt: string;
}

export interface GuestWarband {
  id: string;
  leader: GuestRosterUnit | null;
  followers: GuestRosterUnit[];
}

export interface GuestRosterUnit {
  id: string;

  profileId: string;
  quantity: number;
  optionIds: string[];
}

export interface GuestRosterStats {
  points: number;
  modelCount: number;
  warbandCount: number;
  might: number;
  bowCount: number;
  throwingWeaponCount: number;
}
