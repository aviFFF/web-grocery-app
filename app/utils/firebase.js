import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCg4J-0YB8YooulDGhvVm5b6XFl7qZu068",
  authDomain: "buzzat-app.firebaseapp.com",
  projectId: "buzzat-app",
  storageBucket: "buzzat-app.firebasestorage.app",
  messagingSenderId: "843111158340",
  appId: "1:843111158340:web:a91fdce0aeb00fecf36211",
  measurementId: "G-K86Z4DN8QS"
};

let messaging = null;

// Ensure Firebase initializes only on the client side
if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

// Function to request permission for notifications
export const requestPermission = async () => {
  if (typeof window === "undefined" || !messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_PUBLIC_KEY,
      });

      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/vendor/vendor-buzzat.png",
    });
  });
}

// Function to listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });
