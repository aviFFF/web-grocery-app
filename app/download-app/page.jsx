"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DownloadApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt.");
      } else {
        console.log("User dismissed the install prompt.");
      }
      setDeferredPrompt(null);
      setShowInstallBanner(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Download Our App</h1>
      <p className="text-center mb-6">
        Install our app for the best experience and stay connected with us.
      </p>

      {showInstallBanner && (
        <Button onClick={installPWA} className="bg-primary text-white">
          Install App
        </Button>
      )}

      {!showInstallBanner && (
        <p className="text-gray-500">App installation is not available on this device.</p>
      )}
    </div>
  );
}
