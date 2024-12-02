import GlobalApi from '@/app/utils/GlobalApi'
import React from 'react'
import TopCategoryList from '../_components/TopCategoryList';
import ProductListwc from '@/app/_components/ProductListwc';
import Footer from '@/app/_components/Footer';

async function ProductCategory({params}) {
  const productList = await GlobalApi.getProductsbyCategory(params.categoryName);
  const categoryList = await GlobalApi.getCategoryList();
 
  return (
    <>   
     <div >
     <h2 className="pt-14 md:pt-0 bg-primary items-center justify-center p-2 text-white text-3xl font-bold text-center">
  {decodeURIComponent(params.categoryName)}
</h2>

  <div className='flex flex-row'>
  <div>
  <TopCategoryList 
    categoryList={categoryList} 
    selectedCategory={decodeURIComponent(params.categoryName)}
  />
  </div>
  <div className='p-2 md:p-4'>
    <ProductListwc productList={productList} />
  </div>
  </div>
</div>
</>

  )
}

export default ProductCategory
