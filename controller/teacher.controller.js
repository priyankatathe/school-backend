const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const { upload, uploadImage } = require("../utils/upload")
const { checkEmpty } = require("../utils/checkEmpty")
const cloudinary = require("../utils/cloudinary.config")
const Teacher = require("../model/Teacher")

exports.getTeacher = asyncHandler(async (req, res) => {
    try {
        const result = await Teacher.find()

        res.json({ message: "Teacher Fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})


exports.addTeacher = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image", error: err })
        }

        const { name, sub, expriance } = req.body

        // Validation
        const { isError, error } = checkEmpty({ name, sub, expriance })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let TeacherImg = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    TeacherImg.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }

            const result = await Teacher.create({
                name,
                sub,
                expriance,
                image: TeacherImg,
                adminId: req.user?._id,
                role: "teacher"
            })

            res.json({ message: "Teacher Added Successfully", result })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong", error })
        }
    })
})



exports.updateTeacher = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image Upload Failed", error: err });
        }

        const { id } = req.params;
        const { name, sub, expriance } = req.body;

        const { isError, error } = checkEmpty({ name, sub, expriance });
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let photo = null;
            if (req.file) {
                const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                photo = secure_url;
            }

            const updateData = { name, sub, expriance };
            if (photo) updateData.image = photo;

            const result = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
            res.json({ message: "Teacher Updated Successfully", result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Update Failed", error });
        }
    });
});







exports.deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const staff = await Teacher.findById(id)

        if (!staff) {
            return res.status(404).json({ message: "staff not found" })
        }



        await Teacher.findByIdAndDelete(id)

        res.status(200).json({ message: "staff deleted successfully" })
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete staff", error })
    }
})


