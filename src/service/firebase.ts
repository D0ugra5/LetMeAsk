import { initializeApp } from "firebase/app";
import * as auth from "firebase/auth" ;
import * as database from "firebase/database"    

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi6rjDz9Bqfed-9nw2QOhKaFu670q-C2E",
  authDomain: "letmeask-doug-e6671.firebaseapp.com",
  databaseURL: "https://letmeask-doug-e6671-default-rtdb.firebaseio.com",
  projectId: "letmeask-doug-e6671",
  storageBucket: "letmeask-doug-e6671.appspot.com",
  messagingSenderId: "77666418346",
  appId: "1:77666418346:web:bf4d26c973393a11e69ad3",
};

// Initialize Firebase
export const firebaseCommands = {
  firebaseInit: () => {
    initializeApp(firebaseConfig);
  },
  auth,
  database
};
