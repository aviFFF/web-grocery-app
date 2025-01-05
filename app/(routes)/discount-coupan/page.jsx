import Image from "next/image";
import Link from "next/link";
import React from "react";

const DiscountPage = () => {
  return (
    <div className="bg-gray-50 text-center p-8 font-sans">
      {/* Banner Section */}
      <div className="mb-6">
        <img
          src="/Discount.giff"
          alt="Discount Promo"
          className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          width={800}
          height={400}

        />
      </div>

      {/* Content Section */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Grab Your 10% Discount!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Use the promo code <span className="font-bold text-orange-500">BUZZAT005</span> 
          at checkout and get 5% off on your complete order amount. Don't miss this amazing deal!
        </p>
        <Link href="/">
        <button className="bg-primary text-white py-2 px-6 rounded-full text-lg hover:bg-orange-600 transition-all">
          Shop Now
        </button>
        </Link>
      </div>
    </div>
  );
};

export default DiscountPage;
