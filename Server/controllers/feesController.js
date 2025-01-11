import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/imgeUploader.js"; // Corrected the typo in the import
import File from "../models/feesModel.js"; // Use a consistent and clear name for your model
import { z } from "zod";
import mongoose from "mongoose";

const isString = z.string();

export const feesController = async (req, res) => {
  try {
    const { title } = req.body;
    const string = isString.safeParse(title);

    if (!string.success) {
      return res.status(400).json({
        message: "Invalid title",
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const uploadedFile = await uploadOnCloudinary(file.path);
    if (!uploadedFile) {
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }
    //console.log(getPublicIdFromUrl(uploadedFile.secure_url));
    const newFile = new File({
      title,
      description: uploadedFile.secure_url,
    });
    await newFile.save();

    res.status(201).json({ message: "File created successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

function getPublicIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/upload/');
    if (segments.length < 2) {
      console.error("Invalid Cloudinary URL format:", url);
      return null;
    }
    const publicIdWithExtension = segments[1];
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    
    // Remove version prefix if present (e.g., "v1736620878/")
    const cleanedPublicId = publicId.split('/').slice(1).join('/');
    
    return cleanedPublicId;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

export const editFeesController = async (req, res) => {
  try {
    const { title } = req.body;
    const { feesId } = req.params; 

    if (!title) {
      return res.status(400).json({ message: "Invalid title" });
    }
    if (!mongoose.Types.ObjectId.isValid(feesId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const fee = await File.findById(feesId);
    if (!fee) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const public_id = getPublicIdFromUrl(fee.description);
    if (!public_id) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    console.log(`Attempting to delete Cloudinary image with public_id: ${public_id}`);

    const verify = await deleteFromCloudinary(public_id, "image"); // Added resource_type

    if (!verify) {
      return res.status(500).json({ message: "Failed to delete file from Cloudinary" });
    }

    const uploadedUrl = req.file ? await uploadOnCloudinary(req.file.path) : null;
    if (req.file && !uploadedUrl) {
      return res.status(500).json({ message: "Failed to upload new file to Cloudinary" });
    }

    if (uploadedUrl) {
      fee.description = uploadedUrl.secure_url;
    }
    fee.title = title;
    await fee.save();

    res.status(200).json({ message: "Fees updated successfully", file: fee });
  } catch (error) {
    console.error("Edit Fees Error:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const deleteFeesController = async (req, res) => {
  try {
    const { feesId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(feesId)) {
      return res.status(400).json({ message: "Invalid fee ID" });
    }

    const fee = await File.findById(feesId);
    if (!fee) {
      return res.status(404).json({ message: "Fee detail not found" });
    }

    const public_id = getPublicIdFromUrl(fee.description);

    //console.log(`Attempting to delete Cloudinary image with public_id: ${public_id}`);

    const deleted = await deleteFromCloudinary(public_id, "image"); // Added resource_type

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
    }

    await File.findByIdAndDelete(feesId);

    res.status(200).json({ message: "Fee detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getFees = async (req,res)=>{
     const fees = await File.find();
     if(!fees){
       return res.status(404).json({message: "No fees details available"});
     }
     res.status(200).json({message: "Fees details", fees: fees});
}