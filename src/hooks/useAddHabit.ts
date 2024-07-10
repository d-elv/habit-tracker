import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useAuth } from "../contexts/authContext";
import { HabitType } from "../interfaces";

export const useAddHabit = () => {
  const { currentUser } = useAuth();
  // put in the reference to the database, and then the name of the collection you're accessing

  const addHabit = async (
    habit: Omit<HabitType, "userID" | "createdAt" | "id">
  ) => {
    if (currentUser === null) {
      throw new Error("currentUser is null");
    }
    const userID = currentUser.uid;
    const transactionCollectionRef = collection(db, "habits");
    await addDoc(transactionCollectionRef, {
      ...habit,
      userID,
      createdAt: serverTimestamp(),
    });
  };

  return { addHabit };
};
