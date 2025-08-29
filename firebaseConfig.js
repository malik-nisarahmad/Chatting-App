// // Import the functions you need from the SDKs you need
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getReactNavigationConfig } from "expo-router/build/getReactNavigationConfig";
// import { initializeApp } from "firebase/app";
// import { collection, getFireStore } from 'firebase/firestore';


// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9vzSnfOckGaViV4ARq6i6Xi_UXET4K9w",
//   authDomain: "movie-chatting.firebaseapp.com",
//   projectId: "movie-chatting",
//   storageBucket: "movie-chatting.firebasestorage.app",
//   messagingSenderId: "28230272370",
//   appId: "1:28230272370:web:98671b44e5705b269a89eb"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth=initializeApp(app,{
//     persistence:getReactNavigationConfig(AsyncStorage)
// })

// export const db=getFireStore(app);

// export const userRef=collection(db,'users');
// export const roomRef=collection(db,'rooms');

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyB9vzSnfOckGaViV4ARq6i6Xi_UXET4K9w",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "movie-chatting.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "movie-chatting",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "movie-chatting.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "28230272370",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:28230272370:web:98671b44e5705b269a89eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");