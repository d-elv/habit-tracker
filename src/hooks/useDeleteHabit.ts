import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";
import { db } from "../config/firebase-config";

export const useDeleteHabit = () => {
  const { currentUser } = useAuth();
  // const userID = currentUser.uid;

  const deleteHabit = async (id: string) => {
    if (currentUser === null) {
      throw new Error("currentUser is null");
    }
    const habitsCollectionRef = doc(db, "habits", id);
    await deleteDoc(habitsCollectionRef);
  };
  return { deleteHabit };
};
