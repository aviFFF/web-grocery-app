"use client";
import { useEffect, useState } from "react";
import { usePincode } from "../_context/PincodeContext";
import { getVendorsByPincode } from "../utils/GlobalApi";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const CategoryList = () => {
  const { pincode } = usePincode();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pincode) return;

    console.log("Fetching categories for pincode:", pincode);
    setLoading(true);

    const fetchCategories = async () => {
      try {
        const { categories } = await getVendorsByPincode(pincode);
        console.log("API Response - Categories:", categories);

        if (!categories || categories.length === 0) {
          console.log("No categories found for this pincode.");
          setCategories([]);
        } else {
          setCategories(categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            iconUrl:
              cat?.icon?.url ||
              cat?.icon?.formats?.thumbnail?.url ||
              "/buzzat-logo.png",
          })));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pincode]);

  return (
    <div className="mt-5">
      <Head>
        <title>Shop by Category</title>
        <meta
          name="description"
          content="Explore our wide range of products in different categories."
        />
      </Head>

      <h2 className="text-primary text-2xl text-center mb-4 flex">
        Shop by Category
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading categories...</p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products-category/${category.name}`}
              className="flex flex-col items-center gap-2 bg-green-50 md:p-1 group cursor-pointer rounded-xl hover:bg-primary"
            >
              <Image
                src={
                  category.iconUrl.startsWith("http")
                    ? category.iconUrl
                    : `${process.env.NEXT_PUBLIC_URL}${category.iconUrl}`
                }
                alt={category.name}
                width={100}
                height={100}
                unoptimized
              />

              <h2 className="group-hover:text-white text-black text-[14px]">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No categories available for this pincode.
        </p>
      )}
    </div>
  );
};

export default CategoryList;
