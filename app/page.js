'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Slider from "./_components/Slider";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import ProductListwc from "./_components/ProductListwc";
import GlobalApi from "./utils/GlobalApi";
import Head from 'next/head';

export default function Home() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const sliders = await GlobalApi.getSliders();
        const categories = await GlobalApi.getCategoryList();
        const products = await GlobalApi.getAllProducts();

        setSliderList(sliders || []);
        setCategoryList(categories || []);
        setProductList(products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(e); // Save the event for later use
      setShowInstallBanner(true); // Show the custom install banner
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null); // Reset the prompt
      setShowInstallBanner(false); // Hide the banner
    }
  };

  // Utility to convert Base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Register Service Worker and Request Notification Permissions
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker registered:', registration);

          if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              console.log("Notification permission granted.");

              try {
                const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
                const subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey,
                });
                console.log("Push subscription:", subscription);

                // Save the subscription to the server
                await GlobalApi.saveSubscription(subscription);
              } catch (error) {
                console.error("Failed to subscribe for push notifications:", error);
              }
            } else {
              console.log("Notification permission denied.");
            }
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        <p className="text-green-600 mt-4 text-xl font-semibold">Welcome to buzzat</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Buzzat - Online Grocery Store</title>
      </Head>
      <div className="md:p-4 p-5 md:px-16">
        <Slider sliderList={sliderList} />
        <CategoryList categoryList={categoryList} />
        <ProductList productList={productList} />
        <ProductListwc productList={productList} />
        <Footer />

        {/* Install PWA Banner */}
        {showInstallBanner && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
            <span>Install our app for the best experience!</span>
            <Button onClick={installPWA} className="bg-primary text-white">
              Install
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
