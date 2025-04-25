import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggler from "../darkmode/DarkModeToggler";
import LoginModal from "../login/LoginModal";
import SignUpModal from "../login/SignUpModal";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get auth state and methods from context
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      await navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  
  return (
    <>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <SignUpModal
        show={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSignUpSuccess={() => {
          setShowLoginModal(true);
          setSignUpModalOpen(false);
        }}
      />

      <nav className="transition-colors duration-300 bg-white dark:bg-black/90 w-full min-h-16 flex flex-col sm:flex-row justify-between items-center px-4 py-2 sm:px-6 sm:py-0 relative">
        {/* Mobile header row */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          {!user ? (
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="logo"
                className="max-w-[120px] h-auto sm:mr-5 max-h-12"
              />
            </Link>
          ) : (
            <Link to="/home">
              <img
                src="/images/logo.png"
                alt="logo"
                className="max-w-[120px] h-auto sm:mr-5 max-h-12"
              />
            </Link>
          )}

          {!user ? (
            <button className="transition-colors duration-300 text-black/90 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700">
              <Link to="/explore">Explore</Link>
            </button>
          ) : null}

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center space-x-4">
            <DarkModeToggler />
            <button
              className="text-primary-darkmode dark:text-primary p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            {user ? (
              <Link to="/profile">
                <img
                  src={user.avatar || "./public/images/user-profile.png"}
                  alt="user-profile"
                  className="max-w-8 max-h-8 rounded-2xl"
                />
              </Link>
            ) : (
              <button
                className="text-primary-darkmode dark:text-primary text-sm font-medium transition-colors duration-300"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu content */}
        {isMobileMenuOpen && (
          <div className="w-full sm:hidden bg-gray-200 dark:bg-primary-darkmode mt-2 py-2 px-4 rounded-md">
            <ul className="space-y-2 text-primary-darkmode dark:text-primary">
              {user ? (
                <>
                  <Link to={"/library"}>
                    <li className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">
                      Library
                    </li>
                  </Link>
                  <li className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer flex gap-x-2 mt-2 mb-2">
                    Dark Mode: <DarkModeToggler />
                  </li>
                  <li
                    className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer"
                    onClick={handleLogout}
                  >
                    <Link to={"/"}>Log Out</Link>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </li>
                  <li
                    className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      setSignUpModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </li>
                  <Link to={"/about"}>
                    <li
                      className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      About
                    </li>
                  </Link>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Desktop auth buttons or profile dropdown */}
        {user ? (
          <div
            className="hidden sm:flex items-center h-[60%] relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            ref={dropdownRef} // Attach the ref to the dropdown container
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
                  <Link to={"/about"}>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                    >
                      About 
                    </li>
                  </Link>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                    onClick={handleLogout}
                  >
                    <Link to={"/"}> Log Out </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-4">
            <DarkModeToggler />
            <button className="text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
              <Link to={"/about"}>About</Link>
            </button>
            <button
              className="text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
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
      </nav>
    </>
  );
}