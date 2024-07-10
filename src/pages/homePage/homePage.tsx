import { FC, useState, ChangeEvent, useEffect } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext.tsx";
import { useAddHabit } from "../../hooks/useAddHabit.ts";
import { ViewHabits } from "../viewHabits/viewHabits.tsx";
import { DayOfHabitType } from "../../interfaces.ts";
import { Navbar } from "../../components/Navbar/Navbar.tsx";

type HabitType = {
  habitName: string;
  daysToTrack: number;
  habitTrackArray: DayOfHabitType[];
};

export const HomePage: FC = () => {
  const [habitName, setHabitName] = useState("");
  const [daysToTrack, setDaysToTrack] = useState(1);
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [isInitialised, setIsInitialised] = useState(false);
  const { currentUser } = useAuth();
  const { addHabit } = useAddHabit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setIsInitialised(true);
    }
  }, [currentUser]);

  const initialiseHabitTrackArray = (daysToTrack: number): DayOfHabitType[] => {
    return Array.from({ length: daysToTrack }, (_, index) => ({
      day: index + 1,
      completed: false,
    }));
  };

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const habitTrackArray = initialiseHabitTrackArray(daysToTrack);
    const newHabit = {
      habitName,
      daysToTrack,
      habitTrackArray,
    };
    if (habitName) {
      setHabits([...habits, newHabit]);
      try {
        await addHabit(newHabit);
      } catch (error) {
        console.error(error);
      }
      setHabitName("");
      setDaysToTrack(0);
    } else {
      return;
    }
  };

  const numberHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setDaysToTrack(Number(event.target.value));
  };

  if (!isInitialised) {
    return null;
  }

  return (
    <>
      <Navbar />
      <header>
        <h1 className="header-middle">Habit Tracker Creation</h1>
      </header>
      <div className="habit-creation">
        <form onSubmit={handleSubmit}>
          <fieldset className="form-container">
            <div className="habit-name-container">
              <input
                type="text"
                onChange={(event) => {
                  setHabitName(event.target.value);
                }}
                className="habit-input"
                placeholder="Name your habit here..."
                value={habitName}
              />
            </div>
            <div className="habit-name-container">
              <p className="days-to-track-subtitle">
                Specify # of days to track this habit.
              </p>
              <div className="days-container">
                <input
                  className="days-to-track"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  name="days-to-track"
                  id="days-to-track"
                  min="0"
                  value={daysToTrack}
                  onChange={numberHandler}
                />
              </div>
            </div>
            <div className="habit-name-container">
              <button className="habit-input-button">Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
      <ViewHabits />
    </>
  );
};

// TODO:
// implement key command for going back from a viewHabit link quickly: https://barrymichaeldoyle.com/blog/keyboard-events

// COMPLETE:
// Implement handling for when habits are completed.
