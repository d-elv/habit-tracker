import { Timestamp } from "firebase/firestore";

export type DayOfHabitType = {
  day: number;
  completed: boolean;
};

export interface HabitType {
  userID: string;
  habitName: string;
  daysToTrack: number;
  habitTrackArray: DayOfHabitType[];
  createdAt: Timestamp;
  id: string;
}
