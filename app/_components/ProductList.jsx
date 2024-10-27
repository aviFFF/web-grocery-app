"use client";
import React, { useRef } from "react";
import Productitem from "./Productitem";
import { useState } from "react";
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";

function ProductList({ productList }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  const itemWidth = 200; // Adjust width based on your product card width
  const visibleItems = 1; // Number of visible items in a row (can adjust for mobile)

  // Get the total width of the product container
  const totalWidth = itemWidth * productList.length;

  // Scroll left handler
  const scrollLeft = () => {
    setScrollPosition((prevPosition) =>
      Math.max(prevPosition - itemWidth * visibleItems, 0)
    );
  };

  // Scroll right handler
  const scrollRight = () => {
    setScrollPosition((prevPosition) =>
      Math.min(
        prevPosition + itemWidth * visibleItems,
        totalWidth - carouselRef.current.offsetWidth
      )
    );
  };

  return (
    <div className="relative mt-5">
      <h2 className="text-primary text-2xl text-center mb-4 flex">
        Best Selling Products
      </h2>

      {/* Left Arrow */}
      <button 
      onClick={scrollLeft}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full">
        <IoIosArrowBack  />
      </button>

      {/* Product Items List */}
      <div className="overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {productList.map((product, index) => (
            <div key={product.id} className="min-w-[175px] p-4">
              {/* Using Productitem component for rendering individual product */}
              <Productitem key={index} product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button 
      onClick={scrollRight}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full">
        <IoIosArrowForward  />
      </button>
    </div>
  );
}

export default ProductList;
