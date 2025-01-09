import albumModel from "../models/albumModel.js";
import childrenModel from "../models/childrenModel.js";
import zod from "zod";
import { uploadOnCloudinary } from "../utils/imgeUploader.js";

const isString = zod.string();

export const createAlbumController = async (req, res) => {
    const { name, description } = req.body;

    const isName = isString.safeParse(name);
    const isDescription = isString.safeParse(description);
    if (!isName.success || !isDescription.success) {
        return res.status(400).json({
            message: "Invalid name or description"
        });
    }

    const album = await albumModel.create({ name, description });

    res.status(201).json({ message: "Album created successfully", album });
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

        album.image.push(image._id);
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
        const album = await albumModel.findById(albumId).populate('image');
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.status(200).json({ message: "Images retrieved successfully", images: album.image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
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
        const imageIndex = album.image.indexOf(imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Image not found in album" });
        }

        album.image.splice(imageIndex, 1);
        await album.save();

        await childrenModel.findByIdAndDelete(imageId);

        res.status(200).json({ message: "Image deleted successfully from album" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};