import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

function CategoryList({ categoryList = [] }) {
  return (
    <div className="mt-5">
      <Head>
        <title>Shop by Category</title>
        <meta
          name="description"
          content="Explore our wide range of products in different categories."
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8540952826970534"
          crossorigin="anonymous"
        ></script>
      </Head>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-21F084QKVP"
      ></script>
      <script>
        window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'G-21F084QKVP');
      </script>

      <h2 className="text-primary text-2xl text-center mb-4 flex">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4">
        {categoryList.map((category, index) => (
          <Link
            key={index}
            href={"/products-category/" + category.attributes.name}
            className="flex flex-col items-center gap-2 bg-green-50 md:p-1 group cursor-pointer rounded-xl hover:bg-primary"
          >
            <Image
              src={category?.attributes?.icon?.data?.attributes?.url}
              alt="icon"
              width={100}
              height={100}
              unoptimized
            />
            <h2 className="group-hover:text-white text-black text-[14px]">
              {category?.attributes?.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
