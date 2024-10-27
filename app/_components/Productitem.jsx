import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetails from "./ProductItemDetails";

function Productitem({ product }) {
  return (
    <div
    className="relative p-2 md:p-5 flex flex-col text-nowrap items-center justify-center gap-3 border
      rounded-lg hover:shadow-md hover:scale-105 cursor-pointer transition-all ease-in-out"
  >
    {/* Calculate the discount percentage */}
    {product?.attributes?.sellingPrice && product?.attributes?.mrp && product.attributes.mrp > 0 && (
      <div className="absolute top-2 left-2 bg-orange-500 text-white font-bold text-xs p-1 rounded">
        {Math.round(
          ((product.attributes.mrp - product.attributes.sellingPrice) / product.attributes.mrp) * 100
        )}%
      </div>
    )}
    
    <Image
      src={product?.attributes?.image?.data[0]?.attributes?.url}
      alt={product?.attributes?.name}
      width={500}
      height={200}
      className="w-[100px] md:h-[100px] h-[50px] object-contain"
    />
    <h2 className="font-bold text-sm md:text-lg">
      {product?.attributes?.name}
    </h2>
    <h2 className="text-gray-500">{product?.attributes?.itemQuantityType}</h2>
    <div className="flex items-center gap-2">
      {product?.attributes?.sellingPrice && (
        <h2>₹{product?.attributes?.sellingPrice}</h2>
      )}
      <h2
        className={`font-bold ${
          product?.attributes?.sellingPrice ? "line-through text-gray-400" : ""
        }`}
      >
        {product?.attributes?.mrp}
      </h2>
    </div>  
      
      <Dialog>
        <DialogTrigger asChild>
            <Button
        className="text-primary hover:text-white px-2 md:px-4 hover:bg-primary"
        variant="outline"
      >
        Add To Cart
      </Button>
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <ProductItemDetails product={product} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Productitem;
