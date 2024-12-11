self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const audio = new Audio('/noti-sound.mp3');
  audio.play();
});
