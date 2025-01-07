// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTEreYFel7_mcHN8rUJ35a2VKF11OtR4Q",
  authDomain: "controlfn-b2aa2.firebaseapp.com",
  projectId: "controlfn-b2aa2",
  storageBucket: "controlfn-b2aa2.firebasestorage.app",
  messagingSenderId: "758617541714",
  appId: "1:758617541714:web:b3d6c5797ac57bcda1238b",
  measurementId: "G-KLBCWFHFFH"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);