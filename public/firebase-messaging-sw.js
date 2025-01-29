importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Message Received:", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/buzzat-logo.png", // Add your notification icon here
  });

  const audio = new Audio("/noti-sound.mp3"); // Use a vendor-specific sound
  audio.play();

});
