export interface GuestRoster {
  id: "guest";
  name: string;
  armyListId: string;
  pointsLimit?: number;
  tags?: string[];

  warbands: GuestWarband[];

  createdAt: string;
  updatedAt: string;
}

export interface GuestWarband {
  id: string;
  leader: GuestRosterUnit;
  followers: GuestRosterUnit[];
}

export interface GuestRosterUnit {
  id: string;
  profileId: string;
  quantity: number;

  // TODO: additional fields
}

export interface GuestRosterStats {
  points: number;
  modelCount: number;
  warbandCount: number;
  might: number;
  bowCount: number;
  throwingWeaponCount: number;
}
