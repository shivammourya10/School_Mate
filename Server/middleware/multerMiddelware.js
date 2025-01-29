import multer from "multer";
import fs from "fs";
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// File filter allows use to filter the files based upon their type
const fileFilterOnlyImage = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject file
    const error = new Error(
      "Unsupported file type. Only jpg, jpeg, png are allowed."
    );
    error.code = "FILE_FILTER_ERROR";
    cb(error, false);
  }
};

const fileFilterImageAndPdf = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  console.log("file found", file);
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject file
    const error = new Error(
      "Unsupported file type. Only jpg, jpeg, png and pdf are allowed."
    );
    error.code = "FILE_FILTER_ERROR";
    cb(error, false);
  }
};

export const handleMulterError = (err, req, res, next) => {
  if (err.code === "FILE_FILTER_ERROR") {
    // Delete the temporary file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete temporary file:", unlinkErr);
        }
      });
    }
    res.status(400).json({ message: err.message });
    req.connection.destroy(); // Terminate the request stream
  } else {
    next(err);
  }
};

// Middleware to process and compress files after upload
export const processFile = async (req, res, next) => {
  if (!req.file) return next();

  const { path: filePath, mimetype, filename } = req.file;
  const outputFolder = "./public/compressed/";
  if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

  try {
    if (mimetype.startsWith("image/")) {
      // Convert to WebP and compress images
      const outputFilename = `${path.parse(filename).name}.webp`;
      const outputPath = path.join(outputFolder, outputFilename);

      await sharp(filePath)
        .resize({ width: 1000 }) // Resize width to max 1000px
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toFile(outputPath);

      // deletes the original file
      fs.unlinkSync(req.file.path);

      // sets the new, converted file's path as the new path 
      req.file.path = outputPath;
      req.file.mimetype = "image/webp";
      console.log("non processed path : ", req.file.path);
      console.log("processed path : ", req.file.processedPath);
    } else if (mimetype === "application/pdf") {
      // Compress PDFs
      const pdfBytes = await fs.promises.readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const compressedPdf = await pdfDoc.save({ useObjectStreams: true });

      const outputFilename = `${path.parse(filename).name}_compressed.pdf`;
      const outputPath = path.join(outputFolder, outputFilename);

      await fs.promises.writeFile(outputPath, compressedPdf);

      req.file.processedPath = outputPath;
      req.file.mimetype = "application/pdf";
    }

    next();
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).json({ message: "Error processing file" });
  }
};

export const uploadOnlyImage = multer({
  storage,
  fileFilter: fileFilterOnlyImage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadImageAndPdf = multer({
  storage,
  fileFilter: fileFilterImageAndPdf,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
