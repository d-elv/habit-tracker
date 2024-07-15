import "./viewHabits.css";
import "../homePage/homepage.css";
import { useGetHabits } from "../../hooks/useGetHabits";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HabitType, DayOfHabitType } from "../../interfaces";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";
import { useState, useEffect, useRef, createRef, RefObject } from "react";
import { Timestamp } from "firebase/firestore";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";
import { Navbar } from "../../components/Navbar/Navbar";
import { getDate } from "../../hooks/useGetDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

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

export const ViewHabits = () => {
  const [isThisHome, setIsThisHome] = useState<boolean | null>(null);
  const [buttonClickedId, setButtonClickedId] = useState("");
  const [habitsDoneTracking, setHabitsDoneTracking] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [boxToHover, setBoxToHover] = useState<number | null>(null);
  const [pencilToHover, setPencilToHover] = useState<null | string>(null);
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

  const checkIfComplete = (id: string) => {
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

    if (checkIfComplete(id)) {
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

  const getHabitsAreDoneTracking = () => {
    let count = 0;
    habits.map((dbHabit: HabitType) => {
      const { daysToTrack, id } = dbHabit;
      const { daysSinceHabitCreated } = getHabitAndDaysSinceCreation(id);
      if (daysSinceHabitCreated < daysToTrack) {
        return;
      } else {
        count = count + 1;
      }
    });
    setHabitsDoneTracking(count);
  };

  useEffect(() => {
    getHabitsAreDoneTracking();
  }, [habits]);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Navbar />
      </div>
    );
  }

  const handleTrackerHover = (id: string) => {
    const { daysSinceHabitCreated } = getHabitAndDaysSinceCreation(id);
    setShowTooltip(true);
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
    console.log(habitName, id);
  };

  return (
    <>
      {isThisHome === null ? null : isThisHome ? null : <Navbar />}
      <header>
        <h1 className="header-middle">
          You are tracking {habits.length - habitsDoneTracking}{" "}
          {habits.length - habitsDoneTracking === 1 ? "Habit" : "Habits"}
        </h1>
      </header>
      <ul className="list-of-habits">
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
            // Esnures habits ticked off for the day don't render
            return (
              <div key={index}>
                <h1 className="all-ticked-off-subheading">
                  Go to{" "}
                  <Link className="view-habits-span-link" to="/habits">
                    View Habits
                  </Link>{" "}
                  to track your habits
                </h1>
              </div>
            );
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
                  handleTrackerHover(id);
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
                      {showTooltip && boxToHover === boxIndex && (
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

// TODO
// 2) Add pencil icon for editing habit Name

// COMPLETE
// 1) Update "You are tracking {habits.length}" code that completedHabits is replaced with
//    habits that have run their course, completed or unfulfilled.
