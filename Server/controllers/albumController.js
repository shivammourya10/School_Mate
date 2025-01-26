import albumModel from "../models/albumModel.js";
import childrenModel from "../models/childrenModel.js";
import zod from "zod";
import { uploadOnCloudinary } from "../utils/imgeUploader.js";

const isString = zod.string();

export const createAlbumController = async (req, res) => {
    try {
        const { name, description, year } = req.body;

        const isName = isString.safeParse(name);
        const isDescription = isString.safeParse(description);
        const isYear = isString.safeParse(year);

        if (!isName.success || !isDescription.success || !isYear.success) {
            return res.status(400).json({
                message: "Invalid name, description, or year"
            });
        }

        const album = await albumModel.create({ 
            name, 
            description,
            year 
        });

        res.status(201).json({ 
            message: "Album created successfully", 
            album 
        });
    } catch (error) {
        console.error('Album creation error:', error);
        res.status(500).json({ 
            message: "Failed to create album",
            error: error.message 
        });
    }
};

export const addImageToAlbumController = async (req, res) => {
    const { albumId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const album = await albumModel.findById(albumId);
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        const uploadedFile = await uploadOnCloudinary(file.path);
        if (!uploadedFile) {
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }

        const image = await childrenModel.create({
            image: uploadedFile.secure_url
        });


        album.images.push(image._id); // Changed 'image' to 'images'

        await album.save();

        res.status(201).json({ message: "Image added to album successfully", album });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getImagesFromAlbumController = async (req, res) => {
    const { albumId } = req.params;

    try {
        const album = await albumModel.findById(albumId)
            .populate({
                path: 'images',
                model: 'Children', // Make sure this matches your model name exactly
                select: 'image'
            });

        if (!album) {
            return res.status(404).json({ 
                message: "Album not found" 
            });
        }

        // Send consistent response structure
        res.status(200).json({ 
            message: "Images retrieved successfully", 
            name: album.name,
            description: album.description,
            year: album.year,
            images: album.images.map(img => ({
                _id: img._id,
                image: img.image
            }))
        });
    } catch (error) {
        console.error('Error fetching album images:', error);
        res.status(500).json({ 
            message: "Error fetching album images",
            error: error.message 
        });
    }
};

export const deleteImageFromAlbumController = async (req, res) => {
    const { albumId, imageId } = req.params;

    try {
        const album = await albumModel.findById(albumId);
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        console.log(imageId)
        const imageIndex = album.images.indexOf(imageId); // Changed 'image' to 'images'
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in album" });
        }

        album.images.splice(imageIndex, 1); // Changed 'image' to 'images'
        await album.save();

        await childrenModel.findByIdAndDelete(imageId);

        res.status(200).json({ message: "Image deleted successfully from album" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllAlbumNamesController = async (req, res) => {
    try {
        const albums = await albumModel.find({}, 'name');
        res.status(200).json({ message: "Albums retrieved successfully", albums });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAlbumDetailsController = async (req, res) => {
    const { albumId } = req.params;

    try {
        const album = await albumModel.findById(albumId).populate('images'); // Ensured 'images' is used
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.status(200).json({ message: "Album details retrieved successfully", album });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAlbumYearsController = async (req, res) => {
    try {
        const years = await albumModel.distinct('year');
        res.status(200).json({ 
            message: "Years retrieved successfully", 
            years 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAlbumsByYearController = async (req, res) => {
    const { year } = req.params;
    try {
        const albums = await albumModel.find({ year }, 'name');
        res.status(200).json({ 
            message: "Albums retrieved successfully", 
            albums 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

