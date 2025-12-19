const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: [String], required: true },
    sub: { type: String, required: true },
    expriance: { type: String, required: true },
    adminId: { type: mongoose.Types.ObjectId, ref: "auth" },
    role: { type: String, enum: ["teacher", "staff"] },
}, { timestamps: true })

module.exports = mongoose.model("teacher", teacherSchema)


