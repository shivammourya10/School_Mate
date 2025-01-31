import AdminModel from "../models/AdminModel.js";
import ResetCodeModel from "../models/ResetCodeModel.js";
import { sendEmail } from "../utils/sendMail.js";
import crypto from "crypto"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const generateCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "User email not provided" });
  }

  try {

    const userDetails = await AdminModel.findOne({ username: email })

    if (!userDetails) {
      return res.status(400).json({ message: "There is no account associated with that email, kindly enter correct email" });
    }


    const resetCodeRequest = await ResetCodeModel.findOne({ userId: userDetails._id });

    if (resetCodeRequest) {
      const epochTime = Math.floor(new Date(resetCodeRequest.resetCodeExpiry).getTime());
      console.log("epoch time : ", epochTime);
      const timeRemaining = (epochTime - Date.now() + (5 * 60 * 1000)) / 1000;
      console.log("time remaining : ", timeRemaining)

      if (timeRemaining > 0) {
        const error = new Error(`Please wait ${Math.ceil(timeRemaining / 60)} minutes before requesting another reset code.`);
        error.code = "OTP_EXISTS";
        throw error;
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const newResetCodeDetails = await ResetCodeModel.create({
      userId: userDetails._id,
      resetCode: otp,
      resetCodeExpiry: new Date(Date.now()) // Set the resetCodeExpiry as currentTime 
    })

    if (!newResetCodeDetails) {
      return res.status(500).json({ message: "Something went wrong while creating the reset request" });
    }

    const response = await sendEmail(email, "Reset Your Password", `You're recovery code is : ${otp}`);

    if (!response) {
      throw new Error("Error in sending mail");
    }

    res.status(200).json({ message: "Password reset email sent!", userId: userDetails._id });
  } catch (error) {
    console.log(error);
    if (error.code === "OTP_EXISTS") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
}

export const verifyCode = async (req, res) => {
  const { otp, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const adminDetails = await AdminModel.findById(userId);


    if (!adminDetails) {
      return res.status(404).json({ message: "No user with that userid found" });
    }


    const resetRequestDetails = await ResetCodeModel.findOne({ userId: userId })


    // if (resetRequestDetails.length === 0) {
    if (!resetRequestDetails) {
      return res.status(404).json({ message: "OTP expired" });
    }

    if (!resetRequestDetails.resetCode === otp) {
      return res.status(400).json({ message: "OTP is incorrect" });
    }

    const resetJWT = jwt.sign({ userId: userId, purpose: "password_reset" }, process.env.RESET_SECRET, { expiresIn: "5m" })

    res.status(200).json({ message: "OTP is verified", resetJWT });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong while verifying OTP, please try again", error: e.message });
  }
}

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const { resetJWT } = req.params;

  if (!newPassword) {
    return res.status(400).json({ message: "New password wasn't given" });
  }


  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decoded = jwt.verify(resetJWT, process.env.RESET_SECRET);

    const resetRequest = await ResetCodeModel.findOne({ userId: decoded.userId });

    if (!resetRequest) {
      console.log("No otps for you");
      const error = new Error("Generate a new OTP to reset password")
      error.name = "NoGeneratedOTP"
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AdminModel.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

    await ResetCodeModel.deleteOne({ userId: decoded.userId });

    await session.commitTransaction()

    session.endSession();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    if (e.name === "TokenExpiredError") {
      console.log("Token has expired");
      res.status(404).json({ message: "Session has expired, please try again" })
    } else if (e.name === "JsonWebTokenError") {
      console.log("Invalid token");
      res.status(400).json({ message: "Invalid token" })
    } else if (e.name === "NoGeneratedOTP") {
      console.log("Not generate otps");
      res.status(400).json({ message: "Session expired, please restart" })
    }
    else {
      console.log("Something went wrong:", e);
      res.status(500).json({ message: "Something went wrong", error: e })
    }
  }
}

export const verifyResetJWT = async (req, res) => {
  const { resetJWT } = req.params;

  try {
    console.log("reset jwt : ", resetJWT);
    const decoded = jwt.verify(resetJWT, process.env.RESET_SECRET);
    console.log("decoded : ", decoded);
    if (!decoded) {
      return res.status(400).json({ message: "Token not found" })
    }

    const resetRequest = await ResetCodeModel.findOne({ userId: decoded.userId });

    console.log(resetRequest);

    if (!resetRequest) {
      return res.status(400).json({ message: "Token expired" });
    }
    return res.status(200).json({ message: "Token is valid and not expired" })
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}

