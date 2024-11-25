'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import Slider from "./_components/Slider";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import ProductListwc from "./_components/ProductListwc";
import GlobalApi from "./utils/GlobalApi";

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
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchData() {
      const sliders = await GlobalApi.getSliders();
      const categories = await GlobalApi.getCategoryList();
      const products = await GlobalApi.getAllProducts();

      setSliderList(sliders || []); // Ensure it is an array
      setCategoryList(categories || []);
      setProductList(products || []);

      setIsLoading(false); // Set loading to false after data is fetched
    }

    fetchData();
  }, []);

  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('process.env.VAPID_PUBLIC_KEY'),
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log("User subscribed to push notifications:", subscription);
    setIsSubscribed(true);
    await GlobalApi.subscription();

  };

  const unsubscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log("User unsubscribed from push notifications");
    }

    setIsSubscribed(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        <p className="text-green-600 mt-4 text-xl font-semibold">Welcome to Groapp</p>
      </div>
    );
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registered:', registration);
    });
  }
  

  return (
    <div className="md:p-4 p-5 md:px-16">
      {/* Slider */}
      <Slider sliderList={sliderList} />
      {/* Category List */}
      <CategoryList categoryList={categoryList} />
      {/* Product List */}
      <ProductList productList={productList} />
      {/* Product List by category */}
      <ProductListwc productList={productList} />
      {/* Footer */}
      <Footer />

      {/* Push notification subscription button */}
      <div className="mt-4">
        {!isSubscribed ? (
          <Button onClick={subscribeUser}>Subscribe to Notifications</Button>
        ) : (
          <Button onClick={unsubscribeUser}>Unsubscribe from Notifications</Button>
        )}
      </div>
    </div>
  );
}
