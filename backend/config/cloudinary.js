/**
 * Cloudinary File Storage Configuration
 * 
 * Concept:
 * Cloudinary provides cloud-based image/document storage.
 * In development, if credentials are dummy or missing, the application can either
 * mock the upload URL or save files to a local public/uploads directory.
 */
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
  isConfigured: () => {
    return (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'demo_key'
    );
  },
};

module.exports = cloudinaryConfig;
