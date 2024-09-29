import { useParams, useOutletContext } from "react-router-dom";
import { HabitType } from "../../interfaces.ts";
import "./Habit.css";
import { getDaysSinceHabitCreation } from "../../hooks/useGetDaysSinceHabitCreation.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { InputModal } from "../InputModal/InputModal.tsx";

export const Habit = () => {
  const { habitName } = useParams<{ habitName: string }>();
  const habits = useOutletContext<HabitType[]>();
  const [showModal, setShowModal] = useState(false);

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
    <div className="habit-page-container">
      {showModal && (
        <InputModal
          dataToUpdate="Habit Name"
          habitName={habit.habitName}
          id={habit.id}
          setShowModal={setShowModal}
        />
      )}
      <div className="divider"></div>
      <header className="habit-component-header">
        <h2 className="habit-title">{habit.habitName} progress</h2>
        <button
          className="edit-pencil-icon"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </header>
      <div className="design-container">
        {habit.habitTrackArray.map((itemObject, index) => {
          const passedTodayBoolean = index < daysSinceHabitCreated + 1;
          return (
            <li key={index} className="list-item">
              <div
                className={`day-container ${getClassName(
                  itemObject.completed,
                  passedTodayBoolean
                )} ${daysSinceHabitCreated === index ? "today" : ""}`}
              >
                {itemObject.day}
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
};
