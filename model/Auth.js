const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "cleark"] },
}, { timestamps: true })

module.exports = mongoose.model("auth", authSchema)
