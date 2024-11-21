import Image from 'next/image'
import React from 'react'

function Myorderitem({orderitem}) {
    return (
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] mx-auto space-y-4">
    <div className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0">
        {/* Product Image */}
        <Image
            src={orderitem.product.data.attributes.image.data[0].attributes.url}
            alt={orderitem.product.data.attributes.name}
            width={50}
            height={50}
            className="w-16 h-16 rounded-md object-cover border"
        />

        {/* Product Details */}
        <div className="flex-grow">
            <h2 className="font-bold text-gray-800 text-sm sm:text-base">
                {orderitem.product.data.attributes.name}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
                Item Price: ${orderitem.product.data.attributes.mrp}
            </p>
        </div>

        {/* Quantity and Amount */}
        <div className="flex flex-col items-end text-sm sm:text-base">
            <h2 className="text-gray-700">Quantity: {orderitem.quantity}</h2>
            <h2 className="text-gray-700 font-bold">
                Amount: ${orderitem.product.data.attributes.sellingPrice}
            </h2>
        </div>
    </div>
</div>

    )
}

export default Myorderitem