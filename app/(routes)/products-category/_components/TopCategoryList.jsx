"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getVendorsByPincode } from "@/app/utils/GlobalApi";
import { usePincode } from "@/app/_context/PincodeContext";
import { useRouter } from "next/navigation";

function TopCategoryList({ selectedCategory }) {
  const { pincode } = usePincode();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    <div className="flex-col flex gap-2 mt-6 overflow-hidden md:items-start md:justify-start justify-center px-2 md:px-20 overflow-y-auto">
      {loading ? <p>Loading...</p> : categories.length > 0 ? (
        categories.map((category, index) => (
          <Link
            key={index}
            href={`/products-category/${category.name}`}
            className={`flex flex-row md:flex-row p-2 text-center group items-center justify-center cursor-pointer md:items-start md:justify-start overflow-hidden md:w-[190px] md:h-[50px] w-[70px] h-[50px] md:text-sm text-[10px] ${
              selectedCategory === category.name && "bg-primary text-white"
            }`}
          >
            <Image
              src={
                category.iconUrl.startsWith("http")
                  ? category.iconUrl
                  : `${process.env.NEXT_PUBLIC_URL}${category.iconUrl}`
              }
              alt={category.name}
              width={40}
              height={40}
              className="group-hover:scale-125 w-5 h-5 md:w-10 md:h-10 transition-all ease-in-out"
            />
            <h2
              className={`md:text-xs text-[8px] text-center contain mt-1 text-black ${
                selectedCategory === category.name && "text-white"
              }`}
            >
              {category.name}
            </h2>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 text-wrap text-center">No categories</p>
      )}
    </div>
  );
}

export default TopCategoryList;
