"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the app is already installed (persisted state)
    const appInstalled = localStorage.getItem("isAppInstalled");
    if (appInstalled === "true") {
      setIsAppInstalled(true);
      return;
    }

    // Capture the 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for the 'appinstalled' event
    const handleAppInstalled = () => {
      console.log("PWA installed successfully");
      setIsAppInstalled(true);
      localStorage.setItem("isAppInstalled", "true"); // Save the state
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt.");
        setDeferredPrompt(null); // Clear the prompt after successful interaction
      } else {
        console.log("User dismissed the install prompt.");
      }
    } else {
      console.log("No install prompt available.");
    }
  };

  if (isAppInstalled) {
    return null; // Hide the banner if the app is already installed
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-50">
      <span>Install our app for the best experience!</span>
      <Button onClick={installPWA} className="bg-primary text-white">
        Install App
      </Button>
    </div>
  );
}
