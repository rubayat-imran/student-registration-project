import StudentsModel from "../model/StudentModel.js";
import mongoose from "mongoose";
const multer = require('multer');
const path = require('path');

// Register student
export const Registration = async (req, res) => {
    try {
        let reqBody = req.body;
        const { email } = reqBody;

        const studentExists = await Student.findOne({ email });
        if (studentExists) return res.status(400).json({ status: "success", message: 'Student already exists' });

        await StudentsModel.create(reqBody)
        return res.json({ status: "success", "Message": "Student registered successfully" })
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
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
            let token = TokenEncode(data['email'], data['_id'])
            return res.json({ status: "success", "Message": "User login successfully", data: { token: token } })
        }
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
    }
}

// Read Profile
export const ProfileRead = async (req, res) => {
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
        let user_id = req.headers['user_id']
        await StudentsModel.updateOne({ "_id": user_id }, reqBody)
        return res.json({ status: "success", "Message": "User Update successfully" })
    }
    catch (e) {
        return res.json({ status: "fail", "Message": e.toString() })
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// File upload API
const uploadFile = (req, res) => {
    res.json({ message: 'File uploaded successfully', file: req.file });
};

// File read API
const readFile = (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`);
    res.sendFile(filePath);
};

// File delete API
const deleteFile = (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: 'File deletion failed' });
        res.json({ message: 'File deleted successfully' });
    });
};

module.exports = { uploadFile, readFile, deleteFile };
