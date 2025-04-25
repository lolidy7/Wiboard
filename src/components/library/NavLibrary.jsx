import React, { useState, useEffect } from "react";

// Default empty data for Likes and Saved collections
const defaultLikedImages = [];
const defaultSavedCollections = [];

export default function NavLibrary() {
  // Initialize state from localStorage, or use default empty data if none exists
  const [likedImagesState, setLikedImagesState] = useState(() => {
    try {
      const saved = localStorage.getItem("likedImages");
      return saved ? JSON.parse(saved) : defaultLikedImages;
    } catch (error) {
      console.error("Error parsing likedImages from localStorage:", error);
      return defaultLikedImages;
    }
  });

  const [savedCollectionsState, setSavedCollectionsState] = useState(() => {
    try {
      const saved = localStorage.getItem("savedCollections");
      return saved ? JSON.parse(saved) : defaultSavedCollections;
    } catch (error) {
      console.error("Error parsing savedCollections from localStorage:", error);
      return defaultSavedCollections;
    }
  });

  const [activeTab, setActiveTab] = useState("Likes");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [unsavedPins, setUnsavedPins] = useState([]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("likedImages", JSON.stringify(likedImagesState));
  }, [likedImagesState]);

  useEffect(() => {
    localStorage.setItem(
      "savedCollections",
      JSON.stringify(savedCollectionsState)
    );
  }, [savedCollectionsState]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCollection(null);
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  const handleDeleteCollection = (e) => {
    e.stopPropagation();

    if (
      window.confirm(
        `Are you sure you want to delete the collection "${selectedCollection.name}"?`
      )
    ) {
      setSavedCollectionsState((prev) =>
        prev.filter((collection) => collection.name !== selectedCollection.name)
      );
      setSelectedCollection(null);
    }
  };

  return (
    <>
      <div className=" -m-4 min-h-screen bg-primary dark:bg-primary-darkmode p-4 sm:p-6 md:p-8 transition-colors duration-300">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-primary">
          Your Saved Library
        </h1>
        {/* Tabs */}
        <div className="flex border-gray-300 mb-6 space-x-4">
          <button
            className={`px-4 py-2 text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === "Likes"
                ? "border-b-4 rounded-b-sm border-green-500 text-black dark:text-primary"
                : "text-gray-500 border-b-2 border-transparent hover:border-gray-300"
            }`}
            onClick={() => handleTabChange("Likes")}
          >
            Likes
          </button>
          <button
            className={`px-4 py-2 text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === "Saved"
                ? "border-b-4 rounded-b-sm border-green-500 text-black dark:text-primary"
                : "text-gray-500 border-b-2 border-transparent hover:border-gray-300"
            }`}
            onClick={() => handleTabChange("Saved")}
          >
            Saved
          </button>
        </div>
        {/* Content Based on Active Tab */}
        {activeTab === "Likes" ? (
          // Likes Tab: Show Liked Images or empty state
          <div>
            {likedImagesState.length > 0 ? (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                {likedImagesState.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="w-full">
                      <img
                        src={image.url}
                        alt={`Liked item ${index + 1}`}
                        className="w-full h-auto object-cover rounded-t-lg hover:scale-101 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/50">
                      <div className="flex items-center space-x-3">
                        {/* Unlike Button */}
                        <button
                          className="flex items-center text-white hover:scale-110 transition-transform duration-200"
                          onClick={() => {
                            setLikedImagesState((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="ml-1 text-sm">Unlike</span>
                        </button>
                        {/* Share Button */}
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                <div className="text-xl mb-2">No liked images yet</div>
                <p>Start liking images to see them here</p>
              </div>
            )}
          </div>
        ) : (
          // Saved Tab: Show Collections or Images in Selected Collection
          <div>
            {selectedCollection ? (
              // Show Images in Selected Collection
              <div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => setSelectedCollection(null)}
                  >
                    ← Back to Collections
                  </button>
                  {/* Delete Collection Button */}
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center"
                    onClick={handleDeleteCollection}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Collection
                  </button>
                </div>
                {selectedCollection.images.length > 0 ? (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                    {selectedCollection.images.map((image, index) => {
                      const isUnsaved = unsavedPins.some(
                        (unsavedPin) => unsavedPin.url === image.url
                      );

                      if (isUnsaved) return null;

                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col mb-4"
                        >
                          <div className="w-full relative">
                            <img
                              src={image.url}
                              alt={`Saved item ${index + 1}`}
                              className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                            />
                            {/* Unsave Button */}
                            <button
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => {
                                setUnsavedPins((prev) => [...prev, image]);
                                setSavedCollectionsState((prev) =>
                                  prev.map((collection) =>
                                    collection.name === selectedCollection.name
                                      ? {
                                          ...collection,
                                          images: collection.images.filter(
                                            (img) => img.url !== image.url
                                          ),
                                        }
                                      : collection
                                  )
                                );
                              }}
                            >
                              Unsave
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-6">
                    <div className="text-xl mb-2">
                      No images in this collection
                    </div>
                    <p>Start saving images to this collection</p>
                  </div>
                )}
              </div>
            ) : (
              // Show List of Collections or empty state
              <div>
                {savedCollectionsState.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {savedCollectionsState.map((collection, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                        onClick={() => handleCollectionClick(collection)}
                      >
                        <div className="w-full h-48 overflow-hidden">
                          <img
                            src={
                              collection.images.length > 0
                                ? collection.images[0].url
                                : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                            }
                            alt=""
                            className="w-full h-full object-cover rounded-t-lg hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <span className="block w-full text-start text-white bg-green-600 py-2 pl-2">
                            {collection.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    <div className="text-xl mb-2">No collections yet</div>
                    <p>Create your first collection to start saving images</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
