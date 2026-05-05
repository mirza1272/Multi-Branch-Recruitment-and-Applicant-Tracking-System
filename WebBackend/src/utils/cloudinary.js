import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_FOLDERS } from "../constants.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - file data
 * @param {string} folder     - cloudinary folder path
 * @param {string} publicId   - optional custom public ID
 * @returns {Promise<string>} - secure URL of the uploaded file
 */
export const uploadToCloudinary = (fileBuffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: "raw", // raw = non-image files (PDF, DOCX)
      format: "pdf",
    };
    if (publicId) options.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });

    stream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by URL
 * @param {string} fileUrl - secure_url returned by Cloudinary
 */
export const deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    // Extract public_id from URL
    // URL pattern: .../upload/v<version>/<folder>/<filename>.<ext>
    const parts = fileUrl.split("/");
    const folderAndFile = parts.slice(parts.indexOf("upload") + 2).join("/");
    const publicId = folderAndFile.replace(/\.[^/.]+$/, ""); // strip extension
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

export { cloudinary, CLOUDINARY_FOLDERS };
