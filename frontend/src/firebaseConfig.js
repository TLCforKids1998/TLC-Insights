// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfqgSXzw2YjM0a2tu2QyWO2Wncv99o6RI",
  authDomain: "tlc-insights.firebaseapp.com",
  projectId: "tlc-insights",
  storageBucket: "tlc-insights.appspot.com",
  messagingSenderId: "385363592293",
  appId: "1:385363592293:web:8e64a2df0f1fc99f78f28c",
  measurementId: "G-5YLS6C6KG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics }; 