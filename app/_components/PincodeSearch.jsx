"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPincodes } from "../utils/GlobalApi"; // Adjust path
import { requestPermission, onMessageListener } from "../utils/firebase"; // Import Firebase functions

const PincodeChecker = () => {
  const [pincode, setPincode] = useState(""); // Store fetched pincode
  const [message, setMessage] = useState(""); // Store serviceability message
  const router = useRouter(); // Next.js router for redirection

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Request permission for Firebase notifications
    requestPermission();

    // Listen for incoming notifications
    onMessageListener()
      .then((payload) => {
        console.log("Message received:", payload);
        alert(`New notification: ${payload.notification.title}`);
      })
      .catch((err) => console.log("Failed to receive message:", err));

    // Fetch available pincodes from Strapi
    let availablePincodes = [];
    const fetchAvailablePincodes = async () => {
      const pincodes = await getPincodes();
      availablePincodes = pincodes;
    };
    fetchAvailablePincodes();

    // Fetch user's location and pincode
    const fetchPincodeFromLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Your Google API Key
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

                setPincode(fetchedPincode); // Set the fetched pincode
                validatePincode(fetchedPincode, availablePincodes); // Validate the pincode
              } else {
                redirectToUnserviceablePage(); // Redirect if pincode is not fetched
              }
            } catch (error) {
              console.error("Error fetching pincode:", error);
              redirectToUnserviceablePage(); // Redirect on error
            }
          },
          () => {
            redirectToUnserviceablePage(); // Redirect if location access is denied
          }
        );
      } else {
        redirectToUnserviceablePage(); // Redirect if geolocation is unsupported
      }
    };

    const validatePincode = (fetchedPincode, pincodes) => {
      const foundPincode = pincodes.find(
        (item) => item.attributes.pins === fetchedPincode
      );

      if (foundPincode) {
        const { message: pinMessage } = foundPincode.attributes;
        setMessage(pinMessage);
        sendFirebaseNotification(fetchedPincode, pinMessage); // Trigger notification
      } else {
        redirectToUnserviceablePage(); // Redirect if pincode is not serviceable
      }
    };

    const sendFirebaseNotification = (pincode, message) => {
      const notificationData = {
        title: "Service Availability",
        body: `Service available for Pincode: ${pincode} - ${message}`,
      };

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notificationData.title, {
          body: notificationData.body,
        });
      }
    };

    const redirectToUnserviceablePage = () => {
      router.push("/"); // Redirect to "Coming Soon" page
    };

    fetchPincodeFromLocation();
  }, [router]);

  return (
    <div className="flex items-center justify-center">
      {message ? (
        <h1 className="text-sm md:text-base text-primary">
          {message} for Pincode: {pincode}
        </h1>
      ) : (
        <h1 className="text-sm text-gray-600">Fetching your location...</h1>
      )}
    </div>
  );
};

export default PincodeChecker;
