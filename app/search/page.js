'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllProducts } from '../utils/GlobalApi';
import ProductItemDetails from '../_components/ProductItemDetails';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Create a fallback UI to display while loading
const LoadingFallback = () => <div>Loading search results...</div>;

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || ''; // Safely get query params

  // Fetch products when the page loads or when query changes
  useEffect(() => {
    if (!query) return; // Ensure query exists
    const fetchProducts = async () => {
      const allProducts = await getAllProducts(query);
      setSearchResults(allProducts);
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="p-8 mt-4 md:p-4">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id} className="p-4 rounded">
              <div className="p-1 md:p-2 flex flex-col items-center text-center justify-center gap-3 border rounded-lg hover:shadow-md hover:scale-105 cursor-pointer transition-all ease-in-out">
                <Image
                  src={product?.attributes?.image?.data[0]?.attributes?.url}
                  alt={product?.attributes?.name}
                  width={500}
                  height={200}
                  className="w-[100px] md:h-[100px] h-[50px] object-contain"
                />
                <h2 className="font-bold text-sm md:text-lg">
                  {product?.attributes?.name}
                </h2>
                <h2 className="text-gray-500">{product?.attributes?.itemQuantityType}</h2>
                <div className="flex items-center gap-2">
                  {product?.attributes?.sellingPrice && (
                    <h2>₹{product?.attributes?.sellingPrice}</h2>
                  )}
                  <h2 className={`font-bold ${product?.attributes?.sellingPrice && 'line-through text-gray-400'}`}>
                    {product?.attributes?.mrp}
                  </h2>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="text-primary rounded-xl hover:text-white hover:bg-primary"
                      variant="outline"
                    >
                      Add To Cart
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogDescription>
                        <ProductItemDetails product={product} />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

// Wrap the component with Suspense and provide fallback
export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchResults />
    </Suspense>
  );
}
