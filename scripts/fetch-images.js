const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

// Configuration: Replace with your actual free Unsplash/Pexels API token
const API_KEY = process.env.UNSPLASH_API_KEY || 'YOUR_ACCESS_KEY';

const directories = [
  'assets/images/recipes',
  'assets/images/categories',
  'assets/images/cuisines',
  'assets/images/equipment'
];

// Ensure all target directories exist
directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

async function downloadAndOptimizeImage(searchQuery, targetPath) {
  try {
    // Queries Unsplash for high-quality royalty-free food images
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: searchQuery, per_page: 1, orientation: 'landscape' },
      headers: { Authorization: `Client-ID ${API_KEY}` }
    });

    if (response.data.results.length === 0) return;
    const imageUrl = response.data.results[0].urls.regular;

    const imgResponse = await axios({ url: imageUrl, responseType: 'arraybuffer' });
    
    // Processing pipeline: Compresses, sizes, converts to WebP for < 2s page speeds
    await sharp(imgResponse.data)
      .resize(1200, 800, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(targetPath);

    console.log(`Successfully generated and optimized: ${targetPath}`);
  } catch (error) {
    console.error(`Failed to sync image for ${searchQuery}:`, error.message);
  }
}

// Example execution hook
// downloadAndOptimizeImage('fluffy pancakes food photography', 'assets/images/recipes/pancakes-hero.webp');
