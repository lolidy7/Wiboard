import axios from 'axios';

// Base URLs and API keys
const BASE_URL = 'https://api.unsplash.com';
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Fetch details of a specific image (based on ID)
export const fetchPinDetails = async (id) => {
  try {
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
  } catch (error) {
    console.error('Error fetching pin details:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch related images (based on a search query or random images)
export const fetchRelatedPins = async (query = 'nature', page = 1) => {
  try {
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
  } catch (error) {
    console.error('Error fetching related pins:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch visually similar images using Google Vision API
export const fetchSimilarImagesWithVision = async (imageUrl) => {
  try {
    // Step 1: Validate the image URL
    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('Invalid image URL. Please provide a publicly accessible URL.');
    }

    console.log('Fetching visually similar images for:', imageUrl);

    // Step 2: Validate the API key
    if (!GOOGLE_API_KEY) {
      throw new Error('Google API Key is missing or undefined. Check your .env file.');
    }

    // Step 3: Construct the request body
    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: 'WEB_DETECTION',
            },
          ],
        },
      ],
    };

    console.log('Request Body:', requestBody);

    // Step 4: Send the request to Google Vision API
    const response = await axios.post(
      `${GOOGLE_VISION_API_URL}?key=${GOOGLE_API_KEY}`,
      requestBody
    );

    // Step 5: Extract visually similar images from the response
    const webEntities = response.data.responses[0].webDetection?.visuallySimilarImages || [];
    return webEntities.map((item) => ({
      url: item.url,
    }));
  } catch (error) {
    console.error('Error fetching similar images:', error.response?.data || error.message);
    throw error;
  }
};