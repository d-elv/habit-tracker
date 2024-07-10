import { HabitType } from "../interfaces";
import { Timestamp } from "firebase/firestore";
import { getDate } from "./useGetDate";

const todaysFullDate = getDate();

const calculateTotalDaysDifference = (
  taskDate: string,
  todaysDate: string
): number => {
  const taskDateDate = new Date(taskDate);
  const todaysDateDate = new Date(todaysDate);

  const taskDateTimeStamp = taskDateDate.getTime();
  const todaysDateTimeStamp = todaysDateDate.getTime();

  const differenceInMilliseconds = todaysDateTimeStamp - taskDateTimeStamp;

  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return Math.round(differenceInDays);
};

const formatDate = (firebaseTimestamp: Timestamp): string => {
  const timestampDate = firebaseTimestamp.toDate();

  const timestampYear = timestampDate.getFullYear();
  let timestampMonth: string | number = timestampDate.getMonth() + 1;
  const timestampDayOfMonth = timestampDate.getDate();
  if (timestampMonth < 10) {
    timestampMonth = String("0" + timestampMonth);
  }
  // logic for determining if the firebasetimestamp is before today or not.
  const formattedDate = String(
    `${timestampYear}-${timestampMonth}-${timestampDayOfMonth}`
  );
  return formattedDate;
};

const findHabitById = (id: string, habits: HabitType[]): HabitType => {
  const habit = habits.find((habit) => habit.id === id);
  if (!habit) {
    throw new Error(`Habit with id ${id} not found`);
  }
  return habit;
};

export const getDaysSinceHabitCreation = (id: string, habits: HabitType[]) => {
  const habitForTimestamp = findHabitById(id, habits);
  const formattedFirebaseTimestamp = formatDate(habitForTimestamp.createdAt);
  const daysSinceHabitCreated = calculateTotalDaysDifference(
    formattedFirebaseTimestamp,
    todaysFullDate
  );
  return daysSinceHabitCreated;
};
