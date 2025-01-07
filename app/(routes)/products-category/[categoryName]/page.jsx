import GlobalApi from '@/app/utils/GlobalApi';
import React from 'react';
import TopCategoryList from '../_components/TopCategoryList';
import ProductListwc from '@/app/_components/ProductListwc';

export const metadata = {
  title: 'Buzzat - Choose Your Product',
  description: 'Browse our product catalog',
};

async function ProductCategory({ params }) {
  const productList = await GlobalApi.getProductsbyCategory(params.categoryName);
  const categoryList = await GlobalApi.getCategoryList();

  return (
    <>   
      <div>
        {/* Page Header */}
        <h2 className="pt-14 md:pt-0 bg-primary items-center justify-center p-2 text-white text-3xl font-bold text-center">
          {decodeURIComponent(params.categoryName)}
        </h2>

        {/* Main Layout */}
        <div className="flex flex-row">
          {/* Sidebar */}
          <div className=" h-[calc(100vh-80px)] sticky top-[100px] overflow-y-auto bg-white shadow-md">
            <TopCategoryList 
              categoryList={categoryList} 
              selectedCategory={params.categoryName}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-2 md:p-4 overflow-y-auto">
            <ProductListwc productList={productList} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCategory;
