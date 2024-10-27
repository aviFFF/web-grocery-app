'use client';
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

function Checkout() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 }); // Latitude and Longitude for Google Maps

  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
  });

  useEffect(() => {
    const storedJwt = sessionStorage.getItem("jwt");
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    if (storedUser && storedJwt) {
      setUser(storedUser);
      setJwt(storedJwt);
    } else {
      router.push("/log-in");
    }
  }, [router]);

  useEffect(() => {
    if (user && jwt) {
      getCartItems();
    }
  }, [user, jwt]);

  const getCartItems = async () => {
    try {
      const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
      setTotalCartItems(cartItemList_?.length);
      setCartItemList(cartItemList_);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((item) => {
      total += item.amount;
    });
    setSubtotal(total.toFixed(2));
  }, [cartItemList]);

  const calculateTotalAmount = () => {
    const validSubtotal =
      typeof subtotal === "number" ? subtotal : parseFloat(subtotal) || 0;
    const tax = validSubtotal * 0.09;
    const totalAmount = validSubtotal + tax + 19 + 5;
    return parseFloat(totalAmount.toFixed(2));
  };

  const fetchCoordinates = async (pincode) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
      } else {
        console.error("No results found for the entered pincode.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    if (value.length === 6) {
      fetchCoordinates(value);
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Shipping Address Section */}
      <div className="md:col-span-2 p-5 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-5">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-5">
          <Input
            className="p-2 border"
            type="text"
            placeholder="First Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="p-2 border"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <Input
          className="p-2 border mt-5"
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-5 mt-5">
          <Input
            className="p-2 border"
            type="text"
            placeholder="City"
          />
          <Input
            className="p-2 border"
            type="text"
            placeholder="Province"
          />
        </div>
        <Input
          className="p-2 border mt-5"
          type="text"
          placeholder="Postal Code"
          value={pincode}
          onChange={handlePincodeChange}
        />
        
        {/* Google Map Display */}
        {isLoaded ? (
          <div className="mt-5" style={{ height: '300px', width: '100%' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              zoom={12}
              center={location}
            >
              <Marker position={location} />
            </GoogleMap>
          </div>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="p-5 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-5">Order Summary</h2>
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Tax (9%)</span>
          <span>₹{(subtotal * 0.09).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Shipping</span>
          <span>₹19.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-5">
          <span>Total</span>
          <span>₹{calculateTotalAmount()}</span>
        </div>


  {/* Promo Code Section */}
  <div className="mt-5">
          <h2 className="font-semibold text-lg mb-2">Apply a Promo Code</h2>
          <div className="flex">
            <Input
              className="flex-1 p-2 border"
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button className="ml-2 bg-primary text-white">APPLY</Button>
          </div>
        </div>
        {/* Proceed to Checkout Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-5 w-full bg-primary text-white flex justify-center items-center gap-2">
              Proceed to Checkout
              <ArrowBigRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Payment Method</DialogTitle>
              <DialogDescription>
                Please select one of the following payment methods:
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-4">
              <Button onClick={() => router.push("/payment")}>
                Pay Online
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/cash-on-delivery")}
              >
                Cash on Delivery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Checkout;
