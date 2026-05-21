import getCloudinary from "../lib/cloudinary.js";

/**
 * Upload un buffer vers Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder  - dossier Cloudinary (ex: "events/album-id")
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(buffer, folder = "events") {
  const cloudinary = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload échoué"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Supprime une image Cloudinary par son public_id.
 */
export async function deleteImage(publicId) {
  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
