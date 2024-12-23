self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("Push received:", data);
  
    const options = {
      body: data.body,
      icon: "/vendor/vendor-buzzat.png", // Path to your notification icon
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  