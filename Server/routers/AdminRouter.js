import express from 'express';
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/RegisterController.js';
import verifyAdmin from '../middleware/verifyAdmin.js'
import {upload} from '../middleware/multerMiddelware.js';
import {certController , updateCertController, getCertificates, deleteCertController} from '../controllers/certController.js';
import {createAlbumController,addImageToAlbumController,getImagesFromAlbumController,deleteImageFromAlbumController, getAllAlbumNamesController} from '../controllers/albumController.js';
import {syllabusController,updateSyllabusController, getSyllabus, deleteSyllabusController} from '../controllers/syllabusController.js'
import {feesController,editFeesController,getFees, deleteFeesController} from "../controllers/feesController.js"


const router = express.Router();

// Route for admin login
router.post('/adminLogin', loginController);
router.post('/adminRegister', registerController);
router.post('/certificateUp',upload.single('file'),certController);
router.post('/syllabusUp',upload.single('file'),syllabusController);
router.post('/feesUp',upload.single('file'),feesController);
router.post('/albumnUp',createAlbumController);
router.post('/albumnImage/:albumId',upload.single('file'),addImageToAlbumController);


router.put('/feesUp/:feesId',upload.single('file'),editFeesController);
router.put('/certificateUp/:certId',upload.single('file'),updateCertController);
router.put('/syllabusUp/:syllabusId',upload.single('file'),updateSyllabusController);

router.get('/syllabus',getSyllabus);
router.get('/certificates',getCertificates);
router.get('/fees', getFees);
router.get('/albumnImages/:albumId',getImagesFromAlbumController);
router.get('/albumNames', getAllAlbumNamesController);

router.delete('/albumnImages/:albumId/:imageId',deleteImageFromAlbumController);
router.delete('/certificateUp/:certId', deleteCertController);
router.delete('/syllabus/:syllabusId', deleteSyllabusController);
router.delete('/fees/:feesId', deleteFeesController);

export default router;