import pkg from "web-push";
const { generateVAPIDKeys } = pkg;
// Generate VAPID keys
const vapidKeys = generateVAPIDKeys();

console.log("Public Key:", vapidKeys.publicKey);
console.log("Private Key:", vapidKeys.privateKey);
