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
  // Get the part after '/upload/' and before the file extension
  const path = url.split('/upload/')[1].split('.')[0];
  
  // Remove the version part (e.g., 'v1612345678/') if present
  const publicId = path.includes('/') ? path.split('/').slice(1).join('/') : path;

  return publicId;
}

export const editFeesController = async (req, res) => {
          const {title} = req.body;
          const { feesId } = req.params; 

          if(!title){
            return res.status(400).json({ message: "Invalid title" });
          }
         if (!mongoose.Types.ObjectId.isValid(feesId)) {
              return res.status(400).json({ message: "Invalid id" });
          }


        const file =await File.findById(feesId);
        if(!file){
            return res.status(400).json({message: "Invalid id"});
        }
        const public_id = getPublicIdFromUrl(file.description);

        const verify = await deleteFromCloudinary(public_id);

        if(!verify){
          return res.status(500).json({message: "Failed to delete file from Cloudinary"});
        }

        const url = await uploadOnCloudinary(req.file.path);
        if(!url){
          return res.status(500).json({message: "Failed to upload file on Cloudinary"});
        }
        file.title = title;
        file.description = url.secure_url;
        await file.save();
        res.status(200).json({message: "Fees updated successfully", file});        
}
export const getFees = (req,res)=>{
     const fees = File.find();
     if(!fees){
       return res.status(404).json({message: "No fees details available"});
     }
     res.status(200).json({message: "Fees details", fees: fees});
}