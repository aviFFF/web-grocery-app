// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDOh9RZDYm4NrmY9kyI0bhz62gSEubZFek",
    authDomain: "my-new-project-39060.firebaseapp.com",
    projectId: "my-new-project-39060",
    storageBucket: "my-new-project-39060.firebasestorage.app",
    messagingSenderId: "987658077245",
    appId: "1:987658077245:web:7f7d63d2148d7c5d505654",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/newblogo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
