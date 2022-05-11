import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDzt6o9u5agyiAGXBng2ab3fIUj2MJZDq4",
    authDomain: "react-js-calorie-counter.firebaseapp.com",
    databaseURL: "https://react-js-calorie-counter-default-rtdb.firebaseio.com",
    projectId: "react-js-calorie-counter",
    storageBucket: "react-js-calorie-counter.appspot.com",
    messagingSenderId: "316649345331",
    appId: "1:316649345331:web:82fcf4db6cef920d05ee46",
    measurementId: "G-3NMYZJRMRD"
  };  

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app);
export default app;