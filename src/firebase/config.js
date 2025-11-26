// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// You can find these values in your Firebase Console:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create a new one)
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click on the web app icon (</>)
// 6. Copy the firebaseConfig object

const firebaseConfig = {
  apiKey: "AIzaSyDgIGKspLd6wAqomyumiBW8nFIHCHRB3PA",
  authDomain: "slv-iyanger-bakery.firebaseapp.com",
  projectId: "slv-iyanger-bakery",
  storageBucket: "slv-iyanger-bakery.firebasestorage.app",
  messagingSenderId: "540984354552",
  appId: "1:540984354552:web:3a8538b0bc3786940d3d0d",
  measurementId: "G-VJHRZMFND8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
