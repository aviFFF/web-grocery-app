'use client';
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isServicable, setIsServicable] = useState(null); // Servicability status
  const [validationMessage, setValidationMessage] = useState(""); // Message for user
  const [availablePincodes, setAvailablePincodes] = useState([]);
  const getPincodes = useMemo(() => GlobalApi.getPincodes, []);


  const router = useRouter();

  useEffect(() => {
    getPincodes().then((pincodes) => {
      setAvailablePincodes(pincodes); // Store pincodes
    });
  }, []);

  const handlePincodeChange = (e) => {
    const enteredPincode = e.target.value;
    setPincode(enteredPincode);

    // Validate only if the input is 6 digits
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
      // Reset state if pincode length is less than 6
      setIsServicable(null);
      setValidationMessage("");
    }
  };

  // Fetch user and JWT from session storage
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

  // Fetch cart items
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

  // Calculate subtotal
  useEffect(() => {
    const total = cartItemList.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(total.toFixed(2));
  }, [cartItemList]);

  // Calculate total amount (memoized)
  const totalAmount = useMemo(() => {
    const validSubtotal = parseFloat(subtotal) || 0;
    const tax = validSubtotal * 0.09; // 9% tax
    const shipping = 19; // Fixed shipping cost
    const otherFees = 5; // Example: miscellaneous fees
    const total = validSubtotal + tax + shipping + otherFees;
    return total.toFixed(2);
  }, [subtotal]);

  const handlePromoCodeApply = () => {
    if (isPromoApplied) {
      toast.error("Promo code already applied!");
      return;
    }
  
    // Simulate promo code application
    if (promoCode === "DISCOUNT10") {
      const discount = subtotal * 0.1;
      const newSubtotal = subtotal - discount;
      setSubtotal(newSubtotal.toFixed(2));
      setIsPromoApplied(true); // Prevent multiple applications
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code!");
    }
  };

  const onApprove = (data) => {
    const payload = {
      data: {
        paymentid: (data.paymentID || "Cash on Delivery").toString(),
        totalOrderValue: totalAmount,
        email:email,
        phone:phone,
        address:address,
        pincode:pincode,
        Orderitemlist:cartItemList,
        firstname:firstname,
        lastname:lastname,
        userid: user.id,
        status: "success",
      },
    };
    GlobalApi.createOrder(payload, jwt).then((resp) => {
      console.log(resp);
      toast.success("Order Placed Successfully!");
      cartItemList.forEach((item) => {
        GlobalApi.deleteCartItem(item.id, jwt);
        router.replace("/orderPlaced");
      })
    }).catch((err) => {
      console.error("Order creation failed:", err);
      toast.error("Failed to place order. Try again later.");
    });
  };
  

  return (
    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Shipping Address Section */}
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
        {validationMessage && (
          <p className={`mt-2 ${isServicable ? "text-green-500" : "text-red-500"}`}>
            {validationMessage}
          </p>
        )}
        <Input
          type="text"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-5"
          maxLength={10}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-5"
        />
      </div>

      {/* Order Summary Section */}
      <div className="p-5 border rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-5">Order Summary</h2>
        <div className="flex justify-between border-b border-gray-300 text-lg">
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
        <div className="flex justify-between border-b border-gray-300 text-lg">
          <span>Handling Fees</span>
          <span>₹5.00</span>
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

        {/* Proceed to Checkout Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="mt-5 w-full bg-primary text-white flex justify-center items-center gap-2"
              disabled={!firstname || !lastname || !address || !pincode || !phone || !email || !isServicable}
            >
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
              <Button>Pay Online</Button>
              <Button
                variant="outline"
                onClick={() => onApprove({ paymentID: "Cash on Delivery" })}
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
