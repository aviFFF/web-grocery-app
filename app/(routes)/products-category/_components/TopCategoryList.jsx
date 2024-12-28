import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({categoryList, selectedCategory} ) {
  return (
    <div className='flex-col flex gap-2 mt-6 overflow-hidden justify-center px-2 md:px-20 overflow-y-auto'>
  {categoryList.map((category, index) => (
    <Link 
      key={index} 
      href={'/products-category/' + category?.attributes?.name}
      className={`flex flex-col md:flex-row p-2
        bg-green-50 group cursor-pointer hover:bg-primary 
        md:w-[190px] md:h-[50px] w-[90px] h-[50px] md:text-sm text-[10px] 
        ${selectedCategory == category.attributes.name && 'bg-primary text-white'}
      `}
    >
      {/* Image inside the circular category */}
      <Image 
        src={category.attributes.icon.data.attributes.url} 
        alt='icon' 
        width={40} 
        height={40}
        className='group-hover:scale-125 w-5 h-5 md:w-auto md:h-auto transition-all ease-in-out'
      />
      
      {/* Smaller text inside the circular category */}
      <h2 className={`md:text-xs text-[8px] text-nowrap text-center contain mt-1 text-primary group-hover:text-white 
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
