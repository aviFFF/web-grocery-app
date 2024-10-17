import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function CategoryList( {categoryList}) { 
  return (
    <div className='mt-5'>
      <h2 className='text-primary text-2xl text-center mb-4 flex'>Shop by Category</h2>
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4'>
        {categoryList.map((category, index) => (
            <Link key={index} href ={'/products-category/' + category.attributes.name} className='flex flex-col items-center gap-2 bg-green-50 md:rounded-2xl rounded-full md:p-2 
            group cursor-pointer hover:bg-primary'>
                <Image src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + 
                    category.attributes.icon.data[0].attributes.url} 
                    alt='icon' 
                    width={50} 
                    height={50}
                    className='group-hover:scale-125 transition-all ease-in-out'
                    />
                    <h2 className='group-hover:text-white text-black' >{category.attributes.name}</h2>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
