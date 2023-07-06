// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeKGO2DSb7lIfcWK60TXuzSKurPMqahjg",
  authDomain: "recepie-list-f00b1.firebaseapp.com",
  projectId: "recepie-list-f00b1",
  storageBucket: "recepie-list-f00b1.appspot.com",
  messagingSenderId: "824684683804",
  appId: "1:824684683804:web:10ed2a0609dc021a77b5d9",
  databaseURL: "https://recepie-list-f00b1-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();