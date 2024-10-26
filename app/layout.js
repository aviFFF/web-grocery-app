"use client";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import "./globals.css";
import { Outfit} from 'next/font/google';
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdatecartContext";
import { useState } from "react";

const outfit = Outfit({
  subsets: ['latin']
})

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const params= usePathname();
  const [updateCart, setUpdateCart] = useState(false);
  const showHeader = params == '/create-a-account' ||  params == '/log-in'?false:true 
  return (
    <html lang="en">
      <body
        className={outfit.className}
      >
        <UpdateCartContext.Provider value ={{updateCart, setUpdateCart}}>
        {showHeader &&  <Header />}
         {children}
        <Toaster />
        </UpdateCartContext.Provider>
      </body>
    </html>
  );
}
