import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/explore/NoScroll.css";

export default function Explore() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCategories, setVisibleCategories] = useState(8);
  const [visibleFeatured, setVisibleFeatured] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPhotos, setCategoryPhotos] = useState([]);
  const [isSeeMoreClicked, setSeeMoreClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCategoryPhotos, setLoadingCategoryPhotos] = useState(false);

  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  
  // Skeleton placeholder component
  const SkeletonPlaceholder = ({ count = 1, type = "image" }) => {
    const items = Array.from({ length: count }, (_, i) => i);
    
    if (type === "image") {
      return items.map((item) => (
        <div key={item} className="relative h-64 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="absolute inset-0"></div>
        </div>
      ));
    }
    
    return items.map((item) => (
      <div key={item} className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    ));
  };

  const loadMoreCategories = () => {
    setSeeMoreClicked(true);
    setVisibleCategories((prev) => prev + 8);
  };

  const seeLessCategories = () => {
    setSeeMoreClicked(false);
    setVisibleCategories((prev) => prev - 8);
  };

  const loadMoreFeatured = () => {
    setVisibleFeatured((prev) => prev + 8);
  };

  // Function to fetch photos for a specific category
  const fetchCategoryPhotos = async (slug) => {
    try {
      setLoadingCategoryPhotos(true);
      const response = await fetch(
        `https://api.unsplash.com/topics/${slug}/photos?per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category photos");
      }
      const data = await response.json();
      setCategoryPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategoryPhotos(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchCategoryPhotos(category.slug);
  };

  // Close modal
  const closeModal = () => {
    setSelectedCategory(null);
    setCategoryPhotos([]);
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      
      const data = await response.json();
      const formattedResults = data.results.map((photo) => ({
        id: photo.id,
        url: photo.urls.regular,
        title: photo.alt_description || "Untitled",
        subtitle: "Search Result",
        user: photo.user.name,
        userUrl: photo.user.links.html,
      }));
      
      setSearchResults(formattedResults);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const featuredResponse = await fetch(
          `https://api.unsplash.com/photos/random?count=20&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!featuredResponse.ok) {
          throw new Error("Oops! Something went wrong.");
        }

        const featuredData = await featuredResponse.json();
        const formattedFeatured = featuredData.map((photo) => ({
          id: photo.id,
          url: photo.urls.regular,
          title: photo.alt_description || "Untitled",
          subtitle: "Featured",
          user: photo.user.name,
          userUrl: photo.user.links.html,
        }));
        setFeaturedImages(formattedFeatured);

        const categoriesResponse = await fetch(
          `https://api.unsplash.com/topics?per_page=20&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories from Unsplash");
        }

        const categoriesData = await categoriesResponse.json();
        const formattedCategories = await Promise.all(
          categoriesData.map(async (topic) => {
            const photoResponse = await fetch(
              `https://api.unsplash.com/topics/${topic.slug}/photos?per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
            );
            const photoData = await photoResponse.json();

            return {
              id: topic.id,
              name: topic.title,
              imageUrl: photoData[0]?.urls?.regular || "",
              slug: topic.slug,
            };
          })
        );

        setCategories(formattedCategories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePhotoClick = (photoId) => {
    navigate(`/detail/${photoId}`);
  };

  if (loading && !isSearching) {
    return (
      <div className="dark:bg-gray-800 font-sans -m-4 pb-5">
        {/* Search bar skeleton */}
        <section className="flex justify-center">
          <div className="hidden sm:block md:w-1/2 lg:w-3/4 xl:w-2/3 mx-5 h-10 mt-10">
            <div className="relative h-full">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-full h-12 animate-pulse"></div>
            </div>
          </div>
        </section>

        <main className="w-11/12 mx-auto">
          {/* Title skeleton */}
          <section className="mt-10">
            <div className="h-12 w-1/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-1/4 mx-auto mt-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </section>

          {/* Featured images skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10 mt-10">
            <SkeletonPlaceholder count={8} />
          </div>

          {/* Categories section skeleton */}
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-5"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
            <SkeletonPlaceholder count={8} />
          </div>

          {/* Popular searches skeleton */}
          <div className="w-11/12 mx-auto hidden lg:block mt-10">
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-5"></div>
            <div className="flex flex-wrap gap-4 mt-5">
              <SkeletonPlaceholder count={8} type="text" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-800 -m-4">
        <span className="text-xl text-red-500">Error: {error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="dark:bg-gray-800 font-sans -m-4 pb-5 transition-colors duration-300">
        {/* Search bar */}
        <section className="flex justify-center">
          <form
            onSubmit={handleSearch}
            className="hidden sm:block md:w-1/2 lg:w-3/4 xl:w-2/3 mx-5 h-10 mt-10"
          >
            <div className="relative h-full">
              <input
                className="bg-white border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-full w-full h-12 px-5 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                id="SearchTerm"
                type="text"
                placeholder="Explore"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-0 top-0 bottom-0 flex items-center">
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </section>

        <main className="w-11/12 mx-auto">
          {isSearching ? (
            // Search results view
            <>
              <section className="mt-10">
                <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-center">
                  Search Results for "{searchQuery}"
                </h1>
              </section>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-10">
                  <SkeletonPlaceholder count={12} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-10 ">
                  {searchResults.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-64 rounded-xl overflow-hidden object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer hover:opacity-85"
                      onClick={() => handlePhotoClick(image.id)}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer rounded-xl"
                      />
                      {/* Image overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-end mb-4 text-white text-center px-2">
                        <h2 className="font-bold">{image.title}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <section className="flex justify-center my-10">
                <button
                  onClick={clearSearch}
                  className="hover:bg-btn-hover hover:text-white/90 rounded-2xl w-50 px-4 py-2 transition-colors"
                >
                  <span className="text-xl dark:text-white">
                    Back to Explore
                  </span>
                </button>
              </section>
            </>
          ) : (
            // Default explore view
            <>
              <section className="mt-10">
                <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-center">
                  Explore the best of Wiboard
                </h1>
                <span className="flex justify-center mb-10 text-lg md:text-xl mt-5 dark:text-white">
                  Stay inspired
                </span>
              </section>

              {/* Featured images - first row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                {featuredImages
                  .slice(0, Math.min(visibleFeatured, 8))
                  .map((image) => (
                    <div
                      key={image.id}
                      className="relative h-64 rounded-xl overflow-hidden object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer hover:opacity-85 group"
                      onClick={() => handlePhotoClick(image.id)}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer rounded-xl"
                      />
                      {/* Image overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-end mb-4 text-white text-center px-2">
                        <h2 className="font-bold">{image.title}</h2>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Show more featured images if available */}
              {visibleFeatured > 8 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
                  {featuredImages.slice(8, visibleFeatured).map((image) => (
                    <div
                      key={image.id}
                      className="relative h-64 rounded-xl overflow-hidden object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer hover:opacity-85"
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out cursor-pointer rounded-xl"
                      />
                      {/* Image overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-end mb-4 text-white text-center px-2">
                        <p className="text-sm">By {image.user}</p>
                        <h2 className="text-lg font-bold">{image.title}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <section className="flex justify-center my-10">
                {featuredImages.length > visibleFeatured && (
                  <button
                    onClick={loadMoreFeatured}
                    className="rounded-2xl w-30 px-4 py-2 transition-colors hover:bg-btn-hover hover:text-white/90"
                  >
                    <span className="text-xl dark:text-white">See More</span>
                  </button>
                )}
              </section>

              {/* Categories section */}
              <span className="text-3xl md:text-4xl font-bold dark:text-white text-black">
                Browse by Category
              </span>

              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                  {categories.slice(0, visibleCategories).map((category) => (
                    <div
                      key={category.id}
                      className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-300 ease-in-out group-hover:opacity-85 rounded-xl"
                      />
                      {/* Image overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-lg font-bold">{category.name}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Show additional categories when "See More" is clicked */}
              {visibleCategories > 8 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                  {categories.slice(16, visibleCategories).map((category) => (
                    <div
                      key={category.id}
                      className="relative h-64 rounded-xl overflow-hidden group"
                    >
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-300 ease-in-out cursor-pointer group-hover:opacity-85 rounded-xl"
                      />
                      {/* Image overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-lg font-bold">{category.name}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <section className="flex justify-center my-10">
                {categories.length > visibleCategories && (
                  <button
                    onClick={loadMoreCategories}
                    className="hover:bg-btn-hover hover:text-white/90 rounded-2xl w-30 px-4 py-2 transition-colors"
                  >
                    <span className="text-xl dark:text-white hover:bg-btn-hover hover:text-white/90">
                      See More
                    </span>
                  </button>
                )}
              </section>

              <section className="flex justify-center my-10">
                {isSeeMoreClicked && (
                  <button
                    onClick={seeLessCategories}
                    className="hover:bg-btn-hover rounded-2xl w-30 px-4 py-2 transition-colors"
                  >
                    <span className="text-xl dark:text-white">See Less</span>
                  </button>
                )}
              </section>
            </>
          )}
        </main>

        {/* Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-lg overflow-y-auto no-scrollbar bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold dark:text-white">
                    {selectedCategory.name}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {loadingCategoryPhotos ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SkeletonPlaceholder count={12} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative h-64 rounded-lg overflow-hidden group"
                        onClick={() => handlePhotoClick(photo.id)}
                      >
                        <img
                          src={photo.urls.regular}
                          alt={photo.alt_description || "Photo"}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300 ease-in-out"
                        />
                        {/* Image overlay for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-white text-sm">
                          <p> {photo.alt_description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Popular searches */}
        {!isSearching && (
          <div className="w-11/12 mx-auto hidden lg:block dark:text-white ">
            <span className="text-4xl font-bold">Search popular Ideas</span>
            <div className="flex flex-wrap gap-4 mt-5">
              {categories.slice(0, visibleCategories).map((category) => (
                <div
                  key={category.id}
                  className="flex items-center cursor-pointer hover:underline"
                  onClick={() => {
                    setSearchQuery(category.name);
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 hover:text-gray-500 mr-2"
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
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}