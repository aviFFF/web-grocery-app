"use client";

import React, { useState, useEffect, useRef } from "react";
import GlobalApi from "@/app/utils/GlobalApi";
import Productitemforfilter from "./ProductItemforfilter";

function ProductListfortynine() { // Component to display products under ₹49
  const [productList, setProductList] = useState([]); // Store fetched products
  const [visibleProducts, setVisibleProducts] = useState(8); // Start with 8 products
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null); // Reference for observing the last product

  // Fetch and sort products by maximum discount
  const fetchProducts = async () => {
    try {
      const products = await GlobalApi.getproductfortynine();

      // Sort products by discount percentage
      const sortedProducts = products.sort((a, b) => {
        const discountA = ((a.attributes.mrp - a.attributes.sellingPrice) / a.attributes.mrp) * 100 || 0;
        const discountB = ((b.attributes.mrp - b.attributes.sellingPrice) / b.attributes.mrp) * 100 || 0;

        return discountB - discountA; // Higher discount first
      });

      setProductList(sortedProducts); // Set the sorted product list
    } catch (error) {
      console.error("Error fetching products under ₹49:", error);
    }
  };

  // Load more products when the last product is visible
  const loadMoreProducts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => Math.min(prevVisible + 8, productList.length)); // Load 8 more products
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
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [visibleProducts, productList]); // Re-run if visibleProducts or productList changes

  if (productList.length === 0) {
    return <p className="text-center mt-4">Loading products...</p>;
  }

  return (
    <div className="mt-2 p-2">
      <h2 className="text-primary text-2xl text-center mb-4 flex">Best Products Under ₹49</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {productList.slice(0, visibleProducts).map((product, index) => {
          const isLastProduct = index === visibleProducts - 1; // Check if this is the last visible product
          return (
            <div
              key={index}
              ref={isLastProduct ? observerRef : null} // Attach ref to the last product
            >
              <Productitemforfilter product={product} /> {/* Pass the full product object */}
            </div>
          );
        })}
      </div>
      {loading && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
}

export default ProductListfortynine;
