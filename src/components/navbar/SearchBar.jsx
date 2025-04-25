import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const location = useLocation();
  
  // Only show search bar on home page
  if (location.pathname !== '/home') {
    return null;
  }

  return (
    <div className="hidden sm:block w-[40%] md:w-[30%] lg:w-[50%] xl:w-[60%] sm:mx-5 h-10">
      <div className="relative h-full">
        <input
          className="appearance-none bg-white border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full h-full px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          id="SearchTerm"
          type="text"
          placeholder="Search"
        />
        <div className="absolute left-0 inset-y-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;