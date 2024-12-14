import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCg4J-0YB8YooulDGhvVm5b6XFl7qZu068",
  authDomain: "buzzat-app.firebaseapp.com",
  projectId: "buzzat-app",
  storageBucket: "buzzat-app.firebasestorage.app",
  messagingSenderId: "843111158340",
  appId: "1:843111158340:web:a91fdce0aeb00fecf36211",
  measurementId: "G-K86Z4DN8QS"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging, onMessage, getToken };



