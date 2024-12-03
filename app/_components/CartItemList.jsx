import { Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function CartItemList({ cartItemList,onDeleteItem }) {
  return (
    <div>
        <div className='overflow-auto h-[600px]'>
            {cartItemList.map((cart, index) => (
                <div className=' flex justify-between items-center' key={index}>
                    <div className='flex gap-6 items-center'>
                    <Image src={ cart.image} width={80} height={80} alt={cart.name} 
                    className='border p-2 mt-4'
                    />
                    <div className=' text-start'> 
                        <h2 className='font-bold'>{cart.name}</h2>
                        <h2>Quantity {cart.quantity}</h2>
                        <h2 className='font-bold text-lg'>₹{cart.amount}</h2>
                    </div>
                    </div>
                    <Trash2Icon onClick={() =>onDeleteItem (cart.id)} className=' cursor-pointer'/>
                    </div>
            ))}
        </div>
        
    </div>
    
  )
}

export default CartItemList
