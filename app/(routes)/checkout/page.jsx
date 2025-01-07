'use client';

import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden
import { Loader2 } from "lucide-react"; // Import the spinner icon

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

function Checkout() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [cartItemList, setCartItemList] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isServicable, setIsServicable] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [availablePincodes, setAvailablePincodes] = useState([]);
  const getPincodes = useMemo(() => GlobalApi.getPincodes, []);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isCODLoading, setIsCODLoading] = useState(false); // Add state for loading spinner on COD button

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && totalCartItems === 0) {
      router.replace("/");
    }
  }, [isLoading, totalCartItems, router]);

  useEffect(() => {
    getPincodes().then((pincodes) => setAvailablePincodes(pincodes));
  }, []);

  const handlePincodeChange = (e) => {
    const enteredPincode = e.target.value;
    setPincode(enteredPincode);

    if (enteredPincode.length === 6) {
      const foundPincode = availablePincodes.find(
        (item) => item.attributes.pins === enteredPincode
      );
      if (foundPincode) {
        const { message: pinMessage } = foundPincode.attributes;
        setIsServicable(true);
        setValidationMessage(pinMessage);
      } else {
        setIsServicable(false);
        setValidationMessage("Oops! We will be coming soon in your area.");
      }
    } else {
      setIsServicable(null);
      setValidationMessage("");
    }
  };

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
      setIsLoading(false); // Stop loader after cart items are fetched
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    const total = cartItemList.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(total.toFixed(2));
  }, [cartItemList]);

  const deliveryFee = useMemo(() => {
    if (subtotal < 300) return 25;
    if (subtotal >= 300 && subtotal <= 500) return 9.5;
    return 0;
  }, [subtotal]);

  const handlingFee = useMemo(() => {
    return subtotal < 1000 ? 9 : 19;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    const validSubtotal = parseFloat(subtotal) || 0;
    return (validSubtotal + deliveryFee + handlingFee).toFixed(2);
  }, [subtotal, deliveryFee, handlingFee]);

  const handlePromoCodeApply = () => {
    if (isPromoApplied) {
      toast.error("Promo code already applied!");
      return;
    }
    if (promoCode === "BUZZAT10") {
      const discount = subtotal * 0.1;
      const newSubtotal = subtotal - discount;
      setSubtotal(newSubtotal.toFixed(2));
      setIsPromoApplied(true);
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code!");
    }
  };

  const onApprove = async (data) => {
    try {
      setIsCODLoading(true); // Start the spinner

      const payload = {
        data: {
          paymentid: data.paymentID || "Cash on Delivery",
          totalOrderValue: totalAmount,
          city: city,
          phone: phone,
          address: address,
          pincode: pincode,
          Orderitemlist: cartItemList,
          firstname: firstname,
          lastname: lastname,
          userid: user.id,
          status: "success",
        },
      };

      const response = await GlobalApi.createOrder(payload, jwt);
      toast.success("Order Placed Successfully!");

      // Clear cart items after order is placed
      await Promise.all(
        cartItemList.map((item) => GlobalApi.deleteCartItem(item.id, jwt))
      );

      router.replace("/orderPlaced");
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again later.");
    } finally {
      setIsCODLoading(false); // Stop the spinner
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-5 grid grid-cols-1 pt-10 md:grid-cols-3 gap-5">
      <div className="md:col-span-2 p-5 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-5">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-5">
          <Input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <Input
          type="text"
          placeholder="Complete Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-5"
        />
        <Input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={handlePincodeChange}
          className="mt-5"
          maxLength={6}
        />
        <Input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-5"
        />
        <Input
          type="text"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-5"
          maxLength={10}
        />
        {validationMessage && (
          <p className={`mt-2 ${isServicable ? "text-green-500" : "text-red-500"}`}>
            {validationMessage}
          </p>
        )}
      </div>

      <div className="p-5 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-5">Order Summary</h2>
        <div className="flex justify-between border-b border-gray-300 text-lg">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 text-lg">
          <span>Handling Fee</span>
          <span>₹{handlingFee}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-5">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* Promo Code Section */}
        <div className="mt-5">
          <h2 className="font-semibold text-lg mb-2">Apply a Promo Code</h2>
          <div className="flex">
            <Input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handlePromoCodeApply} className="ml-2 bg-primary text-white">
              APPLY
            </Button>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="mt-5 w-full bg-primary text-white flex justify-center items-center gap-2"
              disabled={!firstname || !lastname || !address || !pincode || !phone || !city || !isServicable}
            >
              Proceed to Checkout
              <ArrowBigRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Choose Payment Method</DialogTitle>
              </VisuallyHidden>
              <DialogDescription>
                Proceed to checkout for secure online payment.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-4">
              <Button onClick={() => toast.info("Online Payment Coming Soon!")}>
                Pay Online
              </Button>
              <Button
                variant="outline"
                onClick={() => onApprove({ paymentID: "Cash on Delivery" })}
                disabled={isCODLoading}
              >
                {isCODLoading ? (
                  <Loader2 className="animate-spin w-5 h-5 text-green-500" />
                ) : (
                  "Cash on Delivery"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Checkout;
