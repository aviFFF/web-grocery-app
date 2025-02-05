importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCsFTGkoJNq-lm4_chREScGSGJubGg9nOU",
    authDomain: "buzzat-vendor.firebaseapp.com",
    projectId: "buzzat-vendor",
    storageBucket: "buzzat-vendor.firebasestorage.app",
    messagingSenderId: "691198964016",
    appId: "1:691198964016:web:07cdf380a4eee1f387d8f5",
    measurementId: "G-XDDCHDVP85"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
    sound: "/notific.mp3", // Sound file for notifications
  });
});
