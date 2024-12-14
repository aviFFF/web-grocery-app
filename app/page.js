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
import { messaging } from './firebase-config';
import { onMessage } from 'firebase/messaging';
import { requestPermission } from './utils/notification';
import { saveFCMToken } from './utils/GlobalApi';

export default function Home() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Fetch Slider, Categories, and Products
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

  // Handle PWA Install Banner
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

  // Register Service Worker and Handle FCM Notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const fcmToken = await requestPermission(); // Request FCM permission and get the token
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          await saveFCMToken(fcmToken); // Save the token to your backend
        }
      } catch (error) {
        console.error('Service Worker registration or notification setup failed:', error);
      }
    };

    initializeNotifications();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      alert(`Notification: ${payload.notification.title} - ${payload.notification.body}`);
    });

    return () => unsubscribe();
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
  );
}
