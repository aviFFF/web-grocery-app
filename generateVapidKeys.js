import webPush from 'web-push';

// Generate VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();

console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY:', vapidKeys.publicKey);
console.log('NEXT_PUBLIC_VAPID_PRIVATE_KEY:', vapidKeys.privateKey);
