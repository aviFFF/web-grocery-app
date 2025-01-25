import GlobalApi from '@/app/utils/GlobalApi';
import React from 'react';
import TopCategoryList from '../_components/TopCategoryList';
import ProductListwc from '@/app/_components/ProductListwc';

export const metadata = {
  title: 'Buzzat - Choose Your Product',
  description: 'Browse our product catalog',
};

// Generate static parameters for dynamic routes (optional if categories are dynamic)
export async function generateStaticParams() {
  const categories = await GlobalApi.getCategoryList();
  return categories.map((category) => ({
    categoryName: encodeURIComponent(category.name),
  }));
}

export default async function ProductCategory({ params }) {
  // Safely access params
  const encodedCategoryName = params?.categoryName;
  const categoryName = decodeURIComponent(encodedCategoryName || '');

  if (!categoryName) {
    throw new Error('Category name is missing.');
  }

  try {
    // Fetch data concurrently
    const [productList, categoryList] = await Promise.all([
      GlobalApi.getProductsbyCategory(categoryName),
      GlobalApi.getCategoryList(),
    ]);

    return (
      <>
        <div>
          {/* Page Header */}
          <h2 className="pt-14 md:pt-0 bg-primary items-center justify-center p-2 text-white text-3xl font-bold text-center">
            {categoryName}
          </h2>

          {/* Main Layout */}
          <div className="flex flex-row">
            {/* Sidebar */}
            <div className="h-[calc(100vh-80px)] sticky top-[100px] overflow-y-auto bg-white shadow-md">
              <TopCategoryList
                categoryList={categoryList}
                selectedCategory={categoryName}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-2 md:p-4 overflow-y-auto">
              {productList && productList.length > 0 ? (
                <ProductListwc productList={productList} />
              ) : (
                <p className="text-center text-gray-500">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p>Failed to load category data. Please try again later.</p>
      </div>
    );
  }
}
