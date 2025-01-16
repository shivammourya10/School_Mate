import express from 'express';
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/RegisterController.js';
import verifyAdmin from '../middleware/verifyAdmin.js'
import {upload} from '../middleware/multerMiddelware.js';
<<<<<<< HEAD
import {certController , updateCertController, getCertificates, deleteCertController} from '../controllers/certController.js';
import {createAlbumController,addImageToAlbumController,getImagesFromAlbumController,deleteImageFromAlbumController, getAllAlbumNamesController} from '../controllers/albumController.js';
import {syllabusController,updateSyllabusController, getSyllabus, deleteSyllabusController} from '../controllers/syllabusController.js'
import {feesController,editFeesController,getFees, deleteFeesController} from "../controllers/feesController.js"
import {getAlbumDetailsController} from "../controllers/albumController.js";
import logoutController from '../controllers/logoutController.js';
=======
import {certController , updateCertController, getCertificates} from '../controllers/certController.js';
import {createAlbumController,addImageToAlbumController,getImagesFromAlbumController,deleteImageFromAlbumController} from '../controllers/albumController.js';
import {syllabusController,updateSyllabusController, getSyllabus} from '../controllers/syllabusController.js'
import {feesController,editFeesController,getFees} from "../controllers/feesController.js"

>>>>>>> ee7d8af06587b8be6856151f3924bace468bec85

const router = express.Router();

// Route for admin login
router.post('/adminLogin', loginController);
router.post('/adminRegister', registerController);
<<<<<<< HEAD
router.post('/certificateUp',verifyAdmin,upload.single('file'),certController);
router.post('/syllabusUp',verifyAdmin,upload.single('file'),syllabusController);
router.post('/feesUp',verifyAdmin,upload.single('file'),feesController);
router.post('/albumnUp',verifyAdmin,createAlbumController);
router.post('/albumnImage/:albumId',verifyAdmin,upload.single('file'),addImageToAlbumController);
router.post('/logout',logoutController);
=======
router.post('/certificateUp',upload.single('file'),certController);
router.post('/syllabusUp',upload.single('file'),syllabusController);
router.post('/feesUp',upload.single('file'),feesController);
router.post('/albumnUp',createAlbumController);
router.post('/albumnImage/:albumId',upload.single('file'),addImageToAlbumController);

>>>>>>> ee7d8af06587b8be6856151f3924bace468bec85


router.put('/feesUp/:feesId',verifyAdmin,upload.single('file'),editFeesController);
router.put('/certificateUp/:certId',verifyAdmin,upload.single('file'),updateCertController);
router.put('/syllabusUp/:syllabusId',verifyAdmin,upload.single('file'),updateSyllabusController);

router.get('/syllabus',getSyllabus);
router.get('/certificates',getCertificates);
router.get('/fees', getFees);
<<<<<<< HEAD
router.get('/albumImages/:albumId',getImagesFromAlbumController); // Corrected 'albumnImages' to 'albumImages'
router.get('/albumNames', getAllAlbumNamesController);

// Add the new route for fetching album details
router.get('/album/:albumId', getAlbumDetailsController);

router.delete('/albumnImages/:albumId/:imageId',verifyAdmin,deleteImageFromAlbumController);
router.delete('/certificateUp/:certId',verifyAdmin, deleteCertController);
router.delete('/syllabus/:syllabusId',verifyAdmin, deleteSyllabusController);
router.delete('/fees/:feesId',verifyAdmin, deleteFeesController);

=======
router.get('/albumnImages/:albumId',getImagesFromAlbumController);

router.delete('/albumnImages/:albumId/:imageId',deleteImageFromAlbumController);
>>>>>>> ee7d8af06587b8be6856151f3924bace468bec85
export default router;