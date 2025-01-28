self.addEventListener("install", (event) => {
    console.log("[Vendor SW] Installed");
  });
  
  self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    });
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const audio = new Audio('/notific.mp3'); // Use a vendor-specific sound
    audio.play();
  });
  