'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { debounce, getAllProducts } from '../utils/GlobalApi';
import './style.css';
import { Input } from '@/components/ui/input';


const ProductSearch = () => {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const router = useRouter();

    // Handle input change and debounce suggestions fetching
    const handleInputChange = (e) => {
      const query = e.target.value;
      setSearchInput(query);
      if (query.length > 2) {
        debounceFetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    };
  
    // Debounce fetching product suggestions
    const debounceFetchSuggestions = debounce((query) => {
      getAllProducts(query).then((results) => {
        // Map the results to product names only, but search includes descriptions
        const productNames = results.map((product) => product.attributes.name);
        setSuggestions(productNames);
      });
    }, 300);
  
    // Handle search submission
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchInput) {
        router.push(`/search?query=${searchInput}`);
      }
      // Clear the input and suggestions after search
      setSearchInput('');
      setSuggestions([]);
    };
  
    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
      setSearchInput(suggestion);
      router.push(`/search?query=${suggestion}`);
      // Clear input and suggestions after suggestion click
      setSearchInput('');
      setSuggestions([]);
    };

  
    return (
        <div className="w-full flex flex-col mx-auto items-center search-box-container">
        <form onSubmit={handleSearchSubmit} className="w-full flex">
          <Input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search for Milk, Fruits, Chips..."
            className="border p-2 rounded w-full flex-grow sliding-placeholder"
          />
        </form>
  
        {/* Render suggestions */}
        {suggestions.length > 0 && (
         <ul className="absolute top-full left-0 bg-white border rounded-lg w-full lg:w-full mt-1 p-2 z-20">
         {suggestions.map((item, index) => (
           <li
             key={index}
             className="cursor-pointer p-2 hover:bg-gray-100"
             onClick={() => handleSuggestionClick(item)}
           >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  

export default ProductSearch;
