// firebaseConfig.js
import { initializeApp } from "firebase/app";
// On remplace analytics par getFirestore
import { getFirestore } from "firebase/firestore"; 

// 1. On change getAuth par initializeAuth et on ajoute le gestionnaire de persistance
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2WrcyITPNqiYYmbIMHynaOLS9HL07hQQ",
  authDomain: "burgerqueen-edf03.firebaseapp.com",
  projectId: "burgerqueen-edf03",
  storageBucket: "burgerqueen-edf03.firebasestorage.app",
  messagingSenderId: "402168414259",
  appId: "1:402168414259:web:09f5838ac879cee2f1a346",
  measurementId: "G-HMHFRVD0J0"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// 2. On initialise l'authentification avec la mémoire du téléphone

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// Exporter la base de données pour l'utiliser dans tes composants
export const db = getFirestore(app);