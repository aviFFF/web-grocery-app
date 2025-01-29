"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Sliders({ sliderList }) {
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the active slide

  // Effect to handle automatic sliding every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderList.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 2-second interval

    return () => clearInterval(interval); // Clean up on component unmount
  }, [sliderList.length]);

  return (
    <Carousel className="relative overflow-hidden">
      <CarouselContent
        className="relative flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliderList.map((slider, index) => (
          <CarouselItem
            key={index}
            className="w-full flex-shrink-0"
          >
            <Image
              src={slider?.attributes?.image?.data?.attributes?.url}
              width={900}
              height={500}
              alt="image"
              className="w-full md:h-[300px] border border-gray-400 mt-10 sm:mt-2 h-[150px] rounded-xl"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      </Carousel>
  );
}

export default Sliders;
