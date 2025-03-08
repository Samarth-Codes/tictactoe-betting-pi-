// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration (Replace with your actual Firebase details)
const firebaseConfig = {
  apiKey: "AIzaSyCC22I6P4ulK9Phxp2dBDJDd-lOjcFGUp4",
  authDomain: "tictactoe-auth-63cab.firebaseapp.com",
  projectId: "tictactoe-auth-63cab",
  storageBucket: "tictactoe-auth-63cab.appspot.com", // ✅ Fixed
  messagingSenderId: "327748412718",
  appId: "1:327748412718:web:64015edf0fa0177b8586bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
