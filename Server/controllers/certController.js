import certModel from "../models/certModel.js";
import zod from "zod";
import {uploadOnCloudinary , deleteFromCloudinary} from "../utils/imgeUploader.js";
import { upload } from "../middleware/multerMiddelware.js";
const isString = zod.string();
export const certController = async (req, res) => {
    
    const file = req.file;

    const { title } = req.body;

    const isTitle = isString.safeParse(title);
    if (!isTitle.success) {
        return res.status(400).json({
            message: "Invalid title"
        });
    }
    const uploadedFile = await uploadOnCloudinary(req.file.path);
        if (!uploadedFile) {
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }
        
     const cert = await certModel.create({
        title,
        image: uploadedFile.secure_url,
    });

    res.status(201).json({ message: "Certificate created successfully", cert });
}
function getPublicIdFromUrl(url) {
    const path = url.split('/upload/')[1].split('.')[0];
    
    const publicId = path.includes('/') ? path.split('/').slice(1).join('/') : path;
  
    return publicId;
  }
  export const updateCertController = async (req, res) => {
    const { certId } = req.params;
    const { title } = req.body;
    const file = req.file;

    // Validate certId and file
    if (!certId) {
        return res.status(400).json({ message: "Invalid certificate ID" });
    }
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const cert = await certModel.findById(certId);
        if (!cert) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        // Get publicId and delete the existing image from Cloudinary
        const publicId = getPublicIdFromUrl(cert.image);
        const deletionResponse = await deleteFromCloudinary(publicId);

        if (!deletionResponse) {
            return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
        }

        // Upload the new image
        const uploadedFile = await uploadOnCloudinary(file.path);
        if (!uploadedFile) {
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }

        cert.title = title;
        cert.image = uploadedFile.secure_url;

        await cert.save(); 

        res.status(200).json({ message: "Certificate updated successfully", cert });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getCertificates = async (req, res) => {
        const cert = await certModel.find();
        if(!cert){
            return res.status(404).json({message: "No Certificates found"});
        }
       res.status(200).json({message: "All Syllabus", Certificates: cert});
}