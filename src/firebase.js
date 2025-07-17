import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxoIvLomZxUgKBzLrVV8rDT21j7zV3qdk",
  authDomain: "help-moto-12a63.firebaseapp.com",
  projectId: "help-moto-12a63",
  storageBucket: "help-moto-12a63.appspot.com",
  messagingSenderId: "144647885926",
  appId: "1:144647885926:web:53952410d8732a071e89a7",
  measurementId: "G-DH0EWBKF1J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
