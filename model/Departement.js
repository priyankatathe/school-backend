const mongoose = require("mongoose")

const departementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: [String], required: true },
    // code: { type: String, required: true },
    head: { type: String, required: true },
    desc: { type: String, required: true },
    adminId: { type: mongoose.Types.ObjectId, ref: "auth" },
    category: { type: String, enum: ["hocky", "cricket", "handball", "bascketbal", "classical", "western", "ncc", "clasess"] },
}, { timestamps: true })

module.exports = mongoose.model("departement", departementSchema)
