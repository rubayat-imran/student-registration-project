import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

import * as StudentController from "../app/controllers/StudentController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";

// Define the upload directory
const uploadDir = path.join(process.cwd(), 'uploads'); // Get the current working directory

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Use the defined upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    },
});

const upload = multer({ storage });

// Student registration
router.post('/register', StudentController.Registration);

// Student login
router.post('/login', StudentController.Login);

// Student profile read and update
router.get('/profile', AuthMiddleware, StudentController.ProfileDetails);
router.post('/update', AuthMiddleware, StudentController.ProfileUpdate);

// File upload, read, and delete
router.post('/upload', AuthMiddleware, upload.single('file'), StudentController.uploadFile); // Accept any file type
router.get('/readfile/:filename', AuthMiddleware, StudentController.readFile);
router.delete('/deletefile/:filename', AuthMiddleware, StudentController.deleteFile);

export default router;
