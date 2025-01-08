import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import GlobalApi from '@/app/utils/GlobalApi';

// Dynamic imports for large components
const TopCategoryList = dynamic(() => import('../_components/TopCategoryList'));
const ProductListwc = dynamic(() => import('@/app/_components/ProductListwc'));

export const metadata = {
  title: 'Buzzat - Choose Your Product',
  description: 'Browse our product catalog',
};

async function ProductCategory({ params: rawParams }) {
  // Await params for dynamic routes
  const params = await rawParams;

  // Decode the category name
  const decodedCategoryName = decodeURIComponent(params.categoryName);

  // Concurrently fetch data
  const [productList, categoryList] = await Promise.all([
    GlobalApi.getProductsbyCategory(decodedCategoryName),
    GlobalApi.getCategoryList(),
  ]);

  // console.log("Product List for", decodedCategoryName, productList);
  // console.log("Category List:", categoryList);

  // Check if the productList is empty for this category
  const isProductListEmpty = productList.length === 0;

  return (
    <>
      <div>
        {/* Page Header */}
        <h2 className="pt-14 md:pt-0 bg-primary items-center justify-center p-2 text-white text-3xl font-bold text-center">
          {decodedCategoryName}
        </h2>

        {/* Main Layout */}
        <div className="flex flex-row">
          {/* Sidebar */}
          <div className="h-[calc(100vh-80px)] sticky top-[100px] overflow-y-auto bg-white shadow-md">
            <Suspense fallback={<div>Loading categories...</div>}>
              <TopCategoryList categoryList={categoryList} selectedCategory={decodedCategoryName} />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-2 md:p-4 overflow-y-auto">
            <Suspense fallback={<div>Loading products...</div>}>
              {isProductListEmpty ? (
                <div>No products found in this category.</div>
              ) : (
                <ProductListwc productList={productList} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCategory;
