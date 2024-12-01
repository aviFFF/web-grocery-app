'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Slider from "./_components/Slider";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import ProductListwc from "./_components/ProductListwc";
import GlobalApi from "./utils/GlobalApi";
import { IoIosNotificationsOutline } from "react-icons/io";



function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function Home() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log("User subscribed to push notifications:", subscription);

      await GlobalApi.sendSubscriptionToServer(subscription); // Backend call
      setIsSubscribed(true); // Update UI state
      alert("Subscribed successfully!");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to subscribe to notifications. Please try again.");
    }
  };

  const unsubscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        console.log("User unsubscribed from push notifications");
      }

      setIsSubscribed(false); // Update UI state
      alert("Unsubscribed successfully!");
    } catch (error) {
      console.error("Unsubscription failed:", error);
      alert("Failed to unsubscribe from notifications. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        <p className="text-green-600 mt-4 text-xl font-semibold">Welcome to Groapp</p>
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

      <div className="notification-container">
  {!isSubscribed && (
    <div className="notification-icon" onClick={subscribeUser}>
      <IoIosNotificationsOutline size={20} />
    </div>
  )}
  {isSubscribed && (
    <div className="notification-box hidden">
      <Button onClick={unsubscribeUser}>Unsubscribe</Button>
    </div>
  )}
</div>

    </div>
  );
}
