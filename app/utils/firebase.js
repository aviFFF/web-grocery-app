import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase Config
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

export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });
    if (token) {
      console.log("FCM Token:", token);
      // Send this token to your backend (e.g., save in Strapi)
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });


export default app;
