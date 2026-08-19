import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGbofAEEeNS-4uK0bogOby4DvQ0qF4Y2M",
  authDomain: "samaspace-97457.firebaseapp.com",
  projectId: "samaspace-97457",
  storageBucket: "samaspace-97457.firebasestorage.app",
  messagingSenderId: "110238022287",
  appId: "1:110238022287:web:1073744ad05e037e144efa",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
