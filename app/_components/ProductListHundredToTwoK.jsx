"use client";

import React, { useState, useEffect, useRef } from "react";
import GlobalApi from "@/app/utils/GlobalApi";
import Productitem from "./Productitem";

function ProductListHundredToTwoK() {
  const [productList, setProductList] = useState([]); // Store fetched products
  const [visibleProducts, setVisibleProducts] = useState(8); // Start with 8 products
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null); // Reference for observing the last product

  // Fetch products and sort by highest discount percentage
  const fetchProducts = async () => {
    try {
      const response = await GlobalApi.getProductBetween100to199();
      const products = response;

      // Sort products by discount percentage (higher first)
      const sortedProducts = products.sort((a, b) => {
        const discountA = ((a.attributes.mrp - a.attributes.sellingPrice) / a.attributes.mrp) * 100;
        const discountB = ((b.attributes.mrp - b.attributes.sellingPrice) / b.attributes.mrp) * 100;
        return discountB - discountA; // Higher discount first
      });

      setProductList(sortedProducts); // Set the sorted product list
    } catch (error) {
      console.error("Error fetching products between ₹100-₹199:", error);
    }
  };

  // Load more products when the last product is visible
  const loadMoreProducts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => prevVisible + 8); // Load 8 more products
      setLoading(false);
    }, 500); // Simulate API delay
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts(); // Load more products when the last product is visible
        }
      },
      { threshold: 1.0 } // Trigger only when fully in view
    );

    if (observerRef.current) {
      observer.observe(observerRef.current); // Start observing the reference
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current); // Clean up observation
      }
    };
  }, [observerRef.current]); // Re-run if the observer reference changes

  if (productList.length === 0) {
    return <p className="text-center mt-4">Loading products...</p>;
  }

  return (
    <div className="mt-2 p-2">
      <h2 className="text-primary text-2xl mb-4 flex">Best Products Under ₹199</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {productList.slice(0, visibleProducts).map((product, index) => {
          const isLastProduct = index === visibleProducts - 1; // Check if this is the last visible product
          return (
            <div key={product.id} ref={isLastProduct ? observerRef : null}>
              <Productitem product={product} />
            </div>
          );
        })}
      </div>
      {loading && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
}

export default ProductListHundredToTwoK;
