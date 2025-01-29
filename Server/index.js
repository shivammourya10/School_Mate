import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminLoginRouter from "./routers/AdminRouter.js";
import cookieParser from "cookie-parser";
import errorHandlingMiddleware from "./middleware/centralErrorHandlingMiddleware.js";

dotenv.config();

const app = express();
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // Frontend URL 1
  "http://localhost:5174", // Frontend URL 2
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());

app.use("/api", adminLoginRouter);

// Central error handling middleware
app.use(errorHandlingMiddleware);

// MongoDB Connection
const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1);
    });
};
dbConnect();

// Start the Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
