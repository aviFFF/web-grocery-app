"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const VendorLogin = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installVendorPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log(
        choiceResult.outcome === "accepted" ? "Installed!" : "Dismissed"
      );
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/vendor/service-worker.js")
        .then((registration) =>
          console.log("[Vendor SW] Registered", registration)
        )
        .catch((error) =>
          console.error("[Vendor SW] Registration Failed", error)
        );
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="vendor/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl py-6 font-bold text-center text-gray-800">
            Vendor Portal
          </h1>
          <h2 className="text-sm text-center text-gray-600">
            <Link className="text-blue-500 text-2xl" href="/vendor-order">Check Your Order</Link>
          </h2>
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src={"/vendor/vendor-buzzat.png"}
                className="rounded-2xl w-24"
                alt="logo"
                width={200}
                height={50}
              />
            </Link>
          </div>
        </div>
        {showInstallBanner && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
            <p>Install Vendor Portal App for easy access!</p>
            <button className="bg-primary p-2" onClick={installVendorPWA}>
              Install
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorLogin;
