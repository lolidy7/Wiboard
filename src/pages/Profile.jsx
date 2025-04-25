import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

export default function Explore() {
  const { user } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyProfileLink = () => {
    const profileLink = `https://wiboard.com/${user.username}`;
    navigator.clipboard.writeText(profileLink);
    
    // Show toast for 2 seconds
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };


  return (
    <div className="p-4 dark:bg-primary-darkmode min-h-screen flex flex-col -m-4 transition-colors duration-300">

      {/* Main Content */}
      <div className="flex flex-col items-center flex-grow">
        {/* Profile Section */}
        <div className="text-center">
          {/* Profile Image */}
          <div className="inline-block">
            <img
              alt="Profile picture"
              className="rounded-full w-24 h-24 sm:w-36 sm:h-36 mx-auto object-cover"
              src={user.avatar}
            />
          </div>
          <h1 className="text-heading sm:text-2xl font-semibold mt-4 dark:text-white">{user.name}</h1>
          <p className="text-gray-600 text-sub-heading sm:text-base mt-2 dark:text-gray-400">0 followers · 0 following</p>

          {/* Buttons */}
          <div className="flex justify-center mt-4 space-x-4">
            <button 
              onClick={handleShare}
              className="bg-secondary text-white px-5 py-2 rounded-full text-sm sm:text-base hover:bg-[#46F323]"
            >
              Share
            </button>
            <Link to={"/editprofile"}>
              <button className="bg-secondary text-white px-5 py-2 rounded-full text-sm sm:text-base hover:bg-[#46F323]">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Banner Image */}
        <div className="flex justify-center w-full mt-8">
          <img src="/images/user-profilepage.png" alt="Profile Banner" className="w-full max-w-md sm:max-w-lg rounded-lg" />
        </div>

        {/* Information Section */}
        <div className="mt-8 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-white">
            Keep track of what inspires you
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 dark:text-gray-300">
            Boards help you organize the Pins you save into <br className="hidden sm:block" /> collections.
          </p>
        </div>

        {/* Go to Library Button */}
        <div className="flex justify-center mt-8 mb-8">
          <Link to={"/library"}>
            <button className="bg-secondary text-white px-6 py-2 rounded-full text-sm sm:text-base hover:bg-[#46F323]">
              Go to Library
            </button>
          </Link>
        </div>
      </div>

      {/* Share Modal with Blur Backdrop */}
      {showShareModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Share on Wiboard</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="text-xl font-medium dark:text-white">{user.name}</h4>
              <p className="text-gray-500 dark:text-gray-400">@wiboard</p>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="flex-1 min-w-[120px] bg-gray-100 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <i className="fab fa-facebook text-blue-600 mr-2"></i>
                Facebook
              </button>
              <button className="flex-1 min-w-[120px] bg-gray-100 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <i className="fab fa-twitter text-blue-400 mr-2"></i>
                Twitter
              </button>
              <button 
                onClick={copyProfileLink}
                className="flex-1 min-w-[120px] bg-gray-100 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <i className="fas fa-link text-gray-600 mr-2"></i>
                Copy Link
              </button>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center mb-2">
              <span className="text-gray-600 dark:text-gray-300 flex-1 truncate text-sm">
                https://wiboard.com/{user.username}
              </span>
              <button 
                onClick={copyProfileLink}
                className="ml-2 text-secondary hover:text-[#46F323] transition-colors"
                aria-label="Copy link"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied Toast Notification */}
      {showCopiedToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeInOut">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-400 mr-2"></i>
            <span>Copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* FontAwesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

      {/* Add these animations to your Tailwind config */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s ease-in-out forwards;
        }
      `}</style>

      {/* FontAwesome Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
    </div>
  );
}