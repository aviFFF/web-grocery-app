"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePincode } from "../_context/PincodeContext";
import { getVendorsByPincode } from "../utils/GlobalApi";
import Productitem from "./Productitem";

const ProductList = () => {
  const { pincode } = usePincode();
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Start with 8 products
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null); // Observer reference for infinite scrolling

  useEffect(() => {
    if (!pincode) return;

    console.log("Fetching products for pincode:", pincode);
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const { products } = await getVendorsByPincode(pincode);
        console.log("API Response - Products:", products);

        if (!products || products.length === 0) {
          console.log("No products found for this pincode.");
          setProducts([]);
        } else {
          setProducts(
            products.map((prod) => ({
              id: prod.id,
              name: prod.name,
              imageUrl:
                prod.image?.[0]?.url || // Direct image URL
                prod.image?.[0]?.thumbnail?.url || // Thumbnail URL
                "/buzzat-logo.png", // Fallback image
              mrp: prod.mrp,
              sellingPrice: prod.sellingPrice,
              description: prod.description,
              stockStatus: prod.stockStatus,
            }))
          );
          
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pincode]);

  // Function to load more products
  const loadMoreProducts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => prevVisible + 80); // Load 80 more products
      setLoading(false);
    }, 500);
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current]);

  return (
    <div className="mt-5">
      <h2 className="text-primary text-2xl text-center mb-4 flex">
        Best Buzzat Products
      </h2>

      {loading && products.length === 0 ? (
        <p className="text-gray-500 text-center">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, visibleProducts).map((product, index) => {
            const isLastProduct = index === visibleProducts - 1;
            return (
              <div key={index} ref={isLastProduct ? observerRef : null}>
                <Productitem product={product} />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No products available for this pincode.
        </p>
      )}

      {loading && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
};

export default ProductList;
