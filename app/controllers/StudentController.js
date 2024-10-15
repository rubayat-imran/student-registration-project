import StudentsModel from "../model/StudentModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";
import path from 'path';
import fs from 'fs';

// Register student
export const Registration = async (req, res) => {
    try {
        let reqBody = req.body;
        const { email } = reqBody;

        const studentExists = await StudentsModel.findOne({ email });
        if (studentExists) return res.status(400).json({ status: "fail", message: 'Student already exists' });

        await StudentsModel.create(reqBody);
        return res.json({ status: "success", message: "Student registered successfully" });
    } catch (e) {
        return res.status(500).json({ status: "fail", message: e.toString() });
    }
};

// Student Login
export const Login = async (req, res) => {
    try {
        let reqBody = req.body;
        let data = await StudentsModel.findOne(reqBody)

        if (data == null) {
            return res.json({ status: "fail", "Message": "User not found" })
        }
        else {
            // Login Success
            let token = TokenEncode(data['email'], data['_id']);
            return res.json({ status: "success", "Message": "User login successfully", data: { token: token } })
        }
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
    }
}

// Read Profile
export const ProfileDetails = async (req, res) => {
    try {
        let user_id = req.headers['user_id']
        let data = await StudentsModel.findOne({ "_id": user_id })
        return res.json({ status: "success", message: "User profile successfully", data: data })
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
    }
}

// Profile update
export const ProfileUpdate = async (req, res) => {
    try {
        let reqBody = req.body;
        let user_id = req.headers['user_id'];
        await StudentsModel.updateOne({ "_id": user_id }, reqBody)
        return res.json({ status: "success", "Message": "User Update successfully" })
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
    }
}


// File upload API
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "fail", message: "No file uploaded" });
    }
    return res.json({ status: "success", message: 'File uploaded successfully', file: req.file });
};

// File read API
export const readFile = (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename); // Use process.cwd() for correct directory

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File not found or error sending file:", err);
            return res.status(404).json({ status: "fail", message: "File not found" });
        }
    });
};

// File delete API
export const deleteFile = (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: 'File deletion failed' });
        res.json({ message: 'File deleted successfully' });
    });
};