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
import Head from 'next/head';
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOh9RZDYm4NrmY9kyI0bhz62gSEubZFek",
  authDomain: "my-new-project-39060.firebaseapp.com",
  projectId: "my-new-project-39060",
  storageBucket: "my-new-project-39060.firebasestorage.app",
  messagingSenderId: "987658077245",
  appId: "1:987658077245:web:7f7d63d2148d7c5d505654",
  measurementId: "G-XW38C6NHGV"
};

// Initialize Firebase
let messaging;
if (typeof window !== "undefined") {
  const firebaseApp = initializeApp(firebaseConfig);
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(firebaseApp);
    } else {
      console.warn("Firebase Messaging is not supported on this browser.");
    }
  });
}

export default function Home() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        alert(`Notification: ${payload.notification.title} - ${payload.notification.body}`);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
  

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

  // Request Notification Permission and Subscribe
  const requestNotificationPermission = async () => {
    if (messaging) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.VAPID_PUBLIC_KEY,
          });

          if (token) {
            console.log("FCM Token:", token);
            await GlobalApi.sendSubscriptionToServer({ token }); // Backend call to save the token
            setIsSubscribed(true);
            alert("Subscribed successfully!");
          } else {
            console.log("No FCM token available.");
          }
        } catch (error) {
          console.error("Error getting FCM token:", error);
          alert("Failed to subscribe. Please try again.");
        }
      } else {
        alert("Notifications permission is denied.");
      }
    } else {
      console.error("Firebase Messaging is not initialized or not supported.");
    }
  };

  // Listen to Incoming Messages
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        setNotification(payload.notification);
      });
    }
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

        {/* Notification subscription */}
        <div className="notification-container">
          {!isSubscribed && (
            <div className="notification-icon" onClick={requestNotificationPermission}>
              <IoIosNotificationsOutline size={20} />
            </div>
          )}
          {notification && (
            <div className="notification-popup bg-gray-100 p-4 rounded shadow-lg">
              <h4>{notification.title}</h4>
              <p>{notification.body}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
