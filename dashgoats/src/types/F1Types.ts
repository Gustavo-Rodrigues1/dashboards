export interface Driver {
  name: string;
  team: string;
  pts: number;
  photoUrl?: string | null;
  driverId: string;
  nationality: string;
  initials: string;
  color: string;
}

export interface Team {
  name: string;
  pts: number;
  wins: number;
  nationality: string;
  initials: string;
  color: string;
  photoUrl: string | null;
  constructorId?: string;
}

export interface RacePoint {
  round: string;
  [driverName: string]: number | string;
}

export interface DriverDetail extends Driver {
  wins: number;
  podiums: number;
  poles: number;
  dnfs: number;
  number: string;
  positions: { round: string; position: number }[];
}

export interface TeamDetail extends Team {
  drivers: {
    name: string;
    pts: number;
    initials: string;
    photoUrl: string | null;
  }[];
  driverContribution: {
    name: string;
    pts: number;
    color: string;
  }[];
  positions: { round: string; position: number }[];
}