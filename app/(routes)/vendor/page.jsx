"use client";
import { useState, useEffect } from "react";
import { vendorLogin } from "@/app/utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const VendorLogin = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const router = useRouter();
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await vendorLogin(formData.phone, formData.password);
      toast.success("Login successful!");
      router.replace("/vendor-order"); // Redirect to orders page
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="vendor/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8540952826970534"
     crossorigin="anonymous"></script>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
        <form
          className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Vendor Login
          </h1>
          <h2 className="text-sm text-center text-gray-600">
            Please contact us for login details
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
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
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
