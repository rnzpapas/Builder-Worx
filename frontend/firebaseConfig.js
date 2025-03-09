import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence} from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAHG3Sw7ZZhkHjR_g3uP39rgcKcUDt5mWM",
    authDomain: "builder-worx-f1c08.firebaseapp.com",
    databaseURL: "https://builder-worx-f1c08-default-rtdb.firebaseio.com",
    projectId: "builder-worx-f1c08",
    storageBucket: "builder-worx-f1c08.appspot.com",
    messagingSenderId: "277098088506",
    appId: "1:277098088506:web:6f76ea62dc06a5d697cd03"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
})
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);