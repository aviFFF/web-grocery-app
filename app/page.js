"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "./_components/Footer";
import GlobalApi from "./utils/GlobalApi";
import Link from "next/link";
import InstallApp from "./_components/downloadApp";
import ProductListfortynine from "./_components/productlistfortynine";
import Image from "next/image";
import ProductListHundredToTwoK from "./_components/ProductListHundredToTwoK";

// Dynamic imports
const Slider = dynamic(() => import("./_components/Slider"), { ssr: false });
const CategoryList = dynamic(() => import("./_components/CategoryList"), { ssr: false });
const ProductList = dynamic(() => import("./_components/ProductList"), { ssr: false });
const ProductListwc = dynamic(() => import("./_components/ProductListwc"), { ssr: false });
const ProductListninenine = dynamic(() => import("./_components/productlistunderninenine"), { ssr: false });

// // Loading Component
// const Loader = () => (
//   <div className="flex items-center justify-center h-screen">
//     <Image src="/loader.gif" alt="Loading..." width={100} height={100} />
//   </div>
// );

export default function Home() {
  const [pincode, setPincode] = useState("");
  const [sliders, setSliders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading

  useEffect(() => {
    async function fetchData() {
      try {
        const slidersData = await GlobalApi.getSliders();
        const productsData = await GlobalApi.getAllProducts();
        setSliders(slidersData || []);
        setProducts(productsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500); // Simulate delay for smooth transition
      }
    }
    fetchData();
  }, []);

  // if (isLoading) return <Loader />; // Show loader until page loads completely

  return (
    <div className="md:p-4 p-5 md:px-16">
      {/* Components */}
      <Slider sliderList={sliders} />
      <CategoryList pincode={pincode} /> 
      <ProductListfortynine productList={products} />
      <ProductListninenine productList={products} />
      <ProductList productList={products} />
      <ProductListHundredToTwoK productList={products} />

      {/* WhatsApp Chat */}
      <div className="fixed bottom-14 right-1 transform -translate-y-1/2 z-50">
        <Link href="https://api.whatsapp.com/send?phone=919236532569" target="_blank" rel="noopener noreferrer">
          <Image src="/whatsapp.png" alt="WhatsApp" width={50} height={50} className="hover:scale-110 transition-transform duration-200" />
          <p className="text-center text-xs">Chat with us</p>
        </Link>
      </div>

      {/* Fixed Download App Section */}
      <div className="fixed bottom-0 left-0 right-0">
        <InstallApp />
      </div>
    </div>
  );
}
