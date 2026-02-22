
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDbthMnYcXTnwaViG8Ve_WQNAM-7XBV5AA",
  authDomain: "cyberrakshak-a64b2.firebaseapp.com",
  projectId: "cyberrakshak-a64b2",
  storageBucket: "cyberrakshak-a64b2.firebasestorage.app",
  messagingSenderId: "41879139113",
  appId: "1:41879139113:web:112e3d14a1469a6528bd38"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);