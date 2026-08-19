import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Remplace ces valeurs par celles de ton projet Firebase
// (Console Firebase > Parametres du projet > Vos applications)
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "samaspace.firebaseapp.com",
  projectId: "samaspace",
  storageBucket: "samaspace.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
