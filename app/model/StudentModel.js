import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: { type: String, default: 'new' },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Students = mongoose.model("Student", studentSchema);

export default Students;