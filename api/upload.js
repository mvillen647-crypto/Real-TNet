import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body; // Picha uliyotuma kama Base64 kutoka frontend

    // Upload picha kwenye Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'tnet_scans',
    });

    // Rudisha URL ya picha kwa frontend
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
