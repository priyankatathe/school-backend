const mongoose = require("mongoose")

const admissionSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        standard: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 2,
            max: 20
        },

        parentPhone: {
            type: String,
            required: true,
            match: [/^[6-9]\d{9}$/, "Invalid phone number"]
        },

        parentEmail: {
            type: String,
            required: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"]
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Admission", admissionSchema)
