import { createContext, useContext, useState, useEffect } from "react";

const PincodeContext = createContext();

export const PincodeProvider = ({ children }) => {
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const savedPincode = localStorage.getItem("servicedPincode");
    if (savedPincode) setPincode(savedPincode);
  }, []);

  return (
    <PincodeContext.Provider value={{ pincode, setPincode }}>
      {children}
    </PincodeContext.Provider>
  );
};

export const usePincode = () => useContext(PincodeContext);
