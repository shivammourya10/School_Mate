import childModel from "../models/childrenModel.js";
import {uploadOnCloudinary} from "../utils/imgeUploader.js";

const childController = async (req, res) => {
    
    const file = req.file;
    console.log(file);

    const uploadedFile = await uploadOnCloudinary(req.file.path);
        if (!uploadedFile){
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }
    const child = await childModel.create({
        image: uploadedFile.secure_url,
    });

    res.status(201).json({ message: "Certificate created successfully", child });
}

export default childController;