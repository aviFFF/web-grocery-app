import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({categoryList, selectedCategory} ) {
  return (
    <div className='flex gap-5 mt-2 overflow-auto justify-center px-7 md:px-20'>
    {categoryList.map((category, index) => (
        <Link key={index} href ={'/products-category/' + category.attributes.name}
         className={`flex flex-col items-center gap-2 bg-green-50 rounded-2xl p-2 
        group cursor-pointer hover:bg-primary 
        w-[150px] min-w-[70px]
        ${selectedCategory == category.attributes.name&&'bg-primary text-white'}
        `}>
            <Image src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + 
                category.attributes.icon.data[0].attributes.url} 
                alt='icon' 
                width={50} 
                height={50}
                className='group-hover:scale-125 transition-all ease-in-out'
                />
                <h2 className={`text-green-800 group-hover:text-white 
                ${selectedCategory == category.attributes.name&&'text-white'}`} >{category.attributes.name}</h2>
        </Link>
    ))}
  </div>
  )
}

export default TopCategoryList
