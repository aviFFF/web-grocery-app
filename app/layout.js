"use client";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import "./globals.css";
import { Outfit} from 'next/font/google';
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdatecartContext";
import { useState } from "react";
import Footer from "./_components/Footer";

const outfit = Outfit({
  subsets: ['latin']
})

// export const metadata = {
//   title: 'My PWA App',
//   description: 'An example PWA built with Next.js',
// };

export default function RootLayout({ children }) {
  const params= usePathname();
  const [updateCart, setUpdateCart] = useState(false);
  const showHeader = params == '/create-a-account' ||  params == '/log-in' || params == '/orderPlaced'?false:true 
  const showFooter = params == '/create-a-account' ||  params == '/log-in' || params == '/orderPlaced' || params == '/vendororder' || params == '/'?false:true
  return (
    <html lang="en">
            <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={outfit.className}
      >
        <UpdateCartContext.Provider value ={{updateCart, setUpdateCart}}>
        {showHeader &&  <Header />}
         {children}
        <Toaster />
        </UpdateCartContext.Provider>
        {showFooter &&  <Footer/>}
      </body>
    </html>
  );
}
