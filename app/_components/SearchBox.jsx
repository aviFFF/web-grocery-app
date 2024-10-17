import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

const SearchBox = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const placeholders = ["Search for Milk", "Search for Peanuts", "Search for Apple","Search for Paneer","Search for Doritos","Search for Pyaaz","Search for Condom"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2000); // Change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden md:flex w-1/2 md:w-auto md:flex-grow mx-2 md:mx-5">
      <Input
        type="text"
        className="outline-none border border-gray-400 flex-grow text-sm md:text-base"
        placeholder=""
      />
      <div className="absolute ">
        <div className="relative text-nowrap p-2 ">
          {placeholders.map((placeholder, index) => (
            <span
              key={index}
              className={`absolute transition-opacity text-gray-400 ${
                index === currentPlaceholder ? 'opacity-100 animate-slideIn' : 'opacity-0 animate-slideOut'
              }`}
            >
              {placeholder}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;