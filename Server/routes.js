
import express from "express";
import { loginController, verifyAdminToken } from "./controllers/loginController.js"; 

const router = express.Router();

// POST route for admin login
router.post("/api/adminLogin", loginController);

// GET route to verify token
router.get("/api/adminLogin", verifyAdminToken);

export default router;