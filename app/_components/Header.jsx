"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, UserIcon } from "lucide-react";
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
    const initializeState = async () => {
      const storedJwt = sessionStorage.getItem("jwt");
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
  
      if (storedJwt && storedUser) {
        setJwt(storedJwt);
        setUser(storedUser);
        setIsLogin(true);
        await fetchCartItems(storedUser, storedJwt); // Ensure cart items are fetched after state updates
      } else {
        setIsLogin(false);
        setUser(null);
        setJwt(null);
        setTotalCartItems(0); // Clear cart info if not logged in
        setCartItemList([]);
      }
    };
  
    initializeState();
  }, []); // Runs only on initial render
  
  const fetchCartItems = async (user, jwt) => {
    if (user?.id && jwt) {
      try {
        const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
        setCartItemList(cartItemList_);
        setTotalCartItems(cartItemList_.length || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      console.log("User is not logged in.");
    }
  };
  
  // Update cart when `updateCart` changes
  useEffect(() => {
    if (user && jwt) {
      fetchCartItems(user, jwt);
    }
  }, [updateCart]); // Ensure `fetchCartItems` only runs when necessary
  

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
      total += element.amount;
    });
    setSubtotal(total.toFixed(2));
  }, [cartItemList]); // Triggered on every change in `cartItemList`
  

  return (
    <div className="p-4 flex justify-between items-center gap-5 sticky z-50 bg-white top-0 shadow-lg">
      {/* Logo */}
       <Link href="/">
        <Image
          src="/BUZZATo-logo.png"
          alt="logo"
          width={500}
          height={200}
          className="rounded-xl md:w-48  w-[5.5rem] justify-center cursor-pointer"
        />
      </Link>
      <PincodeSearchPopup className="justify-center" />
      <ProductSearch className="justify-center" />
      <div className="flex items-center justify-center gap-5">
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
                  disabled={!totalCartItems}
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
              <Link href="/my-orders"><DropdownMenuItem className="cursor-pointer">
                My Orders
              </DropdownMenuItem>
              </Link>
              
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
