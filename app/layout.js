"use client";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import "./globals.css";
import { Outfit } from 'next/font/google';
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdatecartContext";
import { useState } from "react";
import Footer from "./_components/Footer";

const outfit = Outfit({
  subsets: ['latin']
});

export default function RootLayout({ children }) {
  const params = usePathname();
  const [updateCart, setUpdateCart] = useState(false);

  // Determine which manifest file to use based on the route
  const manifestPath = params?.startsWith("/vendor") 
    ? "/vendor/manifest.json" 
    : "/manifest.json";

  const showHeader = ![
    "/create-a-account",
    "/log-in",
    "/vendor-signup",
    "/vendor",
    "/vendor-order",
    "/orderPlaced"
  ].includes(params);

  const showFooter = ![
    "/create-a-account",
    "/log-in",
    "/orderPlaced",
    "/vendor-signup",
    "/vendor",
    "/vendor-order",
    "/"
  ].includes(params);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href={manifestPath} />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={outfit.className}>
        <UpdateCartContext.Provider value={{ updateCart, setUpdateCart }}>
          {showHeader && <Header />}
          {children}
          <Toaster />
        </UpdateCartContext.Provider>
        {showFooter && <Footer />}
      </body>
    </html>
  );
}
