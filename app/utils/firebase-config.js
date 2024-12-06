// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg4J-0YB8YooulDGhvVm5b6XFl7qZu068",
  authDomain: "buzzat-app.firebaseapp.com",
  projectId: "buzzat-app",
  storageBucket: "buzzat-app.firebasestorage.app",
  messagingSenderId: "843111158340",
  appId: "1:843111158340:web:a91fdce0aeb00fecf36211",
  measurementId: "G-K86Z4DN8QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);