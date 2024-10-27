import React from 'react'
import Productitem from './Productitem'

function ProductListwc( {productList}) {
  return (
    <div className='mt-2 p-2'>
    <h2 className='text-primary text-2xl text-center mb-4 flex'>  Products You Like</h2>
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
        {productList.map((product,index) => index < 8 &&( 

        <Productitem key={index} product={product} />
        ))}
    </div>
    </div>
  )
}

export default ProductListwc
