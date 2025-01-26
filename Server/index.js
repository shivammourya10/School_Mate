import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import adminLoginRouter from './routers/AdminRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies)
}));
app.use(express.json()); 
app.use('/api', adminLoginRouter); 

// MongoDB Connection
const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err.message);
            process.exit(1); 
        });
};
dbConnect();

// Start the Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
