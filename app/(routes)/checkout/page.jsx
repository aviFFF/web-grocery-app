'use client';
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
function Checkout() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [cartItemList, setCartItemList] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [pincode, setPincode] = useState();

  const router = useRouter();

  useEffect(() => {
    if (!jwt) {
      router.push("/log-in");
    }
    getCartItems();
  }, []);

  const getCartItems = async () => {
    const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
    setTotalCartItems(cartItemList_?.length);
    setCartItemList(cartItemList_);
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      total += element.amount;
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

  const handleCheckout = async () => {
    const totalAmount = calculateTotalAmount();
    try {
        const response = await axios.post('/api/paytm', {
            amount: totalAmount,
            userId: user.id,
            username,
            email,
            phone,
            address,
            pincode
        });
        const { txnToken, orderId, mid } = response.data;

        const config = {
            root: '',
            flow: 'DEFAULT',
            data: {
                orderId,
                token: txnToken,
                tokenType: 'TXN_TOKEN',
                amount: totalAmount
            },
            handler: {
                notifyMerchant: function (eventName, data) {
                    console.log('eventName:', eventName, 'data:', data);
                }
            }
        };

        window.Paytm.CheckoutJS.init(config)
            .then(() => {
                window.Paytm.CheckoutJS.invoke();
            })
            .catch((error) => {
                console.error('Error in Paytm checkout:', error);
            });
    } catch (error) {
        console.error('Checkout error:', error);
    }
};

  return (
    <div className="p-3 bg-white text-xl font-bold text-center">
      <Head>
  <script
    type="application/javascript"
    src={`https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
  ></script>
</Head>


      <h2>Checkout</h2>
      <div className="p-5 px-5 md:px-10 grid grid-col-1 md:grid-cols-3 py-8">
        <div className="md:col-span-2 mx-10 my-5 md:mx-20">
          <h2 className="font-bold text-left text-3xl">Billing Details</h2>
          <div className="grid md:grid-cols-2 font-thin gap-10 mt-3">
            <Input
              className="p-2 border"
              type="text"
              placeholder="Name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="p-2 border"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid font-thin grid-cols-2 gap-10 mt-3">
            <Input
              className="p-2 border"
              type="tel"
              placeholder="Mobile"
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              className="p-2 border"
              type="text"
              placeholder="Pincode"
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <div className="mt-3 font-thin">
            <Input
              className="p-2 border w-full"
              type="text"
              placeholder="Address with Landmark"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-5 md:mx-10 border">
          <h2 className="p-3 bg-gray-200 font-bold text-center">
            Total Cart ({totalCartItems})
          </h2>
          <div className="p-4 flex flex-col gap-4">
            <h2 className="font-bold text-base flex justify-between">
              Subtotal: <span>₹{subtotal}</span>
            </h2>
            <hr />
            <h2 className="flex font-normal text-base justify-between">
              Delivery: <span>₹19.00</span>
            </h2>
            <h2 className="flex font-normal text-base justify-between">
              Tax (9%): <span>₹{(subtotal * 0.09).toFixed(2)}</span>
            </h2>
            <h2 className="flex font-normal text-base justify-between">
              Handling: <span>₹5.00</span>
            </h2>
            <hr />
            <h2 className="font-bold flex justify-between">
              Total: <span>₹{calculateTotalAmount().toFixed(2)}</span>
            </h2>
            <Button
              className="p-2 bg-primary text-white flex justify-center items-center gap-2"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
