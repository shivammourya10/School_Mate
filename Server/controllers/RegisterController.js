import AdminModel from "../models/AdminModel.js";
import zod from "zod";
import bcrypt from "bcrypt";

const isString = zod.string();

const registerController = async (req, res) => {
  const { username, password } = req.body;

  // Validate username and password using zod
  const isUsername = isString.safeParse(username);
  const isPassword = isString.safeParse(password);

  if (!isUsername.success) {
    return res.status(400).json({
      message: "Invalid username"
    });
  }
  if (!isPassword.success) {
    return res.status(400).json({
      message: "Invalid password"
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    return res.status(500).json({
      message: "Error in hashing password"
    });
  }

  // Create a new admin instance with the hashed password
  const admin = new AdminModel({
    username: username,
    password: hashedPassword // Save hashed password, not plain password
  });

  try {
    // Save the admin to the database
    const savedAdmin = await admin.save();
    res.status(201).json({
      message: "Admin registered successfully",
      admin: savedAdmin // Optionally, return the saved admin data (excluding sensitive info)
    });
  } catch (error) {
    console.error("Error saving admin:", error);
    res.status(500).json({
      message: "Error in saving admin"
    });
  }
};

export default registerController;
