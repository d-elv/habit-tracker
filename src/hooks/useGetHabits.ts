import { useState, useEffect } from "react";
import {
  query,
  collection,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config.js";
import { useAuth } from "../contexts/authContext.js";
import { HabitType } from "../interfaces.js";

export const useGetHabits = () => {
  const [habits, setHabits] = useState<HabitType[]>([]);
  const habitsCollectionRef = collection(db, "habits");
  const { currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser) return;

    const getHabits = async () => {
      try {
        const queryHabits = query(
          habitsCollectionRef,
          // returning all habit documents from the firebase per user.
          where("userID", "==", currentUser.uid),
          orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(queryHabits, (snapshot) => {
          const documents: HabitType[] = [];

          snapshot.forEach((document) => {
            const data = document.data() as Omit<HabitType, "id">;
            const id = document.id;

            documents.push({ ...data, id });

            setHabits(documents);
          });
        });
        return () => unsubscribe();
      } catch (error) {
        console.error(error);
      }
    };

    getHabits();
  }, [currentUser]);
  return { habits };
};
