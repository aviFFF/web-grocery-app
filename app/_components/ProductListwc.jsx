"use client";
import React, { useState, useEffect, useRef } from 'react';
import Productitem from './Productitem';

function ProductListwc({ productList }) {
  const [visibleProducts, setVisibleProducts] = useState(8); // Start with 8 products
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null); // Reference for observing the last product

  const loadMoreProducts = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prevVisible) => prevVisible + 80); // Load 80 more products

      setLoading(false);
    }, 500); // Simulate API delay
  };

  useEffect(() => {
    // Create an IntersectionObserver instance
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

  return (
    <div className="mt-2 p-2">
      <h2 className="text-primary text-2xl text-center mb-4 flex">Best Buzzat Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {productList.slice(0, visibleProducts).map((product, index) => {
          const isLastProduct = index === visibleProducts - 1; // Check if this is the last visible product
          return (
            <div
              key={index}
              ref={isLastProduct ? observerRef : null} // Attach ref to the last product
            >
              <Productitem product={product} />
            </div>
          );
        })}
      </div>
      {loading && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
}

export default ProductListwc;
