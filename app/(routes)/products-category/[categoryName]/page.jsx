import GlobalApi from '@/app/utils/GlobalApi'
import React from 'react'
import TopCategoryList from '../_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';
import Footer from '@/app/_components/Footer';

async function ProductCategory({params}) {
  const productList = await GlobalApi.getProductsbyCategory(params.categoryName);
  const categoryList = await GlobalApi.getCategoryList();
 
  return (
    <div>
      <h2 className='p-4 bg-primary text-white text-3xl font-bold text-center'>{params.categoryName}</h2>
      <TopCategoryList categoryList={categoryList} 
      selectedCategory={params.categoryName}
      />
      <div className='p-2 md:p-10'>
      <ProductList productList={productList} />
      </div>
      <Footer/>
    </div>
  )
}

export default ProductCategory
