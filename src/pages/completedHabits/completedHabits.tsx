import "./completedHabits.css";
import "../homePage/homepage.css";
import "./Dropdown.css";
import { useGetHabits } from "../../hooks/useGetHabits";
import { HabitType } from "../../interfaces";
import { DayOfHabitType } from "../../interfaces";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { getDaysSinceHabitCreation } from "../../hooks/useGetDaysSinceHabitCreation";

export const CompletedHabits = () => {
  const { habits } = useGetHabits();
  const [completedHabits, setCompletedHabits] = useState(0);
  const [unfulfilledHabits, setUnfulfilledHabits] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSelection, setDropdownSelection] = useState("Completed");

  const checkAllValuesAreTrue = (habitArray: DayOfHabitType[]) => {
    return habitArray.every((item) => item.completed);
  };

  useEffect(() => {
    calculateCompletedAndUnfulfilledHabits();
  }, [habits]);

  const calculateCompletedAndUnfulfilledHabits = () => {
    let completedCount = 0;
    let unfulfilledCount = 0;
    habits.map((dbHabit: HabitType) => {
      const { habitTrackArray, id } = dbHabit;
      const daysSinceHabitCreated = getDaysSinceHabitCreation(id, habits);

      if (checkAllValuesAreTrue(habitTrackArray)) {
        completedCount = completedCount + 1;
      } else if (
        daysSinceHabitCreated >= habitTrackArray.length &&
        !checkAllValuesAreTrue(habitTrackArray)
      ) {
        unfulfilledCount = unfulfilledCount + 1;
      }
    });
    setCompletedHabits(completedCount);
    setUnfulfilledHabits(unfulfilledCount);
  };

  const Dropdown = () => {
    const toggleDropdown = () => {
      setIsDropdownOpen((previousState) => !previousState);
    };

    const handleAssign = (assignString: string) => {
      if (dropdownSelection === assignString) {
        return;
      } else {
        setDropdownSelection(assignString);
      }
    };

    return (
      <div className="dropdown-container">
        <label className="dropdown-label">Filter Habits</label>
        <button className="dropdown-button" onClick={toggleDropdown}>
          <div className="down-facing-arrow"></div>
          <span className="selected-dropdown-option">{dropdownSelection}</span>
        </button>
        {isDropdownOpen && (
          <div className="dropdown-options-list-container">
            <ul className="dropdown-options-list">
              <li
                className="dropdown-list-item"
                onClick={() => {
                  handleAssign("Completed");
                }}
              >
                Completed
              </li>
              <li
                className="dropdown-list-item"
                onClick={() => {
                  handleAssign("Unfulfilled");
                }}
              >
                Unfulfilled
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <header>
        <h1 className="header-middle">Finished Habits</h1>
      </header>
      <div className="completed-habits-page-container">
        <div className="dropdown-container">
          <Dropdown />
        </div>

        <h2 className="subheading">
          {dropdownSelection === "Completed" ? (
            <div>
              You have completed{" "}
              <span className="completed-habits-count">{completedHabits}</span>{" "}
              {completedHabits === 1 ? "Habit" : "Habits"}{" "}
            </div>
          ) : (
            <div>
              There {unfulfilledHabits === 1 ? "is" : "are"}{" "}
              <span className="unfulfilled-habits-count">
                {unfulfilledHabits}
              </span>{" "}
              unfulfilled {unfulfilledHabits === 1 ? "Habit" : "Habits"}{" "}
            </div>
          )}
        </h2>

        <div className="completed-habits">
          <ul className="completed-list">
            {habits.map((dbHabit: HabitType, index: number) => {
              const { habitName, habitTrackArray, id } = dbHabit;
              const habitDaysSinceCreation =
                getDaysSinceHabitCreation(id, habits) + 1;
              if (
                checkAllValuesAreTrue(habitTrackArray) &&
                dropdownSelection === "Completed"
              ) {
                return (
                  <li key={index} className="completed-list-item">
                    <h2 className="habit-name">{habitName}</h2>
                    <p>
                      This habit lasted {habitTrackArray.length}{" "}
                      {habitTrackArray.length === 1 ? "day" : "days"}
                    </p>
                    <p>Nice work!</p>
                  </li>
                );
              }
              if (
                habitDaysSinceCreation >= habitTrackArray.length &&
                !checkAllValuesAreTrue(habitTrackArray) &&
                dropdownSelection === "Unfulfilled"
              ) {
                return (
                  <li key={index} className="completed-list-item">
                    <h2 className="habit-name">{habitName}</h2>
                    <p>
                      This habit lasted {habitTrackArray.length}{" "}
                      {habitTrackArray.length === 1 ? "day" : "days"}
                    </p>
                    <p>
                      Unfortunately you didn't do it every day. Better luck next
                      time!
                    </p>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

// TODO

// 2) Make Dropdown component close when a user clicks off it.
// 3) Move Dropdown component code out.
// 4) Make completed / unfulfilled read the days the habit ran to and from.
//    and ran from xth of May to 1st of June. Nice work!

// COMPLETED
