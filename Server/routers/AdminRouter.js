import express from "express";
import loginController from "../controllers/loginController.js";
import registerController from "../controllers/RegisterController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
  uploadOnlyImage,
  uploadImageAndPdf,
  handleMulterError,
  processFile,
} from "../middleware/multerMiddelware.js";
import {
  certController,
  updateCertController,
  getCertificates,
  deleteCertController,
} from "../controllers/certController.js";
import {
  createAlbumController,
  addImageToAlbumController,
  getImagesFromAlbumController,
  deleteImageFromAlbumController,
  getAllAlbumNamesController,
  getAlbumsByYearController,
  getAlbumYearsController,
  deleteAlbumById,
} from "../controllers/albumController.js";
import {
  syllabusController,
  updateSyllabusController,
  getSyllabus,
  deleteSyllabusController,
} from "../controllers/syllabusController.js";
import {
  feesController,
  editFeesController,
  getFees,
  deleteFeesController,
} from "../controllers/feesController.js";
import { getAlbumDetailsController } from "../controllers/albumController.js";
import logoutController from "../controllers/logoutController.js";
import { generateCode, updatePassword, verifyCode, verifyResetJWT } from "../controllers/generateCodeController.js";

const router = express.Router();

router.post("/generateCode", generateCode);
router.post("/verifyCode", verifyCode);
router.post("/verify/:resetJWT", verifyResetJWT);

// Route for admin login
router.post("/adminLogin", loginController);
router.post("/adminRegister", registerController);
router.post(
  "/certificateUp",
  verifyAdmin,
  uploadOnlyImage.single("file"),
  handleMulterError,
  processFile,
  certController
);
router.post(
  "/syllabusUp",
  verifyAdmin,
  uploadImageAndPdf.single("file"),
  handleMulterError,
  processFile,
  syllabusController
);
router.post(
  "/feesUp",
  verifyAdmin,
  uploadImageAndPdf.single("file"),
  handleMulterError,
  processFile,
  feesController
);
router.post("/albumUp", verifyAdmin, createAlbumController);
router.post(
  "/albumImage/:albumId",
  verifyAdmin,
  uploadOnlyImage.single("file"),
  handleMulterError,
  processFile,
  addImageToAlbumController
);
router.post("/adminLogout", verifyAdmin, logoutController);

router.put("/admin-password/:resetJWT", updatePassword);

router.put(
  "/feesUp/:feesId",
  verifyAdmin,
  uploadImageAndPdf.single("file"),
  handleMulterError,
  processFile,
  editFeesController
);
router.put(
  "/certificateUp/:certId",
  verifyAdmin,
  uploadOnlyImage.single("file"),
  handleMulterError,
  processFile,
  processFile,
  updateCertController
);
router.put(
  "/syllabusUp/:syllabusId",
  verifyAdmin,
  uploadImageAndPdf.single("file"),
  handleMulterError,
  processFile,
  updateSyllabusController
);

router.get("/syllabus", getSyllabus);
router.get("/certificates", getCertificates);
router.get("/fees", getFees);
router.get("/albumImages/:albumId", getImagesFromAlbumController); // Corrected 'albumnImages' to 'albumImages'
router.get("/albumNames", getAllAlbumNamesController);

// Add the new route for fetching album details
// router.get("/album/:albumId", getAlbumDetailsController);

router.get("/albumYears", getAlbumYearsController);
router.get("/albumsByYear/:year", getAlbumsByYearController);

router.delete("/album/:albumId/:imageId", deleteImageFromAlbumController);
router.delete("/album/:albumId", deleteAlbumById)
router.delete("/certificateUp/:certId", verifyAdmin, deleteCertController);
router.delete("/syllabus/:syllabusId", verifyAdmin, deleteSyllabusController);
router.delete("/fees/:feesId", verifyAdmin, deleteFeesController);

router.get("/verifyUser", verifyAdmin, (_, res) => {
  res.status(200).json({ message: "You're verified" });
})

export default router;
