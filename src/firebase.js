import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDJx1qX64yYdn7WkyKW9Riify4s5L51wo8",
  authDomain: "ai-resume-screening-98f3a.firebaseapp.com",
  projectId: "ai-resume-screening-98f3a",
  storageBucket: "ai-resume-screening-98f3a.firebasestorage.app",
  messagingSenderId: "311901278880",
  appId: "1:311901278880:web:4a00ed0d98c18598b0efc5",
};




const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);