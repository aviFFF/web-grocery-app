import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCsFTGkoJNq-lm4_chREScGSGJubGg9nOU",
    authDomain: "buzzat-vendor.firebaseapp.com",
    projectId: "buzzat-vendor",
    storageBucket: "buzzat-vendor.firebasestorage.app",
    messagingSenderId: "691198964016",
    appId: "1:691198964016:web:07cdf380a4eee1f387d8f5",
    measurementId: "G-XDDCHDVP85"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
