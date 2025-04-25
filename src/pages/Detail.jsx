import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiShare2Line, RiMoreFill } from "react-icons/ri";
import { MdClose, MdAdd, MdDownload } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import '../css/detail/detail.css';
import axios from 'axios';
import {
  FacebookShareButton,
  TelegramShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  TelegramIcon,
  FacebookMessengerIcon
} from 'react-share';
import { useDarkMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './Login';

const BASE_URL = 'https://api.unsplash.com';
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function Detail() {
  const { id } = useParams();
  const [pin, setPin] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [savedCollections, setSavedCollections] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedPins, setRelatedPins] = useState([]);
  const [similarImages, setSimilarImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);
  const [showingDownloadId, setShowingDownloadId] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);


  // Get dark mode state from context
  const { darkMode } = useDarkMode();

  // New state for the save modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // New state for download dropdown
  // const [showMainDownload, setShowMainDownload] = useState(false);
  // const [showingDownloadId, setShowingDownloadId] = useState(null);

  // Refs for clicking outside the dropdowns
  const modalRef = useRef(null);
  const mainDownloadRef = useRef(null);
  const relatedDownloadRef = useRef(null);

  const [showMainDownload, setShowMainDownload] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMainDownload(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMainDownload(false);
    }, 200);
  };

  // Load saved collections from localStorage
  useEffect(() => {
    const savedCollectionsData = JSON.parse(localStorage.getItem('savedCollections')) || [];
    setSavedCollections(savedCollectionsData);
  }, []);

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSaveModal(false);
        setShowNewCollectionInput(false);
        setNewCollectionName('');
        setSelectedCollection(null);
      }

      if (mainDownloadRef.current && !mainDownloadRef.current.contains(event.target)) {
        setShowMainDownload(false);
      }

      if (showingDownloadId && relatedDownloadRef.current && !relatedDownloadRef.current.contains(event.target)) {
        setShowingDownloadId(null);
      }

      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    }

    // Add event listeners
    if (showSaveModal || showMainDownload || showingDownloadId || showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSaveModal, showMainDownload, showingDownloadId, showShareMenu]);

  // Fetch initial data - pin details and similar images
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Reset page when loading a new pin
        setPage(1);
        setRelatedPins([]);

        // Fetch pin details
        const pinData = await fetchPinDetails(id);
        setPin(pinData);
        setLikes(pinData.likes || 0);

        // Check if the pin is already liked or saved
        const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
        const savedCollectionsData = JSON.parse(localStorage.getItem('savedCollections')) || [];

        setIsLiked(likedImages.some((item) => item.url === pinData.image_large_url));
        setIsSaved(
          savedCollectionsData.some((collection) =>
            collection.images.some((image) => image.url === pinData.image_large_url)
          )
        );
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error('Rate limit exceeded. Please try again later.');
        } else {
          console.error('Error fetching data:', error);
        }
      }
      finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // Handle like button click
  const handleLikeClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
  
    const likedPin = {
      url: pin.image_large_url,
      collection: pin.title || 'Untitled',
    };
  
    if (isLiked) {
      // Remove the pin from likedImages in localStorage
      const updatedLikedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
      const filteredLikedImages = updatedLikedImages.filter(
        (item) => item.url !== likedPin.url
      );
      localStorage.setItem('likedImages', JSON.stringify(filteredLikedImages));
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      // Add the pin to likedImages in localStorage
      const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
      localStorage.setItem('likedImages', JSON.stringify([...likedImages, likedPin]));
      setLikes((prevLikes) => prevLikes + 1);
    }
  
    setIsLiked(!isLiked);
  };

  const fetchSimilarImagesWithVision = async (imageUrl) => {
    try {
      // Ensure the API key is properly formatted and valid
      if (!import.meta.env.VITE_GOOGLE_VISION_API_KEY ||
        import.meta.env.VITE_GOOGLE_VISION_API_KEY.length < 20) {
        console.error('Invalid Google Vision API key');
        return [];
      }

      // Use imageUri for publicly accessible images
      const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_GOOGLE_VISION_API_KEY}`;
      const requestBody = {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl
              }
            },
            features: [
              {
                type: "WEB_DETECTION",
                maxResults: 20
              }
            ]
          }
        ]
      };

      // Make the API call
      const visionResponse = await fetch(visionApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Check if the response is OK
      if (!visionResponse.ok) {
        const errorText = await visionResponse.text();
        console.error('Vision API error:', errorText);
        return [];
      }

      const visionData = await visionResponse.json();
      console.log('Vision API response:', visionData); // Log the full response to see its structure

      // Safely extract visually similar images with proper error checking
      if (visionData.responses &&
        visionData.responses[0] &&
        visionData.responses[0].webDetection &&
        visionData.responses[0].webDetection.visuallySimilarImages) {

        return visionData.responses[0].webDetection.visuallySimilarImages.map(image => ({
          url: image.url,
          title: 'Similar Image'
        }));
      } else {
        console.log('No similar images found in Vision API response');
        return [];
      }
    } catch (error) {
      console.error('Error in fetchSimilarImagesWithVision:', error);
      return [];
    }
  };

  // Improved function to handle download
  const handleDownload = async (imageUrl, title = 'image') => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      setShowMainDownload(false);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image.');
    }
  };

  // New function to open the save modal
  const openSaveModal = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
  
    if (isSaved) {
      // If already saved, remove from all collections
      handleRemoveFromAllCollections();
    } else {
      setShowSaveModal(true);
    }
  };

  // Handle remove pin from all collections
  const handleRemoveFromAllCollections = () => {
    const updatedCollections = savedCollections.map(collection => ({
      ...collection,
      images: collection.images.filter(image => image.url !== pin.image_large_url)
    }));

    // Remove empty collections
    const nonEmptyCollections = updatedCollections.filter(collection => collection.images.length > 0);

    setSavedCollections(nonEmptyCollections);
    localStorage.setItem('savedCollections', JSON.stringify(nonEmptyCollections));
    setIsSaved(false);
  };

  // Handle save to collection
  const handleSaveToCollection = (collectionName) => {
    const savedPin = {
      url: pin.image_large_url,
      title: pin.title || 'Untitled',
      id: pin.id
    };

    // Check if the collection already exists
    const existingCollectionIndex = savedCollections.findIndex(
      (collection) => collection.name === collectionName
    );

    if (existingCollectionIndex !== -1) {
      // Add the pin to the existing collection
      const updatedCollections = [...savedCollections];

      // Check if image already exists in collection to avoid duplicates
      const imageExists = updatedCollections[existingCollectionIndex].images.some(
        img => img.url === savedPin.url
      );

      if (!imageExists) {
        updatedCollections[existingCollectionIndex].images.push(savedPin);
      }

      setSavedCollections(updatedCollections);
      localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    } else {
      // Create a new collection and add the pin
      const newCollection = {
        name: collectionName,
        images: [savedPin],
      };
      const updatedCollections = [...savedCollections, newCollection];
      setSavedCollections(updatedCollections);
      localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
    }

    setIsSaved(true);
    setShowSaveModal(false);
    setShowNewCollectionInput(false);
    setNewCollectionName('');
    setSelectedCollection(null);
  };

  // Handle creating a new collection
  const handleCreateNewCollection = (e) => {
    e.preventDefault();
    if (newCollectionName.trim() !== '') {
      handleSaveToCollection(newCollectionName);
    }
  };

  // Fetch pin details from Unsplash API
  const fetchPinDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/photos/${id}`, {
      params: {
        client_id: UNSPLASH_API_KEY,
      },
    });
    return {
      id: response.data.id,
      title: response.data.description || response.data.alt_description || 'Untitled',
      description: response.data.alt_description || 'No description available',
      image_large_url: response.data.urls.regular,
      user: {
        username: response.data.user.username,
        profile_image: response.data.user.profile_image.medium,
      },
      likes: response.data.likes,
    };
  };

  // Fetch related pins from Unsplash API
  const fetchRelatedPins = async (query = 'nature', page = 1) => {
    const response = await axios.get(`${BASE_URL}/search/photos`, {
      params: {
        query,
        page,
        per_page: 10,
        client_id: UNSPLASH_API_KEY,
      },
    });
    return response.data.results.map((item) => ({
      id: item.id,
      title: item.description || item.alt_description || 'Untitled',
      description: item.alt_description || 'No description available',
      image_large_url: item.urls.regular,
      user: {
        username: item.user.username,
        profile_image: item.user.profile_image.medium,
      },
    }));
  };

  // Fetch more related pins for infinite scrolling
  const fetchMorePins = async () => {
    try {
      const newPage = page + 1;
      const relatedData = await fetchRelatedPins(pin?.title || 'nature', newPage);
      if (relatedData.length > 0) {
        setRelatedPins((prevPins) => [...prevPins, ...relatedData]);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more pins:', error);
    }
  };

  if (loading) return (
    <div className={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-primary-darkmode' : 'bg-white'}`}>
      <div className="loading-indicator">
        <div className="spinner"></div>
        <p className={darkMode ? 'text-white' : ''}>Loading...</p>
      </div>
    </div>
  );
  if (!pin) return <div className={`text-center ${darkMode ? 'text-white bg-primary-darkmode' : ''}`}>No data available.</div>;

  return (
    <div className={` -m-4 min-h-screen pb-10 transition-colors duration-300 ${darkMode ? 'bg-primary-darkmode text-white' : 'bg-white text-black'}`}>
      {/* Login Modal */}
      <LoginModal 
        show={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => window.history.back()}
          className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Main Content */}
      <div className="flex justify-center items-center px-4">
        <div className={`rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] relative p-4 gap-8 border-t border-b transition-colors duration-300 ${darkMode
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-300 text-black'
          }`}>
          {/* Left Side: Big Image */}
          <div className="flex-1 hidden md:block">
            {pin?.image_large_url ? (
              <img
                src={pin.image_large_url}
                alt={pin.title || 'Photo'}
                className="w-full h-full object-cover rounded-[35px]"
              />
            ) : (
              <div className={`w-full h-full flex justify-center items-center rounded-[35px] ${darkMode ? 'bg-primary-darkmode' : 'bg-gray-300'}`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No Image Available</p>
              </div>
            )}
          </div>
          {/* Mobile Image (visible only on small screens) */}
          <div className="w-full mb-4 md:hidden">
            {pin?.image_large_url ? (
              <img
                src={pin.image_large_url}
                alt={pin.title || 'Photo'}
                className="w-full h-64 object-cover rounded-[20px]"
              />
            ) : (
              <div className={`w-full h-64 flex justify-center items-center rounded-[20px] ${darkMode ? 'bg-primary-darkmode' : 'bg-gray-300'}`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No Image Available</p>
              </div>
            )}
          </div>
          {/* Right Side: Icons and User Info */}
          <div className="w-full md:w-3/5 p-3 md:p-6 flex flex-col justify-between">
            {/* Interaction Buttons and Profile Info */}
            <div className="space-y-4">
              {/* Heart Icon, Like Count, Share Icon, and More Options */}
              <div className="flex items-center space-x-6">
                <button onClick={handleLikeClick} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${isLiked ? 'text-red-500' : darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-red-500`}
                    fill={isLiked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="ml-2">{likes}</span>
                </button>

                {/* Share Icon */}
                <div className="relative group" ref={shareMenuRef}>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-full bg-black text-white whitespace-nowrap z-20">
                    Share
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    <RiShare2Line className="h-6 w-6" />
                  </button>
                  {/* Share Menu Popup */}
                  {showShareMenu && (
                    <div className={`absolute z-10 mt-2 -left-10 w-52 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}>
                      <div className="py-3 px-2">
                        <h3 className={`px-2 mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Share to
                        </h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <FacebookShareButton
                            url={window.location.href}
                            quote={pin.title}
                            className="focus:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <FacebookIcon size={36} round />
                              <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Facebook</span>
                            </div>
                          </FacebookShareButton>

                          {/* <FacebookMessengerShareButton
                            url={window.location.href}
                            appId="123456789" // Replace with your Facebook App ID
                            className="focus:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <FacebookMessengerIcon size={36} round />
                              <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Messenger</span>
                            </div>
                          </FacebookMessengerShareButton> */}

                          <TelegramShareButton
                            url={window.location.href}
                            title={pin.title}
                            className="focus:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <TelegramIcon size={36} round />
                              <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Telegram</span>
                            </div>
                          </TelegramShareButton>

                          {/* Instagram doesn't have a direct share API, so we'll provide a copy link option */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              alert('Link copied! You can paste it on Instagram.');
                            }}
                            className="focus:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-9 h-9 bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                              </div>
                              <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Instagram</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {/* More Options (3 dots) - NEW */}
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                      }`}
                  >
                    <RiMoreFill className="h-6 w-6" />
                  </button>

                  {showMainDownload && (
                    <div
                      className={`absolute z-10 mt-2 -left-10 w-40 rounded-md shadow-lg transition-opacity duration-200 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleDownload(pin.image_large_url, pin.title)}
                          className={`flex items-center px-4 py-2 w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <MdDownload className="mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Photo Title and Description */}
              <h1 className="text-2xl font-bold">{pin?.title || 'Untitled'}</h1>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{pin?.description || 'No description available'}</p>
              {/* User Profile and Username */}
              <div className="flex items-center mt-10">
                <img
                  src={pin?.user?.profile_image || 'https://via.placeholder.com/50'}
                  alt={pin?.user?.username || 'User'}
                  className="w-6 h-6 rounded-full"
                />
                <span className="ml-2 text-xs font-medium">{pin?.user?.username || 'Anonymous'}</span>
              </div>
            </div>
            {/* Save Button */}
            <div className="absolute top-4 right-4">
              <button
                className={`${isSaved
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2 rounded-full text-sm font-medium`}
                onClick={openSaveModal}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div
            ref={modalRef}
            className={`relative rounded-lg p-6 w-full max-w-md shadow-lg transition-all ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSaveModal(false);
                setShowNewCollectionInput(false);
                setNewCollectionName('');
                setSelectedCollection(null);
              }}
              className="absolute top-2 right-2 p-1 rounded-full"
            >
              <MdClose size={24} className="text-gray-500 hover:text-gray-700" />
            </button>

            <h2 className="text-xl font-bold mb-4">Save to Collection</h2>

            {/* Collections List */}
            <div className="mb-4 max-h-60 overflow-y-auto">
              {savedCollections.length > 0 ? (
                <div className="space-y-2">
                  {savedCollections.map((collection) => (
                    <div
                      key={collection.name}
                      onClick={() => handleSaveToCollection(collection.name)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${darkMode ? 'hover:bg-primary-darkmode' : 'hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        {collection.images.length > 0 && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                            <img
                              src={collection.images[0].url}
                              alt={collection.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-gray-500">
                            {collection.images.length} items
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No collections yet</p>
              )}
            </div>

            {/* Create New Collection */}
            {showNewCollectionInput ? (
              <form onSubmit={handleCreateNewCollection} className="mt-4">
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${darkMode
                    ? 'bg-primary-darkmode border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                    }`}
                  autoFocus
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewCollectionInput(false)}
                    className="mr-2 px-4 py-2 rounded-lg text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCollectionName.trim()}
                    className={`px-4 py-2 rounded-lg ${newCollectionName.trim()
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Create
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowNewCollectionInput(true)}
                className={`w-full p-3 rounded-lg flex items-center justify-between mt-4 ${darkMode
                  ? 'bg-primary-darkmode hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                  >
                    <MdAdd
                      size={24}
                      className={darkMode ? 'text-gray-300' : 'text-gray-700'}
                    />
                  </div>
                  <p className="font-medium">Create new collection</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
      {/* Related Pins Section */}
      <div className="mt-8 px-4">
        <h2 className="text-xl font-bold mb-4">More Like This</h2>
        <InfiniteScroll
          dataLength={relatedPins.length}
          next={fetchMorePins}
          hasMore={hasMore}
          loader={<p className={`text-center ${darkMode ? 'text-gray-300' : ''}`}>Loading more pins...</p>}
          endMessage={<p className={`text-center ${darkMode ? 'text-gray-300' : ''}`}>No more pins to load.</p>}
        >
          <div className="masonry-layout">
            {relatedPins.map((pin) => (
              <div key={pin.id} className="masonry-item relative group">
                <div className={`rounded-lg overflow-hidden relative`}>
                  <Link to={`/detail/${pin.id}`}>
                    <div className="pin-image-container">
                      <img
                        src={pin.image_large_url}
                        alt={pin.title || 'Photo'}
                        className="pin-image w-full h-auto object-cover"
                      />
                      {/* Text overlay that appears on hover */}
                      <div className="text-overlay">
                        <h3 className="text-lg font-medium line-clamp-2-custom">{pin.title || 'Untitled'}</h3>
                        <p className="text-sm line-clamp-2-custom">{pin.description || 'No description available'}</p>

                      </div>
                    </div>
                  </Link>

                  {/* Download Button for Related Pins */}
                  <div
                    className={`absolute top-2 right-2 ${showingDownloadId === pin.id ? 'visible' : 'invisible group-hover:visible'}`}
                    ref={showingDownloadId === pin.id ? relatedDownloadRef : null}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowingDownloadId(showingDownloadId === pin.id ? null : pin.id);
                      }}
                      className={`flex items-center justify-center p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-lg`}
                    >
                      <RiMoreFill className="h-5 w-5" />
                    </button>

                    {/* Download Dropdown for Each Related Pin */}
                    {showingDownloadId === pin.id && (
                      <div className={`absolute z-10 mt-2 right-0 w-40 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownload(pin.image_large_url, pin.title);
                            }}
                            className={`flex items-center px-4 py-2 w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            <MdDownload className="mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
      {/* Visually Similar Images Section */}
      <div className="mt-8 px-4">
        <h2 className="text-xl font-bold mb-4"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {similarImages.length > 0 ? (
            similarImages.map((image, index) => (
              <div key={index} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} relative group`}>
                <img
                  src={image.url}
                  alt={`Similar Image ${index + 1}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />

                {/* Download Button for Similar Images - NEW */}
                <div className="absolute top-2 right-2 invisible group-hover:visible">
                  <button
                    onClick={() => handleDownload(image.url, `similar-image-${index + 1}`)}
                    className={`flex items-center justify-center p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                      } shadow-md hover:shadow-lg`}
                  >
                    <MdDownload className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-center ${darkMode ? 'text-gray-300' : ''}`}></p>
          )}
        </div>
      </div>
    </div>
    
  );
}