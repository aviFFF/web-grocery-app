import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({categoryList, selectedCategory} ) {
  return (
    <div className='flex-col flex gap-2 mt-6 overflow-hidden md:items-start md:justify-start justify-center px-2 md:px-20 overflow-y-auto'>
  {categoryList.map((category, index) => (
    <Link 
      key={index} 
      href={'/products-category/' + category?.attributes?.name}
      className={`flex flex-col md:flex-row p-2
        bg-green-50 text-center group  items-center justify-center cursor-pointer md:items-start md:justify-start overflow-hidden
        md:w-[190px] md:h-[50px] w-[70px] h-[50px] md:text-sm text-[10px] 
        ${selectedCategory == category.attributes.name && 'bg-primary text-primary'}
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
      <h2 className={`md:text-xs text-[8px] text-center contain mt-1 text-black group-hover:text-primary 
        ${selectedCategory == category?.attributes?.name && 'text-primary bg-green-400 '}
      `}>
        {category?.attributes?.name}
      </h2>
    </Link>
  ))}
</div>
  )
}

export default TopCategoryList
