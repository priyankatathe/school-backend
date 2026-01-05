const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const validator = require("validator")
const AddForm = require("../model/AddForm")

// ===============================
// ADD ADMISSION
// ===============================
exports.addAdmission = asyncHandler(async (req, res) => {
    try {
        const {
            studentName,
            standard,
            age,
            parentPhone,
            parentEmail,
            address
        } = req.body

        // Empty validation
        const { isError, error } = checkEmpty({
            studentName,
            standard,
            age,
            parentPhone,
            parentEmail,
            address
        })

        if (isError) {
            return res.status(400).json({
                message: "All fields are required",
                error
            })
        }

        // Email validation
        if (!validator.isEmail(parentEmail)) {
            return res.status(400).json({
                message: "Invalid email address"
            })
        }

        const result = await AddForm.create({
            studentName,
            standard,
            age,
            parentPhone,
            parentEmail,
            address
        })

        res.status(201).json({
            message: "Admission form submitted successfully",
            result
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})


// GET ALL ADMISSIONS (Admin)
exports.getAdmissions = asyncHandler(async (req, res) => {
    try {
        const result = await AddForm.find().sort({ createdAt: -1 })

        res.json({
            message: "Admission fetch success",
            result
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


// ===============================
// UPDATE ADMISSION STATUS
// ===============================
exports.updateAdmissionStatus = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            })
        }

        const admission = await AddForm.findById(id)

        if (!admission) {
            return res.status(404).json({
                message: "Admission not found"
            })
        }

        admission.status = status
        await admission.save()

        res.json({
            message: "Admission status updated successfully",
            result: admission
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Update failed",
            error: error.message
        })
    }
})
