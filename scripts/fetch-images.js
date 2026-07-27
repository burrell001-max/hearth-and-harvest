const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

// Ensure target directory exists
const dir = 'assets/images/recipes';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function downloadAndOptimizeImage(imageUrl, targetPath) {
    try {
        // Fetch image directly via URL bypassing SSL revocation issues
        const imgResponse = await axios({ 
            url: imageUrl, 
            responseType: 'arraybuffer',
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        // Compress, resize, and convert to WebP
        await sharp(imgResponse.data)
            .resize(1200, 800, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(targetPath);

        console.log(`Successfully generated and optimized: ${targetPath}`);
    } catch (error) {
        console.error(`Failed to sync image:`, error.message);
    }
}

async function run() {
    console.log("Starting image pipeline (Direct Mode)...");
    
    // Using direct, high-quality public domain food photos from Unsplash URLs
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200', 'assets/images/recipes/garlic-oil-pasta.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1200', 'assets/images/recipes/creamy-tomato-pasta.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=1200', 'assets/images/recipes/one-pan-pasta.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1626028937210-754d2118d5f7?q=80&w=1200', 'assets/images/recipes/baked-ziti.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1497888329096-51c27beff665?q=80&w=1200', 'assets/images/recipes/overnight-oats.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=1200', 'assets/images/recipes/sesame-noodles.webp');
    await downloadAndOptimizeImage('https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=1200', 'assets/images/recipes/fudgy-brownies.webp');
    
    console.log("Image pipeline complete!");
}

run();
