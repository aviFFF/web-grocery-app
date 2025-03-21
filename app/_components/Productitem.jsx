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
    <Dialog>
      {/* Wrap the entire div with DialogTrigger */}
      <DialogTrigger asChild>
        <div
          className="relative p-2 md:p-3 flex flex-col items-center justify-center gap-2 border
          rounded-xl hover:shadow-md hover:scale-105 cursor-pointer overflow-hidden transition-all ease-in-out"
        >
          {/* Calculate the discount percentage */}
          {product?.sellingPrice &&
            product?.mrp &&
            product.mrp > product.sellingPrice && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white font-bold text-xs p-1 rounded">
                {Math.round(
                  ((product.mrp - product.sellingPrice) / product.mrp) * 100
                )}
                %
              </div>
            )}

          <Image
            src={product.imageUrl || "/fallback-image.png"}
            alt={product.name || "Product Image"}
            width={200}
            height={100}
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />

          <h2 className="font-bold text-xs md:text-sm">{product?.name}</h2>
          <h2 className="text-gray-500">{product?.itemQuantityType}</h2>
          <div className="flex items-center gap-1">
            {product?.sellingPrice !== product?.mrp ? (
              <>
                {product?.sellingPrice && (
                  <h2 className="text-xl font-bold">
                    ₹{product?.sellingPrice}
                  </h2>
                )}
                <h2 className="text-lg p-2 font-bold line-through text-red-400">
                  ₹{product?.mrp}
                </h2>
              </>
            ) : (
              <h2 className="text-lg font-bold">₹{product?.mrp}</h2>
            )}
          </div>

          <Button
            className="text-primary hover:text-white px-2 md:px-4 rounded-xl hover:bg-primary"
            variant="outline"
          >
            Add To Cart
          </Button>
        </div>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product?.name || "Product Details"}
          </DialogTitle>
          <DialogDescription>
            <ProductItemDetails product={product} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Productitem;
