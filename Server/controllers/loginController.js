import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";
import { z } from "zod";

// Define the Zod schema
const isString = z.string();

const loginController = async (req, res) => {
        console.log("Login controller called");
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
            { userId: user._id, username: user.username, isAdmin : true },
            process.env.JWT_SECRET, 
            { expiresIn: "30d" }
        );

        console.log("Login successfull");
        console.log(token);
    // Send token in cookie (ensure secure for production)
    res.cookie("auth_token", token
        , {
        // httpOnly: true,
        // secure: false, // Set to false for local testing
        // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // sameSite: "None", // Suitable for most use cases
        httpOnly: true,         // Recommended for security
        sameSite: 'lax',       // Required for cross-origin cookies
        secure: false, 
        //domain : "localhost",
    }
);

    // Respond with success message and token (optional)
    res.status(200).json({
        message: "Login successful",
        token: `${token}` // Add Bearer prefix for Authorization header
    });
};

export default loginController;