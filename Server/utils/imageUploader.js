import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';  // Add the fs import
import dotenv from "dotenv"

dotenv.config({
  path: "./.env"  // Add the path to your .env file
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath, fileType) => {
  try {
    if (!localFilePath) return null;
    const resourceType = fileType === "application/pdf" ? "raw" : "auto";

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      quality: "auto", // Optimizes for delivery
      use_filename: true,
      unique_filename: false,
    });

    console.log("file path is : ", localFilePath);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (e) {
    fs.unlinkSync(localFilePath);
    console.log(e);
    return null;
  }
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error("No public_id provided for deletion.");
      return false;
    }
    console.log(publicId);
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    console.log(result);
    if (result.result !== 'ok' && result.result !== 'not found') {
      console.error(`Cloudinary deletion failed for publicId: ${publicId}`, result);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Cloudinary deletion error for publicId ${publicId}:`, error);
    return false;
  }
};
