import StudentsModel from "../model/StudentModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";
import path from 'path';
import fs from 'fs';

// Register student
export const Registration = async (req, res) => {
    try {
        let reqBody = req.body;
        const { email } = reqBody;

        // Check for existing student
        const studentExists = await StudentsModel.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ status: "fail", message: 'Student already exists' });
        }

        // Create new student
        await StudentsModel.create(reqBody);
        return res.json({ status: "success", message: "Student registered successfully" });
    } catch (e) {
        return res.status(500).json({ status: "fail", message: e.toString() });
    }
};

// Student Login
export const Login = async (req, res) => {
    try {
        const reqBody = req.body;
        const user = await StudentsModel.findOne(reqBody);

        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }

        // Generate JWT token
        const token = TokenEncode(user.email, user._id);

        // Set cookie options
        const options = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };

        // Set cookie
        res.cookie("Token", token, options);
        return res.json({ status: "success", message: "User login successfully", data: { token } });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message });
    }
};

// Read Profile
export const ProfileDetails = async (req, res) => {
    try {
        const userId = req.headers['user_id'];
        const user = await StudentsModel.findById(userId); // Use findById for better clarity

        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }

        return res.json({ status: "success", message: "User profile retrieved successfully", data: user });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message });
    }
};


// Profile Update
export const ProfileUpdate = async (req, res) => {
    try {
        const userId = req.headers['user_id'];
        const reqBody = req.body;

        const result = await StudentsModel.updateOne({ _id: userId }, reqBody);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ status: "fail", message: "User not found or no changes made" });
        }

        return res.json({ status: "success", message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: "fail", message: error.message });
    }
};

// File Upload API
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "fail", message: "No file uploaded" });
    }

    return res.json({ status: "success", message: 'File uploaded successfully', file: req.file });
};


// File Read
export const readFile = (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File not found or error sending file:", err);
            return res.status(404).json({ status: "fail", message: "File not found" });
        }
    });
};


// File Delete API
export const deleteFile = (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("File deletion failed:", err);
            return res.status(500).json({ status: "fail", message: 'File deletion failed' });
        }
        return res.json({ status: "success", message: 'File deleted successfully' });
    });
};
