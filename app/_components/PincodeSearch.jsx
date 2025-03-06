"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllPincodes, getProductsByPincode } from "../utils/GlobalApi"; // API functions
import { Input } from "@/components/ui/input";

const PincodeSearchPopup = () => {
  const router = useRouter();
  const [pincode, setPincode] = useState(""); // Input value
  const [availablePincodes, setAvailablePincodes] = useState([]); // All pincodes
  const [message, setMessage] = useState(""); // Service message
  const [showPopup, setShowPopup] = useState(false); // Show popup
  const [servicedPincode, setServicedPincode] = useState(""); // Stored pincode
  const [serviceMessage, setServiceMessage] = useState(""); // Stored message
  const [error, setError] = useState(""); // State for errors (empty/wrong pincode)

  useEffect(() => {
    const savedPincode = localStorage.getItem("servicedPincode");
    const savedMessage = localStorage.getItem("serviceMessage");

    if (savedPincode && savedMessage) {
      setServicedPincode(savedPincode);
      setServiceMessage(savedMessage);
    } else {
      setShowPopup(true);
    }

    getAllPincodes().then((pincodes) => setAvailablePincodes(pincodes));
  }, []);

  const handleSearch = async () => {
    if (!pincode.trim()) {
      setError("Please enter your pincode.");
      return;
    }
  
    const vendors = await getAllPincodes();
    let foundMessage = null;
    let matchingVendorIds = [];
  
    vendors.forEach((vendor) => {
      if (vendor.service_pincodes.includes(pincode)) {
        foundMessage = vendor.delmessage;
        matchingVendorIds.push(vendor.id);
      }
    });
  
    if (foundMessage) {
      setMessage(foundMessage);
      localStorage.setItem("servicedPincode", pincode);
      localStorage.setItem("serviceMessage", foundMessage);
      localStorage.setItem("vendorIds", JSON.stringify(matchingVendorIds));
      setError("");
      setShowPopup(false);
  
      // Redirect to homepage and force reload
      router.replace("/"); // Ensure navigation to homepage
      setTimeout(() => {
        window.location.href = "/"; // Force reload the page
      }, 100);
    } else {
      setError("Service is not available for this pincode.");
      setMessage("");
    }
  };


  const handleChangePincode = (e) => {
    e.stopPropagation();
    setShowPopup(true);
    setMessage("");
    setPincode("");
    setError("");
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 px-8 rounded-lg bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Check Service Availability</h2>

            <Input
              inputMode="numeric"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter your pincode"
              className="border p-2 rounded-lg w-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={6}
            />

            <button
              onClick={handleSearch}
              className="search-btn bg-primary text-white px-4 py-2 mt-4 w-full rounded"
            >
              Check
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          </div>
        </div>
      )}

      {servicedPincode && (
        <div className="mt-0">
          <p className="md:text-base text-xs text-nowrap text-primary font-semibold">
            {serviceMessage} For {servicedPincode}
          </p>
          <button
            onClick={handleChangePincode}
            className="text-blue-500 md:text-sm text-xs mt-2"
          >
            Change Pincode
          </button>
        </div>
      )}
    </>
  );
};

export default PincodeSearchPopup;
