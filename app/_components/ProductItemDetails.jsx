"use client";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import GlobalApi from "../utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdatecartContext";

function ProductItemDetails({ product }) {
  const jwt = sessionStorage.getItem('jwt');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const {updateCart, setUpdateCart} = useContext(UpdateCartContext)
  const [productTotalPrice, setProductTotalPrice] = useState(
    product.attributes.sellingPrice? 
    product.attributes.sellingPrice
      : product.attributes?.mrp
  )
  const router = useRouter();
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(false);


  const addToCart = () => {
    setLoading(true);
    if (!jwt) {
      router.push("/log-in");
      setLoading(false);
      return;
    }
      

    const data = {
      data: {
        quantity: productQuantity,
        amount: (productQuantity * productTotalPrice).toFixed(2),
        products: product.id,
        users_permissions_user: user.id,
        userId: user.id,
      }
    }
    console.log(data);
    GlobalApi.addToCart(data, jwt).then(resp => {
      console.log(resp);
      toast("Product Added To Cart");
      setUpdateCart(!updateCart);
      setLoading(false)
    }, (e) => {
      toast('Something went wrong');
      setLoading(false)
    });
  };

  return (
    <div className=" bg-white grid grid-cols-1 md:grid-cols-2">
      <Image
        src={
          product?.attributes?.image?.data[0]?.attributes?.url
        }
        alt={product?.attributes?.name}
        width={300}
        height={300}
        className="rounded-lg w-[300px] h-[320px] object-contain"
      />
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{product?.attributes?.name}</h2>
        <h2 className="text-lg line-clamp-3 ">{product?.attributes?.description}</h2>
        <div className="flex items-center gap-2">
          {product?.attributes?.sellingPrice && (
            <h2 className="text-2xl font-bold">
              ₹{product?.attributes?.sellingPrice}
            </h2>
          )}
          <h2
            className={`text-2xl p-2 font-bold ${
              product?.attributes?.sellingPrice && "line-through text-red-400"
            }`}
          >
            ₹{product?.attributes?.mrp}
          </h2>
        </div>
        <h2 className="text-lg text-left p-2 font-medium">
          {product?.attributes?.itemQuantityType}
        </h2>
        <div className="flex flex-col items-baseline gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 border px-5 flex gap-10 items-center">
              <button
                disabled={productQuantity === 1}
                onClick={() => setProductQuantity(productQuantity - 1)}
              >
                -
              </button>
              <button>{productQuantity}</button>
              <button onClick={() => setProductQuantity(productQuantity + 1)}> 
                +
              </button>
            </div>
            <h2 className="text-2xl font-bold">
              =₹{(productQuantity * productTotalPrice).toFixed(2)}
            </h2>
          </div>
          <Button
            className="flex gap-3 text-white  bg-primary"
            onClick={addToCart}
            disabled={loading}
          >
            <ShoppingBasket />
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Add To Cart"
            )}
          </Button>
        </div>
        <h2>
          Category: {product?.attributes?.categories?.data[0]?.attributes?.name}
        </h2>
      </div>
    </div>
  );
}

export default ProductItemDetails;
