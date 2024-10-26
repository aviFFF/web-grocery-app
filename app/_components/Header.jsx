"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalApi from "../utils/GlobalApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdateCartContext } from "../_context/UpdatecartContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemList from "./CartItemList";
import { toast } from "sonner";
import ProductSearch from "./ProductSearch";
import PincodeSearchPopup from "./PincodeSearch";


function Header() {
  const [categoryList, setCategoryList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [cartItemList, setCartItemList] = useState([]);
  const router = useRouter();


  useEffect(() => {
    // Fetch cart items based on user authentication and other conditions
    const fetchCartItems = async () => {
      if (user && user.id && jwt) {
        const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
        setCartItemList(cartItemList_);
        setTotalCartItems(cartItemList_.length);
        setUpdateCart(!updateCart); // Trigger re-render
      }
    };

    fetchCartItems();
  }, [user, jwt, updateCart]);

  useEffect(() => {
    const storedJwt = sessionStorage.getItem("jwt");
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    setIsLogin(!!storedJwt);
    setUser(storedUser);
    setJwt(storedJwt);
  }, []);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    getCartItems();
  }, 
  [updateCart]);

  // Get Category List
  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.data.data);
    });
  };
  // Use to Get Total cart Item
  const getCartItems = async () => {
    if (user && user.id) {
      // Ensure user is logged in and has an id
      try {
        const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
        console.log(cartItemList_);
        setTotalCartItems(cartItemList_?.length);
        setCartItemList(cartItemList_);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      console.log("User is not logged in.");
      setTotalCartItems(0); // Optionally reset the cart item count
      setCartItemList([]); // Optionally clear the cart item list
    }
  };

  const onLogOut = () => {
    sessionStorage.clear();
    router.push("log-in");
  };

  const onDeleteItem = (id) => {
    GlobalApi.deleteCartItem(id, jwt).then((resp) => {
      toast("Item Deleted");
      setUpdateCart(!updateCart);
    });
  };
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let total = 0;
    cartItemList.forEach((element) => {
      total = total + element.amount;
    });
    setSubtotal(total.toFixed(2));
  }, [cartItemList]);


  return (
    <div className="p-4 flex justify-between items-center gap-5 sticky z-50 bg-white top-0 shadow-lg">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/newlogo.png"
          alt="logo"
          width={50}
          height={20}
          className="rounded-xl md:w-20  cursor-pointer"
        />
      </Link>
      <PincodeSearchPopup/>
      <ProductSearch/>
      <div className="flex items-center gap-5">
        <Sheet>
          <SheetTrigger>
            <h2 className="relative flex gap-1 items-center text-lg">
              <ShoppingBag className="w-7 h-7 cursor-pointer " />
              <span className="absolute -top-2 -right-2 rounded-full bg-primary text-white w-[20px] h-[20px] flex items-center justify-center text-xs">
                {totalCartItems}
              </span>
            </h2>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-lg font-bold bg-primary text-white p-2">
                My Cart
              </SheetTitle>
              <SheetDescription>
                <CartItemList
                  cartItemList={cartItemList}
                  onDeleteItem={onDeleteItem}
                />
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <div className="absolute flex flex-col w-[90%] p-2 bottom-0">
                <h2 className=" flex font-bold text-lg justify-between">
                  Subtotal
                  <span>₹{subtotal}</span>
                </h2>
                <Button
                  onClick={() => router.push(jwt ? "/checkout" : "/log-in")}
                >
                  Checkout
                </Button>
              </div>
            </SheetClose>
          </SheetContent>
        </Sheet>
        {!isLogin ? (
          <Link href="/log-in">
            <UserIcon className="w-7 h-7 cursor-pointer" />
          </Link>
        ) : (
          <DropdownMenu asChild>
            <DropdownMenuTrigger>
              <UserIcon className="w-7 h-7 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="cursor-pointer">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onLogOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Header;
