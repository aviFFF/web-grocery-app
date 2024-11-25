import webPush from 'web-push';

// Generate VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();

console.log('VAPID_PUBLIC_KEY:', vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY:', vapidKeys.privateKey);
