import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDg-S3DIHuBfVsOO35BSYkaoYrhqjtgw1s",
  authDomain: "real-estate-fa824.firebaseapp.com",
  projectId: "real-estate-fa824",
  storageBucket: "real-estate-fa824.appspot.com",
  messagingSenderId: "928176676840",
  appId: "1:928176676840:web:97f95420ee106aeca30e5d"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore();