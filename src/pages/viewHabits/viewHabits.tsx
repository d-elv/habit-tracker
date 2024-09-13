import "./viewHabits.css";
import "../homePage/homepage.css";
import { useGetHabits } from "../../hooks/useGetHabits";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HabitType, DayOfHabitType } from "../../interfaces";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";
import { useState, useEffect, useRef, createRef, RefObject } from "react";
import { Timestamp } from "firebase/firestore";
import { Navbar } from "../../components/Navbar/Navbar";
import { getDate } from "../../hooks/useGetDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { InputModal } from "../../components/InputModal/InputModal";

const formatDate = (firebaseTimestamp: Timestamp): string => {
  if (firebaseTimestamp === null) {
    return "";
  }
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

type ActiveHabitType = {
  habitName: string;
  id: string;
  completed: boolean;
};

export const ViewHabits = () => {
  const [isThisHome, setIsThisHome] = useState<boolean | null>(null);
  const [buttonClickedId, setButtonClickedId] = useState("");
  const [activeHabitsCount, setActiveHabitsCount] = useState<number>(0);
  const [activeHabits, setActiveHabits] = useState<ActiveHabitType[]>([]);
  const [allActiveHabitsCompleted, setAllActiveHabitsCompleted] = useState<
    null | boolean
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [boxToHover, setBoxToHover] = useState<number | null>(null);
  const [pencilToHover, setPencilToHover] = useState<null | string>(null);
  const [habitInListToShowTooltip, setHabitInListToShowTooltip] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [habitNameToChange, setHabitNameToChange] = useState("");
  const [idOfHabitToUpdate, setIdOfHabitToUpdate] = useState("");
  const habitsItemsRefs = useRef<Array<RefObject<HTMLDivElement>>>([]);
  const habitsRefs = useRef<Array<RefObject<HTMLLIElement>>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { habits } = useGetHabits();
  const { updateHabit } = useUpdateHabit();
  const { deleteHabit } = useDeleteHabit();
  const location = useLocation();
  const todaysFullDate = getDate();

  useEffect(() => {
    setIsLoading(false);
  }, [habits, todaysFullDate]);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsThisHome(true);
    } else {
      setIsThisHome(false);
    }
  }, [location.pathname]);

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

  const calculateActiveHabits = () => {
    const habitsStillTracking: ActiveHabitType[] = [];
    habits.map((habit: HabitType) => {
      const { id, habitName, habitTrackArray } = habit;
      const { daysSinceHabitCreated } = getHabitAndDaysSinceCreation(id);

      if (daysSinceHabitCreated < habitTrackArray.length) {
        if (!habitTrackArray[habitTrackArray.length - 1].completed) {
          const completed = habitTrackArray[daysSinceHabitCreated].completed;
          habitsStillTracking.push({ habitName, id, completed });
        }
      }
    });
    setActiveHabits(habitsStillTracking);
    setActiveHabitsCount(habitsStillTracking.length);
  };

  useEffect(() => {
    habitsToComplete();
  }, [activeHabits]);

  const habitsToComplete = () => {
    const booleanArray = activeHabits.map((habit) => {
      return habit.completed;
    });
    const areAllTrue = () => {
      return booleanArray.every((item) => item === true);
    };
    if (areAllTrue()) {
      setAllActiveHabitsCompleted(true);
    } else {
      setAllActiveHabitsCompleted(false);
    }
  };

  const getHabitAndDaysSinceCreation = (id: string) => {
    const habitToUpdate = findHabitById(id, habits);
    const habitArrayToUpdate = habitToUpdate.habitTrackArray;
    const formattedFirebaseTimestamp = formatDate(habitToUpdate.createdAt);
    const daysSinceHabitCreated = calculateTotalDaysDifference(
      formattedFirebaseTimestamp,
      todaysFullDate
    );
    return { habitArrayToUpdate, daysSinceHabitCreated };
  };

  const checkIfCompleteToday = (id: string) => {
    const { habitArrayToUpdate, daysSinceHabitCreated } =
      getHabitAndDaysSinceCreation(id);
    return habitArrayToUpdate[daysSinceHabitCreated].completed;
  };

  const completeTodaysHabit = async (id: string) => {
    const { habitArrayToUpdate, daysSinceHabitCreated } =
      getHabitAndDaysSinceCreation(id);

    if (habitArrayToUpdate[daysSinceHabitCreated]) {
      habitArrayToUpdate[daysSinceHabitCreated] = {
        day: daysSinceHabitCreated + 1,
        completed: !habitArrayToUpdate[daysSinceHabitCreated].completed,
      };
    }
    await updateHabit(id, habitArrayToUpdate);
  };

  const handleUpdateHabit = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setButtonClickedId("");
      return;
    }

    setButtonClickedId(id);

    if (checkIfCompleteToday(id)) {
      completeTodaysHabit(id);
      setButtonClickedId("");
      timeoutRef.current = null;
      return;
    } else {
      timeoutRef.current = setTimeout(() => {
        completeTodaysHabit(id);
        setButtonClickedId("");
        timeoutRef.current = null;
      }, 2000);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    await deleteHabit(id);
  };

  const checkAllValuesAreTrue = (habitArray: DayOfHabitType[]) => {
    return habitArray.every((item) => item.completed);
  };

  useEffect(() => {
    calculateActiveHabits();
  }, [habits]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Navbar />
      </div>
    );
  }

  const handleTrackerHover = (id: string, index: number) => {
    const { daysSinceHabitCreated } = getHabitAndDaysSinceCreation(id);
    setShowTooltip(true);
    setHabitInListToShowTooltip(index);
    setBoxToHover(daysSinceHabitCreated);
  };

  const getClassName = (completed: boolean, passedToday: boolean) => {
    if (completed && passedToday) return "day-completed";
    if (!completed && passedToday) return "";
    if (completed && !passedToday) return "";
    return "day-to-come";
  };

  const handlePencilHover = (habitName: string) => {
    setPencilToHover(habitName);
  };

  const handlePencilLeave = () => {
    setPencilToHover(null);
  };

  const handleHabitNameChange = (id: string, habitName: string) => {
    setHabitNameToChange(habitName);
    setIdOfHabitToUpdate(id);
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <InputModal
          dataToUpdate="Habit Name"
          habitName={habitNameToChange}
          id={idOfHabitToUpdate}
          setShowModal={setShowModal}
        />
      )}
      {isThisHome === null ? null : isThisHome ? null : <Navbar />}
      <header>
        <h1 className="header-middle">
          {activeHabitsCount !== 0 ? (
            <div>
              You are tracking {activeHabitsCount}{" "}
              {activeHabitsCount === 1 ? "Habit" : "Habits"}
            </div>
          ) : (
            <div>Add a new habit to track!</div>
          )}
        </h1>
      </header>
      <ul className="list-of-habits">
        {allActiveHabitsCompleted && isThisHome && activeHabitsCount !== 0 ? (
          <div>
            <h1 className="all-ticked-off-subheading">
              Go to{" "}
              <Link className="view-habits-span-link" to="/habits">
                View Habits
              </Link>{" "}
              to track your habits
            </h1>
          </div>
        ) : (
          <div></div>
        )}
        {habits.map((dbHabit: HabitType, index: number) => {
          const { habitName, habitTrackArray, createdAt, id } = dbHabit;
          if (!createdAt) {
            return;
          }
          if (!habitsRefs.current[index]) {
            habitsRefs.current[index] = createRef();
          }
          const formattedFirebaseDate = formatDate(createdAt);
          const daysSinceHabitCreated = calculateTotalDaysDifference(
            formattedFirebaseDate,
            todaysFullDate
          );
          if (habitTrackArray[daysSinceHabitCreated] === undefined) {
            return;
          }

          if (habitTrackArray[daysSinceHabitCreated].completed && isThisHome) {
            return;
            // Esnures habits ticked off for the day don't render on the homepage.
          }

          if (checkAllValuesAreTrue(habitTrackArray)) {
            return;
          }
          return (
            <li key={index} className={"habit-list-item"}>
              <div className="button-and-habitName-link">
                {id && (
                  <button
                    className={`complete-habit-button ${
                      buttonClickedId === id ? "turn-green" : ""
                    }`}
                    onClick={() => handleUpdateHabit(id)}
                  />
                )}
                <div
                  className="edit-pencil-and-habit-name"
                  onMouseEnter={() => handlePencilHover(habitName)}
                  onMouseLeave={handlePencilLeave}
                >
                  <div
                    className={`edit-pencil-icon ${
                      pencilToHover === habitName
                        ? "pencil-visible"
                        : "pencil-invisible"
                    }`}
                    onClick={() => {
                      handleHabitNameChange(id, habitName);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </div>

                  <Link to={`/habits/${habitName}`} className="habitName-link">
                    {habitName}
                  </Link>
                </div>
              </div>
              <ul
                className="tracker-progress-list"
                onMouseEnter={() => {
                  handleTrackerHover(id, index);
                }}
                onMouseLeave={() => {
                  setBoxToHover(null);
                  setShowTooltip(false);
                }}
              >
                {habitTrackArray.map((item, boxIndex) => {
                  const passedTodayBoolean =
                    boxIndex < daysSinceHabitCreated + 1;

                  if (!habitsItemsRefs.current[item.day]) {
                    habitsItemsRefs.current[item.day] = createRef();
                  }

                  return (
                    <li key={boxIndex} className="tracker-progress-list-items">
                      {habitInListToShowTooltip === index &&
                        showTooltip &&
                        boxToHover === boxIndex && (
                          <div className="tooltip-arrow"></div>
                        )}
                      <div
                        className={`tracker-progress-box ${getClassName(
                          item.completed,
                          passedTodayBoolean
                        )}`}
                      ></div>
                    </li>
                  );
                })}
              </ul>
              <button
                className="delete-button"
                onClick={() => handleDeleteHabit(id)}
              >
                Delete Habit
              </button>
            </li>
          );
        })}
      </ul>
      <Outlet context={habits} />
    </>
  );
};
