import { Button } from "@/components/ui/button";
import Slider from "./_components/Slider";
import Image from "next/image";
import GlobalApi from "./utils/GlobalApi";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";

export default async function Home() {

  const sliderList = await GlobalApi.getSliders();

  const categoryList = await GlobalApi.getCategoryList();

  const productList = await GlobalApi.getAllProducts();
  return (
    <div className="md:p-4 p-5 md:px-16">
      {/* Slider */}
      <Slider sliderList={sliderList} />
       {/* Category List  */}
       <CategoryList className="" categoryList={categoryList} />
       {/* Product List */}
       <ProductList productList={productList}/>
       {/* Footer */}
       <Footer />

    </div>
  );
}
