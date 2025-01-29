"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPincodes } from "../utils/GlobalApi"; // Fetch pincodes from API
import { requestPermission, onMessageListener } from "../utils/firebase"; // Firebase notifications

const PincodeChecker = () => {
  const [pincode, setPincode] = useState(""); // Store user's pincode
  const [message, setMessage] = useState("Fetching your location..."); // Default message
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Request permission for Firebase notifications
    requestPermission();

    // Listen for notifications
    onMessageListener()
      .then((payload) => {
        console.log("Message received:", payload);
        alert(`New notification: ${payload.notification.title}`);
      })
      .catch((err) => console.log("Failed to receive message:", err));

    // Fetch available pincodes from API
    getPincodes().then((pincodes) => {
      fetchPincodeFromLocation(pincodes);
    });
  }, []);

  const fetchPincodeFromLocation = (availablePincodes) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Google API Key
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            const address = data.results.find((result) =>
              result.address_components.some((comp) =>
                comp.types.includes("postal_code")
              )
            );

            if (address) {
              const fetchedPincode = address.address_components.find((comp) =>
                comp.types.includes("postal_code")
              ).long_name;

              setPincode(fetchedPincode);
              validatePincode(fetchedPincode, availablePincodes);
            } else {
              showUnserviceableMessage("Unknown");
            }
          } catch (error) {
            console.error("Error fetching pincode:", error);
            showUnserviceableMessage("Unknown");
          }
        },
        () => {
          showUnserviceableMessage("Unknown");
        }
      );
    } else {
      showUnserviceableMessage("Unknown");
    }
  };

  const validatePincode = (fetchedPincode, availablePincodes) => {
    const foundPincode = availablePincodes.find(
      (item) => item.attributes.pins === fetchedPincode
    );

    if (foundPincode) {
      setMessage(foundPincode.attributes.message);
      sendFirebaseNotification(fetchedPincode, foundPincode.attributes.message);
    } else {
      showUnserviceableMessage(fetchedPincode);
    }
  };

  const sendFirebaseNotification = (pincode, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Service Availability", {
        body: `Service available for Pincode: ${pincode} - ${message}`,
      });
    }
  };

  const showUnserviceableMessage = (pincode) => {
    setMessage(`Coming soon to your location  ${pincode}`);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <h1 className="text-base text-primary">{message}</h1>
    </div>
  );
};

export default PincodeChecker;
