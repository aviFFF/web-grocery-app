'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { debounce, getAllProducts } from '../utils/GlobalApi';
import './style.css';
import { Input } from '@/components/ui/input';

const ProductSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const placeholders = [
    "Search for Milk...",
    "Search for Fruits...",
    "Search for Chips...",
    "Search for Cookies...",
    "Search for Vegetables..."
  ];
  // Cycle through placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 2000); // Change every 2 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [placeholders.length]);

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
      const productNames = results.map((product) => product.attributes.name);
      setSuggestions(productNames);
    });
  }, 200);
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput) {
      router.push(`/search?query=${searchInput}`);
    }
    setSearchInput('');
    setSuggestions([]);
  };
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    router.push(`/search?query=${suggestion}`);
    setSearchInput('');
    setSuggestions([]);
    setPlaceholderIndex(0);
  };
  return (
    <div className="w-full flex flex-col mx-auto items-center justify-center search-box-container">
      <form onSubmit={handleSearchSubmit} className="w-full sm:pb-4 flex">
        <Input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder={placeholders[placeholderIndex]}
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
