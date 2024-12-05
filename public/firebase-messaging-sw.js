// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging.js");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOh9RZDYm4NrmY9kyI0bhz62gSEubZFek",
    authDomain: "my-new-project-39060.firebaseapp.com",
    projectId: "my-new-project-39060",
    storageBucket: "my-new-project-39060.firebasestorage.app",
    messagingSenderId: "987658077245",
    appId: "1:987658077245:web:7f7d63d2148d7c5d505654",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const { title, body } = payload.notification;
  const options = {
    body,
    icon: "/logo.png", // Replace with your app's logo
  };

  self.registration.showNotification(title, options);
});
