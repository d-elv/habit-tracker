import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";
import { db } from "../config/firebase-config";

export const useUpdateHabitName = () => {
  const { currentUser } = useAuth();

  const updateHabitName = async (id: string, habitName: string) => {
    if (currentUser === null) {
      throw new Error("currentUser is null");
    }
    const habitsCollectionRef = doc(db, "habits", id);
    await updateDoc(habitsCollectionRef, {
      habitName,
    });
  };
  return { updateHabitName };
};
