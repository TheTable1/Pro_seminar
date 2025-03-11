import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcqpeMwc6bxQ0DXgPYGkSWAa45mhXJABA",
  authDomain: "pj-seminar.firebaseapp.com",
  projectId: "pj-seminar",
  storageBucket: "pj-seminar.firebasestorage.app",
  messagingSenderId: "144020212415",
  appId: "1:144020212415:web:4f88670dab6f0ca6ad140a",
  measurementId: "G-EJ8089T0YN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
