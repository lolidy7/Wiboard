import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/home/Home.css';
import "../components/chatbot/Chatbot"
import Chatbot from '../components/chatbot/Chatbot';

const ImageSearch = () => {
  const [query, setQuery] = useState("Nature");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 
  
    useEffect(() => {
    console.log('API Key Status:', API_KEY ? 'Key loaded successfully' : 'MISSING API KEY');
    if (!API_KEY) {
      setError("API configuration error - please contact support");
    } else {
      fetchImages(1, query); 
    }
  }, []);

  const lastImageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: '400px', threshold: 0.01 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchImages = async (pageNumber, searchQuery) => {
    if (!hasMore || !searchQuery.trim() || !API_KEY) return;

    setLoading(true);
    setError("");
    
    try {
      console.log(`Fetching page ${pageNumber} for: "${searchQuery}"`);
      
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: searchQuery,
          page: pageNumber,
          per_page: 30,
          client_id: API_KEY,
        },
        timeout: 10000
      });

      const newImages = response.data.results;
      setImages((prev) => 
        pageNumber === 1 ? newImages : [...prev, ...newImages]
      );

      setHasMore(pageNumber < (response.data.total_pages || 1));
      
    } catch (error) {
      handleApiError(error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setError("Invalid API key. Please check your configuration.");
          break;
        case 403:
          setError("API rate limit exceeded. Try again later.");
          break;
        case 404:
          setError("No images found for this search.");
          break;
        default:
          setError(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      setError("Network error - could not connect to image service");
    } else {
      setError(`Request error: ${error.message}`);
    }
  };

  const searchImages = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }
    setError("");
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1, query);
  };

  useEffect(() => {
    if (page > 1) {
      fetchImages(page, query);
    }
  }, [page]);

  return (
    <div className="image-search-container bg-primary dark:bg-zinc-800 -m-4 dark:text-primary transition-colors duration-300">
      <div className="search-section">
        <form onSubmit={searchImages} className="Explore-form">
          <input
            type="text"
            placeholder="Explore..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Explore'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => fetchImages(page, query)}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      )}
      

      <div className="image-grid dark:bg-zinc-800 transition-colors duration-300">
        {images.map((image, index) => (
          <Link
            to={`/detail/${image.id}`}
            key={`${image.id}-${index}`}
            className="image-card"
            ref={images.length === index + 1 ? lastImageElementRef : null}
          >
            <div 
              className="image-placeholder" 
              style={{ paddingBottom: `${(image.height / image.width) * 100}%` }}
            />
            <img
              src={image.urls.regular}
              alt={image.alt_description || `Image by ${image.user.name}`}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
              }}
            />
            <div className="image-meta">
              <p className="photographer">Photo by {image.user.name}</p>
              {image.description && (
                <p className="description">{image.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading more images...</p>
        </div>
      )}

      {!hasMore && images.length > 0 && !loading && (
        <div className="end-of-results">
          <p>No more images to load</p>
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="empty-state">
          <p>No images found. Try a different search term.</p>
        </div>
      )}

      <Chatbot />
    </div>
  );
};

export default ImageSearch; 