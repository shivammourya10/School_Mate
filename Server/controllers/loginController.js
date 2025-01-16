import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";
import { z } from "zod";

// Define the Zod schema
const isString = z.string();

const loginController = async (req, res) => {
    
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { username, password } = req.body;

        // Validate inputs using Zod
        const isUsernameValid = isString.safeParse(username);
        const isPasswordValid = isString.safeParse(password);

        if (!isUsernameValid.success) {
            return res.status(400).json({
                message: "Invalid username"
            });
        }
        if (!isPasswordValid.success) {
            return res.status(400).json({
                message: "password not found"
            });
        }

        // Check if the user exists
        const user = await AdminModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Send token in cookie (ensure secure for production)
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
            maxAge: 3600000, // 1 hour expiration
        });

        // Respond with success message and token (optional)
        res.status(200).json({ message: "Login successful", token });

        // Redirect to admin homepage
        return res.redirect('/admin-homepage');
    
};

export const verifyAdminToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided." });
        }

        const token = authHeader.split(" ")[1];
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token invalid or expired." });
            }
            // Optionally fetch admin details from DB if needed
            const admin = await AdminModel.findById(decoded.userId);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found." });
            }
            return res.status(200).json({ message: "Token is valid.", admin });
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error verifying token." });
    }
};

export default loginController;