import React, { useState, useEffect, useRef } from "react";
import { RiShare2Line } from "react-icons/ri";
import { MdDarkMode, MdLightMode, MdClose, MdAdd } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const BASE_URL = "https://api.unsplash.com";
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function DetailModal({ pinId, onClose }) {
  const [pin, setPin] = useState(null);
  const [relatedPins, setRelatedPins] = useState([]);
  const [similarImages, setSimilarImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const [savedCollections, setSavedCollections] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    const savedCollectionsData =
      JSON.parse(localStorage.getItem("savedCollections")) || [];
    setSavedCollections(savedCollectionsData);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSaveModal(false);
        setShowNewCollectionInput(false);
        setNewCollectionName("");
      }
    }

    if (showSaveModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSaveModal]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setPage(1);
        setRelatedPins([]);

        const pinData = await fetchPinDetails(pinId);
        setPin(pinData);

        const savedCollectionsData =
          JSON.parse(localStorage.getItem("savedCollections")) || [];
        setIsSaved(
          savedCollectionsData.some((collection) =>
            collection.images.some(
              (image) => image.url === pinData.image_large_url
            )
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [pinId]);

  const fetchPinDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/photos/${id}`, {
      params: {
        client_id: UNSPLASH_API_KEY,
      },
    });
    return {
      id: response.data.id,
      title:
        response.data.description ||
        response.data.alt_description ||
        "Untitled",
      description: response.data.alt_description || "No description available",
      image_large_url: response.data.urls.regular,
      user: {
        username: response.data.user.username,
        profile_image: response.data.user.profile_image.medium,
      },
      likes: response.data.likes,
    };
  };

  const fetchRelatedPins = async (query = "nature", page = 1) => {
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
      title: item.description || item.alt_description || "Untitled",
      description: item.alt_description || "No description available",
      image_large_url: item.urls.regular,
      user: {
        username: item.user.username,
        profile_image: item.user.profile_image.medium,
      },
    }));
  };

  const fetchMorePins = async () => {
    try {
      const newPage = page + 1;
      const relatedData = await fetchRelatedPins(
        pin?.title || "nature",
        newPage
      );
      if (relatedData.length > 0) {
        setRelatedPins((prevPins) => [...prevPins, ...relatedData]);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more pins:", error);
    }
  };

  const openSaveModal = () => {
    if (isSaved) {
      handleRemoveFromAllCollections();
    } else {
      setShowSaveModal(true);
    }
  };

  const handleRemoveFromAllCollections = () => {
    const updatedCollections = savedCollections.map((collection) => ({
      ...collection,
      images: collection.images.filter(
        (image) => image.url !== pin.image_large_url
      ),
    }));

    const nonEmptyCollections = updatedCollections.filter(
      (collection) => collection.images.length > 0
    );

    setSavedCollections(nonEmptyCollections);
    localStorage.setItem(
      "savedCollections",
      JSON.stringify(nonEmptyCollections)
    );
    setIsSaved(false);
  };

  const handleSaveToCollection = (collectionName) => {
    const savedPin = {
      url: pin.image_large_url,
      title: pin.title || "Untitled",
      id: pin.id,
    };

    const existingCollectionIndex = savedCollections.findIndex(
      (collection) => collection.name === collectionName
    );

    if (existingCollectionIndex !== -1) {
      const updatedCollections = [...savedCollections];
      const imageExists = updatedCollections[
        existingCollectionIndex
      ].images.some((img) => img.url === savedPin.url);

      if (!imageExists) {
        updatedCollections[existingCollectionIndex].images.push(savedPin);
      }

      setSavedCollections(updatedCollections);
      localStorage.setItem(
        "savedCollections",
        JSON.stringify(updatedCollections)
      );
    } else {
      const newCollection = {
        name: collectionName,
        images: [savedPin],
      };
      const updatedCollections = [...savedCollections, newCollection];
      setSavedCollections(updatedCollections);
      localStorage.setItem(
        "savedCollections",
        JSON.stringify(updatedCollections)
      );
    }

    setIsSaved(true);
    setShowSaveModal(false);
    setShowNewCollectionInput(false);
    setNewCollectionName("");
  };

  const handleCreateNewCollection = (e) => {
    e.preventDefault();
    if (newCollectionName.trim() !== "") {
      handleSaveToCollection(newCollectionName);
    }
  };

  const handleDownload = () => {
    if (pin?.image_large_url) {
      const link = document.createElement("a");
      link.href = pin.image_large_url;
      link.download = `unsplash-${pin.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading)
    return (
      <div
        className={`text-center ${darkMode ? "text-white bg-gray-900" : ""}`}
      >
        Loading...
      </div>
    );
  if (!pin)
    return (
      <div
        className={`text-center ${darkMode ? "text-white bg-gray-900" : ""}`}
      >
        No data available.
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-lg w-full max-w-5xl max-h-screen overflow-y-auto ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Section */}
            <div className="flex-1">
              {pin?.image_large_url ? (
                <img
                  src={pin.image_large_url}
                  alt={pin.title || "Photo"}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <div
                  className={`w-full h-64 flex justify-center items-center rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                >
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    No Image Available
                  </p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-2/5 flex flex-col space-y-4">
              <h1 className="text-2xl font-bold">{pin?.title || "Untitled"}</h1>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                {pin?.description || "No description available"}
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={
                    pin?.user?.profile_image || "https://via.placeholder.com/50"
                  }
                  alt={pin?.user?.username || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <span className="ml-3 font-medium">
                  {pin?.user?.username || "Anonymous"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  Download
                </button>

                <button
                  className={`${
                    isSaved
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded-full text-sm font-medium`}
                  onClick={openSaveModal}
                >
                  {isSaved ? "Saved" : "Save"}
                </button>

                <button
                  className={`flex items-center px-4 py-2 rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <RiShare2Line className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Related Pins Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">More Like This</h2>
            <InfiniteScroll
              dataLength={relatedPins.length}
              next={fetchMorePins}
              hasMore={hasMore}
              loader={
                <p className={`text-center ${darkMode ? "text-gray-300" : ""}`}>
                  Loading more pins...
                </p>
              }
              endMessage={
                <p className={`text-center ${darkMode ? "text-gray-300" : ""}`}>
                  No more pins to load.
                </p>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedPins.map((pin) => (
                  <div
                    key={pin.id}
                    className={`rounded-lg overflow-hidden ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <img
                      src={pin.image_large_url}
                      alt={pin.title || "Photo"}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-medium truncate">
                        {pin.title || "Untitled"}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              } rounded-lg p-6 w-full max-w-md relative`}
            >
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setShowNewCollectionInput(false);
                  setNewCollectionName("");
                }}
                className="absolute top-2 right-2 p-1 rounded-full"
              >
                <MdClose
                  size={24}
                  className="text-gray-500 hover:text-gray-700"
                />
              </button>

              <h2 className="text-xl font-bold mb-4">Save to Collection</h2>

              <div className="mb-4 max-h-60 overflow-y-auto">
                {savedCollections.length > 0 ? (
                  <div className="space-y-2">
                    {savedCollections.map((collection) => (
                      <div
                        key={collection.name}
                        onClick={() => handleSaveToCollection(collection.name)}
                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
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
                  <p className="text-gray-500 text-center py-4">
                    No collections yet
                  </p>
                )}
              </div>

              {showNewCollectionInput ? (
                <form onSubmit={handleCreateNewCollection} className="mt-4">
                  <input
                    type="text"
                    placeholder="Collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className={`w-full p-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-black"
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
                      className={`px-4 py-2 rounded-lg ${
                        newCollectionName.trim()
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Create
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewCollectionInput(true)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } mt-4`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-lg ${
                        darkMode ? "bg-gray-600" : "bg-gray-200"
                      } flex items-center justify-center mr-3`}
                    >
                      <MdAdd
                        size={24}
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      />
                    </div>
                    <p className="font-medium">Create new collection</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
