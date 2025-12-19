const mongoose = require("mongoose")

const gallerySchema = new mongoose.Schema({
    // name: { type: String, required: true },
    image: { type: [String], required: true },
    // desc: { type: String, required: true },
    adminId: { type: mongoose.Types.ObjectId, ref: "auth" },
    // cata: { type: String, enum: ["admin"] },
}, { timestamps: true })

module.exports = mongoose.model("gallery", gallerySchema)
