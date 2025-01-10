import dynamic from 'next/dynamic';
import Footer from "./_components/Footer";
import GlobalApi from "./utils/GlobalApi";
import Link from 'next/link';

// Dynamic imports for client-side components
const Slider = dynamic(() => import('./_components/Slider'), { ssr: true });
const CategoryList = dynamic(() => import('./_components/CategoryList'), { ssr: true });
const ProductList = dynamic(() => import('./_components/ProductList'), { ssr: true });
const ProductListwc = dynamic(() => import('./_components/ProductListwc'), { ssr: true });

// Generate metadata for SEO
export const metadata = {
  title: "Quick Delivery Grocery App | Buzzat",
  description: "Shop for groceries online with Buzzat, the fastest online grocery app in India.",
  icons: {
    icon: "/favicon.ico",
  },
};

async function fetchData() {
  try {
    const sliders = await GlobalApi.getSliders();
    const categories = await GlobalApi.getCategoryList();
    const products = await GlobalApi.getAllProducts();

    return {
      sliders: sliders || [],
      categories: categories || [],
      products: products || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      sliders: [],
      categories: [],
      products: [],
    };
  }
}

export default async function Home() {
  const { sliders, categories, products } = await fetchData();

  return (
    <div className="md:p-4 p-5 md:px-16">
      {/* Main Content */}
      <Slider sliderList={sliders} />
      <CategoryList categoryList={categories} />
      <ProductList productList={products} />
      <ProductListwc productList={products} />

      {/* Fixed Download App Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-white py-3 px-5 flex justify-between items-center z-50 shadow-lg">
        <span className="text-xs md:text-sm font-medium">
          Download the Buzzat App for the best experience!
        </span>
        <Link href="/download-app">
          <button className="bg-white text-primary py-1 px-2 text-xs rounded-lg font-semibold hover:bg-gray-200 transition">
            Download Now
          </button>
        </Link>
      </div>
    </div>
  );
}
