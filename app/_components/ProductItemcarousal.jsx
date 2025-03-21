"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";

const ProductCarousel = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-lg">
        <Image
          width={100}
          height={30}
          src={images[currentIndex]}
          alt={altText}
          className="w-full h-[150px] md:h-full object-contain"
        />
      </div>
      {/* Navigation buttons */}
      <Button
        onClick={handlePrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-lg z-10"
      >
        <MdKeyboardArrowLeft className="text-xl" />
      </Button>
      <Button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-lg z-10"
      >
        <MdKeyboardArrowRight className="text-xl" />
      </Button>
      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
