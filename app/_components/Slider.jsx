import React from 'react'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  
function Sliders({sliderList}) {
  return (
    <Carousel>
  <CarouselContent>
    {sliderList.map((slider, index) => (
        <CarouselItem key={index}>
          <div className='flex gap-5 justify-between'>
            <Image
              src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + 
                slider?.attributes?.image?.data?.attributes?.url}
              width={1000}
              height={400}
              alt="image"
              className="w-1/2 pt-10 md:pt-2 md:h-[300px] h-[200px] object-fill rounded-2xl"
            />
            <Image
              src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + 
                slider?.attributes?.image?.data?.attributes?.url}
              width={1000}
              height={400}
              alt="image"
              className="w-1/2 pt-10 md:pt-2 md:h-[300px] h-[200px] object-fill rounded-2xl"
            />
            </div>
        </CarouselItem>
    ))}
    
  </CarouselContent>
</Carousel>
  )
}
export default Sliders
