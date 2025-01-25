import { Button } from "@/components/ui/button";
import { LoaderCircle, ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import GlobalApi from "../utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdatecartContext";
import ProductCarousel from "./ProductItemcarousal";

function ProductItemDetails({ product }) {
  const images = product?.attributes?.image?.data || [];
  const altText = product?.attributes?.name || "Product Image";
  const jwt = sessionStorage.getItem("jwt");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [productTotalPrice, setProductTotalPrice] = useState(
    product.attributes.sellingPrice || product.attributes?.mrp
  );
  const router = useRouter();
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const quantityType = product?.attributes?.quantityType || "In Stock"; // Fallback

  const addToCart = async () => {
    if (!jwt) {
      router.push("/log-in");
      return;
    }

    if (productQuantity > 2) {
      toast("You can only add up to 2 items of this product.");
      return;
    }

    setLoading(true);

    try {
      // Fetch the user's cart
      const cartItems = await GlobalApi.getCartItems(user.id, jwt);

      // Check if the product already exists in the cart
      const existingCartItem = cartItems.find(
        (item) => item.product === product.id
      );

      if (existingCartItem) {
        // If product exists, update the quantity and amount
        const updatedQuantity = Math.min(
          existingCartItem.quantity + productQuantity,
          2
        );
        const updatedData = {
          data: {
            quantity: updatedQuantity,
            amount: (updatedQuantity * productTotalPrice).toFixed(2),
          },
        };

        await GlobalApi.updateCartItem(existingCartItem.id, updatedData, jwt);
        toast("Cart updated successfully");
      } else {
        // If product doesn't exist, add it to the cart
        const newData = {
          data: {
            quantity: productQuantity,
            amount: (productQuantity * productTotalPrice).toFixed(2),
            products: product.id,
            users_permissions_user: user.id,
            userId: user.id,
          },
        };

        await GlobalApi.addToCart(newData, jwt);
        toast("Product added to cart");
      }

      setUpdateCart(!updateCart); // Trigger cart re-render
    } catch (error) {
      console.error("Error updating cart:", error);
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white grid grid-cols-1 w-full gap-4 md:grid-cols-2">
      <ProductCarousel images={images} altText={altText} />
      <div className="flex flex-col gap-3">
        <h2 className="text-xs">{product?.attributes?.description}</h2>
        <div className="flex items-center gap-2">
          {product?.attributes?.sellingPrice !== product?.attributes?.mrp ? (
            <>
              {product?.attributes?.sellingPrice && (
                <h2 className="text-2xl font-bold">
                  ₹{product?.attributes?.sellingPrice}
                </h2>
              )}
              <h2 className="text-2xl p-2 font-bold line-through text-red-400">
                ₹{product?.attributes?.mrp}
              </h2>
            </>
          ) : (
            <h2 className="text-2xl font-bold">₹{product?.attributes?.mrp}</h2>
          )}
        </div>

        {/* Stock Status */}
        <h2
          className={`text-lg p-2 font-medium ${
            quantityType === "Out of Stock" ? "text-red-600" : "text-green-600"
          }`}
        >
          {quantityType}
        </h2>
        <div className="flex flex-col items-baseline gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 border px-4 flex gap-10 items-center">
              <button
                disabled={
                  productQuantity === 1 || quantityType === "Out of Stock"
                }
                onClick={() => setProductQuantity(productQuantity - 1)}
              >
                -
              </button>
              <button>{productQuantity}</button>
              <button
                onClick={() =>
                  setProductQuantity((prev) => Math.min(prev + 1, 2))
                }
                disabled={quantityType === "Out of Stock"}
              >
                +
              </button>
            </div>
            <h2 className="text-2xl font-bold">
              =₹{(productQuantity * productTotalPrice).toFixed(2)}
            </h2>
          </div>
          <Button
            className="flex gap-3 text-white bg-primary"
            onClick={addToCart}
            disabled={loading || quantityType === "Out of Stock"}
          >
            <ShoppingBasket />
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Add To Cart"
            )}
          </Button>
        </div>
        <h3>Vendor: Shree Krishna General Store</h3>
      </div>
    </div>
  );
}

export default ProductItemDetails;
