// import { getToken } from 'firebase/messaging'; // Import getToken
// import { messaging } from '../firebase-config'; // Import your Firebase messaging instance

// export const requestPermission = async () => {
//     try {
//         // Request user permission for notifications
//         const permission = await Notification.requestPermission();

//         if (permission === 'granted') {
//             // Retrieve the FCM token using the provided VAPID key
//             const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });

//             if (token) {
//                 console.log('FCM Token:', token);
//                 return token; // Return token for use in backend or debugging
//             } else {
//                 console.error('Failed to generate FCM token. Ensure Firebase is configured correctly.');
//                 return null;
//             }
//         } else {
//             console.log('Notification permission denied.');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error requesting permission:', error);
//         return null;
//     }
// };
