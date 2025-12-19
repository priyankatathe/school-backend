const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    image: { type: [String], required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "reject"], default: "pending" },
    // adminId: { type: mongoose.Types.ObjectId, ref: "auth" },
    // role: { type: String, enum: ["admin"] },
}, { timestamps: true })

module.exports = mongoose.model("student", studentSchema)
