// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyCg4J-0YB8YooulDGhvVm5b6XFl7qZu068",
    authDomain: "buzzat-app.firebaseapp.com",
    projectId: "buzzat-app",
    storageBucket: "buzzat-app.appspot.com", // Fix this: It should be "appspot.com"
    messagingSenderId: "843111158340",
    appId: "1:843111158340:web:a91fdce0aeb00fecf36211",
    measurementId: "G-K86Z4DN8QS"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/buzzat-logo.png', // Provide the correct path to your logo
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
