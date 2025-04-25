import React, { useState, useEffect, useRef } from 'react';

const DropDown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 

  return (
    <div
      className="hidden sm:flex items-center h-[60%] relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
      ref={dropdownRef} // Attach the ref to the dropdown container
    >
      {/* Desktop auth buttons or profile dropdown */}
      {user ? (
          <div
            className="hidden sm:flex items-center h-[60%] relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="/profile">
              <img
                src={user.avatar || "./images/user-profile.png"}
                alt="user-profile"
                className="max-w-max max-h-10 mr-2 rounded-2xl"
              />
            </Link>
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-200 text-primary-darkmode dark:text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 dark:bg-gray-800">
                <ul className="py-1">
                  <Link to={"/library"}>
                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                      Library
                    </li>
                  </Link>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex gap-2 items-center">
                    Dark Mode: <DarkModeToggler />
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                    onClick={handleLogout}
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-4">
            <DarkModeToggler />
            <button
              className="text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              onClick={() => setSignUpModalOpen(true)}
            >
              Sign Up
            </button>
          </div>
        )}
    </div>
  );
};

export default DropDown;