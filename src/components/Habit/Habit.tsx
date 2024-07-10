import { useParams, useOutletContext } from "react-router-dom";
import { HabitType } from "../../interfaces.ts";
import "./Habit.css";
import { getDaysSinceHabitCreation } from "../../hooks/useGetDaysSinceHabitCreation.ts";

export const Habit = () => {
  const { habitName } = useParams<{ habitName: string }>();
  const habits = useOutletContext<HabitType[]>();

  const habit =
    habitName !== undefined
      ? habits.find((habit) => habit.habitName === habitName)
      : null;

  if (!habit) {
    return <h1>Habit not found</h1>;
  }

  const getClassName = (completed: boolean, passedToday: boolean) => {
    if (completed && passedToday) return "complete";
    if (!completed && passedToday) return "incomplete";
    if (completed && !passedToday) return "incomplete";
    return "day-to-come";
  };

  const daysSinceHabitCreated = getDaysSinceHabitCreation(habit.id, habits);

  return (
    <div>
      <div className="divider"></div>
      <h2 className="habit-title">{habit.habitName} progress</h2>
      <div className="design-container">
        {habit.habitTrackArray.map((itemObject, index) => {
          const isLastArrayItem = index === habit.habitTrackArray.length - 1;
          const passedTodayBoolean = index < daysSinceHabitCreated + 1;
          return (
            <li key={index} className="list-item">
              <div
                className={`day-container ${getClassName(
                  itemObject.completed,
                  passedTodayBoolean
                )}`}
              >
                {itemObject.day}
              </div>
              <div className={`${isLastArrayItem ? "invisible" : "separator"}`}>
                <div className="line"></div>
                <div className="arrow-head"></div>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
};

// TODO

// COMPLETE

// 1) Provide a "Not reach this day yet" colour so it doesn't look like
//    you've either failed or succeeded
