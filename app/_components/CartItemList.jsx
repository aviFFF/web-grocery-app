import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

function CartItemList({ cartItemList, onDeleteItem, onUpdateItem }) {
  const handleQuantityChange = (cart, newQuantity) => {
    const totalProducts = cartItemList.reduce((acc, item) => acc + item.quantity, 0);
    
    if (newQuantity < 1) {
      toast("Minimum quantity is 1");
      return;
    }
  
    if (newQuantity > 4) {
      toast("Maximum quantity per product is 4");
      return;
    }
  
    if (totalProducts + (newQuantity - cart.quantity) > 2) {
      toast("You can only add up to 2 products in your cart.");
      return;
    }
  
    // Call the parent-provided function
    onUpdateItem(cart.id, newQuantity);
  };
  

  return (
    <div>
      <div className="overflow-auto h-[600px]">
        {cartItemList.map((cart, index) => (
          <div
            className="flex justify-between items-center border-b pb-4 mb-4"
            key={index}
          >
            <div className="flex gap-6 items-center">
              <Image
                src={cart.image}
                width={80}
                height={80}
                alt={cart.name}
                className="border p-2"
              />
              <div className="text-start">
                <h2 className="font-bold">{cart.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleQuantityChange(cart, cart.quantity - 1)}
                    disabled={cart.quantity === 1}
                    className="p-2 border rounded-xl bg-gray-200"
                  >
                    -
                  </button>
                  <span>{cart.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(cart, cart.quantity + 1)}
                    className="p-2 border rounded-xl bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <h2 className="font-bold text-lg mt-2">₹{cart.amount}</h2>
              </div>
            </div>
            <Trash2Icon
              onClick={() => onDeleteItem(cart.id)}
              className="cursor-pointer text-red-500"
              size={24}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


export default CartItemList;
