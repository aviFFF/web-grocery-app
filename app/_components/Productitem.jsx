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
          className="relative p-2 md:p-5 overflow-auto flex flex-col items-center justify-center gap-3 border
          rounded-xl hover:shadow-md hover:scale-105 cursor-pointer transition-all ease-in-out"
        >
          {/* Calculate the discount percentage */}
          {product?.attributes?.sellingPrice &&
            product?.attributes?.mrp &&
            product.attributes.mrp > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white font-bold text-xs p-1 rounded">
                {Math.round(
                  ((product.attributes.mrp - product.attributes.sellingPrice) /
                    product.attributes.mrp) *
                    100
                )}
                %
              </div>
            )}

          <Image
            src={
              product?.attributes?.image?.data?.[0]?.attributes?.url ||
              "/path/to/fallback-image.png"
            }
            alt={product?.attributes?.name || "Default Alt Text"}
            width={200}
            height={100}
          />

          <h2 className="font-bold text-xs md:text-sm">
            {product?.attributes?.name}
          </h2>
          <h2 className="text-gray-500">
            {product?.attributes?.itemQuantityType}
          </h2>
          <div className="flex items-center gap-2">
            {product?.attributes?.sellingPrice && (
              <h2>₹{product?.attributes?.sellingPrice}</h2>
            )}
            <h2
              className={`font-bold ${
                product?.attributes?.sellingPrice
                  ? "line-through text-gray-400"
                  : ""
              }`}
            >
              {product?.attributes?.mrp}
            </h2>
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
          <DialogTitle>{product?.attributes?.name || "Product Details"}</DialogTitle>
          <DialogDescription>
            <ProductItemDetails product={product} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Productitem;
