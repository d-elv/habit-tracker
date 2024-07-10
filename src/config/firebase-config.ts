// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const app = initializeApp({
  apiKey: "AIzaSyB2trZoBAOu-KCX0_o7JUx2fnTi2V1Xe1Y",
  authDomain: "reminders-but-good-1.firebaseapp.com",
  projectId: "reminders-but-good-1",
  storageBucket: "reminders-but-good-1.appspot.com",
  messagingSenderId: "55396986195",
  appId: "1:55396986195:web:eca6868ec65e0b4d8f85a6",
});

// Initialize Firebase
export const auth = getAuth(app);
export default app;
export const db = getFirestore();
// firebase login
// firebase init
// firebase deploy
