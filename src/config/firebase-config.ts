// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const app = initializeApp({
  apiKey: "AIzaSyAAMwGP9xN1ckKnGJYyjZ8SXIsZbi3L6Ik",
  authDomain: "habit-tracker-3.firebaseapp.com",
  projectId: "habit-tracker-3",
  storageBucket: "habit-tracker-3.appspot.com",
  messagingSenderId: "518497803847",
  appId: "1:518497803847:web:9ae31c885442b5ae985b62",
});

// Initialize Firebase
export const auth = getAuth(app);
export default app;
export const db = getFirestore();
// firebase login
// firebase init
// firebase deploy
