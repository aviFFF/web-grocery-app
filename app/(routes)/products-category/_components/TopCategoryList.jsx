import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({categoryList, selectedCategory} ) {
  return (
    <div className='flex-col flex gap-5 mt-2 overflow-auto justify-center px-2 md:px-20'>
  {categoryList.map((category, index) => (
    <Link 
      key={index} 
      href={'/products-category/' + category?.attributes?.name}
      className={`flex flex-col items-center justify-center 
        bg-green-50 md:p-4 group cursor-pointer hover:bg-primary 
        w-[100px] h-[100px] min-w-[70px] 
        ${selectedCategory == category.attributes.name && 'bg-primary text-white'}
      `}
    >
      {/* Image inside the circular category */}
      <Image 
        src={category.attributes.icon.data[0].attributes.url} 
        alt='icon' 
        width={40} 
        height={40}
        className='group-hover:scale-125 transition-all ease-in-out'
      />
      
      {/* Smaller text inside the circular category */}
      <h2 className={`md:text-xs text-[10px] text-center mt-1 text-green-800 group-hover:text-white 
        ${selectedCategory == category?.attributes?.name && 'text-white'}
      `}>
        {category?.attributes?.name}
      </h2>
    </Link>
  ))}
</div>


  )
}

export default TopCategoryList
