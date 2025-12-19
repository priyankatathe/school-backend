const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const { upload, uploadImage } = require("../utils/upload")
const { checkEmpty } = require("../utils/checkEmpty")
const cloudinary = require("../utils/cloudinary.config")
const Student = require("../model/Student")

exports.getStudent = asyncHandler(async (req, res) => {
    try {
        const result = await Student.find()

        res.json({ message: "Student Fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})


exports.addStudent = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image", error: err })
        }
        const { firstname, lastname, gender, dob, email, phone, address, city, state, pincode, status } = req.body

        // Validation
        const { isError, error } = checkEmpty({ firstname, lastname, gender, dob, email, phone, address, city, state, pincode, status })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let StudentImg = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    StudentImg.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }


            const result = await Student.create({
                firstname,
                lastname,
                // image,
                gender,
                dob,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                status,
                image: StudentImg,
                adminId: req.user
            })
            res.json({ message: "Student Added Successfully", result })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong", error })
        }
    })
})
exports.updateStudent = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image Upload Failed", error: err });
        }

        const { id } = req.params;
        const { firstname, lastname, gender, dob, email, phone, address, city, state, pincode, status } = req.body;

        // Validation 
        const { isError, error } = checkEmpty({ firstname, lastname, gender, dob, email, phone, address, city, state, pincode, status });
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let imgStudent = undefined;

            // Only update image if a new file is uploaded
            if (req.file) {
                const { secure_url } = await cloudinary.uploader.upload(req.file.path);
                imgStudent = secure_url;
            }

            // Prepare update object
            const updateData = { firstname, lastname, gender, dob, email, phone, address, city, state, pincode, status };
            if (imgStudent) {
                updateData.image = imgStudent;
            }

            const result = await Student.findByIdAndUpdate(id, updateData, { new: true });

            res.json({ message: "Student Updated Successfully", result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Update Failed", error });
        }
    });
});


exports.deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const stud = await Student.findById(id)

        if (!stud) {
            return res.status(404).json({ message: "student not found" })
        }

        await Student.findByIdAndDelete(id);

        res.status(200).json({ message: "student deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete student", error })
    }
})


