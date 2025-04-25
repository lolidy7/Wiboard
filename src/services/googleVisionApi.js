// src/services/googleVisionApi.js
export const analyzeImage = async (imageUrl) => {
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
          },
        ],
      }),
    });
    return response.json();
  };