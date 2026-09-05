export type PlayerColor = "NAVY" | "PINK";
export type Category = "CASA" | "CASAL";

export type Player = {
  id: string;
  name: string;
  color: PlayerColor;
};

export type Activity = {
  id: string;
  name: string;
  points: number;
  category: Category;
};

export type PeriodAgg = { points: number; count: number };

export type Stats = {
  player: Player;
  casa: { month: PeriodAgg; year: PeriodAgg; total: PeriodAgg };
  casal: { month: PeriodAgg; year: PeriodAgg; total: PeriodAgg };
};

export type CalendarPayload = {
  category: Category;
  days: string[];
  maxLevel: number;
  monthLabel: string;
  monthEndKey: string;
  daysLeft: number;
  byPlayer: Record<string, Record<string, number>>;
  players: Player[];
};
