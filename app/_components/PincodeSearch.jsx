import React, { useState, useEffect } from "react";
import { getPincodes } from "../utils/GlobalApi"; // Adjust the path to your globalapi file
import { Input } from "@/components/ui/input";

const PincodeSearchPopup = ({onValidation}) => {
  const [pincode, setPincode] = useState(""); // To store the input value
  const [availablePincodes, setAvailablePincodes] = useState([]); // To store the fetched pincodes
  const [message, setMessage] = useState(""); // To store the message for the user
  const [showPopup, setShowPopup] = useState(false); // To control popup visibility
  const [servicedPincode, setServicedPincode] = useState(""); // To store the serviced pincode
  const [serviceMessage, setServiceMessage] = useState(""); // To store the service message
  const [pincodeNotEntered, setPincodeNotEntered] = useState(false); // To track if no pincode was entered

  useEffect(() => {
    const savedPincode = localStorage.getItem("servicedPincode");
    const savedMessage = localStorage.getItem("serviceMessage");
    if (savedPincode && savedMessage) {
      setServicedPincode(savedPincode); 
      setServiceMessage(savedMessage); 
    } else {
      setShowPopup(true); 
    }

    // Fetch available pincodes from Strapi
    getPincodes().then((pincodes) => {
      setAvailablePincodes(pincodes); 
    });
  }, []);

  const handleSearch = () => {
    const foundPincode = availablePincodes.find(
      (item) => item.attributes.pins === pincode
    );

    if (foundPincode) {
      const { message: pinMessage } = foundPincode.attributes;
      setMessage(pinMessage);
      localStorage.setItem("servicedPincode", pincode);
      localStorage.setItem("serviceMessage", pinMessage);
      setServicedPincode(pincode);
      setServiceMessage(pinMessage);
      setShowPopup(false);
      setPincodeNotEntered(false);
      
      // Notify parent about validation success
      if (onValidation) onValidation(true, pincode, pinMessage);
    } else {
      setMessage("Oops! We will be coming soon in your area.");
      // Notify parent about validation failure
      if (onValidation) onValidation(false, pincode, "Not Serviced");
    }
  };

  const handleChangePincode = (e) => {
    e.stopPropagation(); 
    setShowPopup(true); 
    setMessage(""); 
    setPincode(""); 
    setPincodeNotEntered(false); // Reset this state when changing the pincode
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    if (!pincode) { // Check if no pincode was entered
      setPincodeNotEntered(true); // Set this to true if no pincode was entered
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 px-8 rounded-lg bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-4">
              Check Service Availability
            </h2>
            
            {/* Close button */}
            <button 
              onClick={handleClosePopup} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

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
            {message && <p className="mt-4 text-lg">{message}</p>}
          </div>
        </div>
      )}

      {(servicedPincode || pincodeNotEntered) && (
        <div className="mt-2">
          {pincodeNotEntered ? (
            <p className="md:text-base text-xs text-nowrap text-red-500 font-semibold">
              Please select the pincode.
            </p>
          ) : (
            <p className="md:text-base text-xs text-nowrap text-primary font-semibold">
              {serviceMessage} For {servicedPincode}
            </p>
          )}
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
