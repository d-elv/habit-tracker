import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";
import { db } from "../config/firebase-config";

export const useUpdateHabit = () => {
  const { currentUser } = useAuth();
  // const userID = currentUser.uid;

  const updateHabit = async (id: string, arrayToUpdate: object[]) => {
    if (currentUser === null) {
      throw new Error("currentUser is null");
    }
    const habitsCollectionRef = doc(db, "habits", id);
    await updateDoc(habitsCollectionRef, {
      habitTrackArray: arrayToUpdate,
    });
  };
  return { updateHabit };
};
