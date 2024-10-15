import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        otp: { type: String, default: 0 },
        status: { type: String, default: 'new' },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Students = mongoose.model("students", studentSchema);

export default Students;