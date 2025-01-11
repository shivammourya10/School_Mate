import syllabus from "../models/syllabusModel.js"
import { z } from 'zod';
import {uploadOnCloudinary , deleteFromCloudinary} from "../utils/imgeUploader.js";


const isString = z.string();

export const syllabusController = async (req,res)=>{
    const {title} = req.body;

    const string = isString.safeParse(title);
    console.log(req.file);
    if(!string.success){
        return res.status(400).json({message: "Title is required"});
    } 
    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if(!uploadedFile){
        return res.status(500).json({message: "Failed to upload pdf on Cloudinary"});
    }

    const syll =  new syllabus({
      title : title,
      description : uploadedFile.secure_url,
    })
    const savedClass = await syll.save();

    res.status(201).json({message: "Class created successfully", kaksha: savedClass});
}
function getPublicIdFromUrl(url) {
    const path = url.split('/upload/')[1].split('.')[0];
    const publicId = path.includes('/') ? path.split('/').slice(1).join('/') : path;
    return publicId;
}

export const updateSyllabusController = async (req, res) => {
    const { syllabusId } = req.params;
    const { title } = req.body; 
    const file = req.file;
    
    // Validate title
    const string = isString.safeParse(title);
    if (!string.success) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        // Find the syllabus to be updated
        const syll = await syllabus.findById(syllabusId);
        if (!syll) {
            return res.status(404).json({ message: "Syllabus not found" });
        }

        // Delete the old file from Cloudinary if there's a new one
        if (file) {
            const publicId = getPublicIdFromUrl(syll.description);
            const deletionResponse = await deleteFromCloudinary(publicId);
            if (!deletionResponse) {
                return res.status(500).json({ message: "Failed to delete previous file from Cloudinary" });
            }

            // Upload the new file to Cloudinary
            const uploadedFile = await uploadOnCloudinary(file.path);
            if (!uploadedFile) {
                return res.status(500).json({ message: "Failed to upload new file on Cloudinary" });
            }

            // Update the syllabus with the new file URL
            syll.description = uploadedFile.secure_url;
        }

        // Update the title
        syll.title = title;

        // Save the updated syllabus
        const updatedSyllabus = await syll.save();

        res.status(200).json({ message: "Syllabus updated successfully", syllabus: updatedSyllabus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getSyllabus = async (req, res) => {
        const syll = await syllabus.find();
        if(!syll){
            return res.status(404).json({message: "No Syllabus found"});
        }
       res.status(200).json({message: "All Syllabus", syllabus: syll});
}

// Add deleteSyllabusController
export const deleteSyllabusController = async (req, res) => {
    const { syllabusId } = req.params;

    try {
        // Find the syllabus to be deleted
        const syll = await syllabus.findById(syllabusId);
        if (!syll) {
            return res.status(404).json({ message: "Syllabus not found" });
        }

        // Delete the file from Cloudinary
        const publicId = getPublicIdFromUrl(syll.description);
        const deletionResponse = await deleteFromCloudinary(publicId);
        if (!deletionResponse) {
            return res.status(500).json({ message: "Failed to delete file from Cloudinary" });
        }

        // Remove the syllabus from the database
        await syllabus.findByIdAndDelete(syllabusId);

        res.status(200).json({ message: "Syllabus deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};