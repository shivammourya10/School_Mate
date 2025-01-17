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
        secure: false, // Set to false for local testing
        maxAge: 3600000,
        sameSite: "Lax", // Suitable for most use cases
    });

    // Respond with success message and token (optional)
    res.status(200).json({
        message: "Login successful",
        token: `Bearer ${token}` // Add Bearer prefix for Authorization header
    });
};

export default loginController;