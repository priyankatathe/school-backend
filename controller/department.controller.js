const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const { upload, uploadImage } = require("../utils/upload")
const Departement = require("../model/Departement")
const { checkEmpty } = require("../utils/checkEmpty")
const cloudinary = require("../utils/cloudinary.config")


exports.getDepartment = asyncHandler(async (req, res) => {
    try {
        const result = await Departement.find()

        res.json({ message: "Department Fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})

exports.addDepartment = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image", error: err })
        }

        const { name, head, desc, category } = req.body

        // Validation
        const { isError, error } = checkEmpty({ name, head, desc, category })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let imageUrl = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    imageUrl.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }

            const result = await Departement.create({
                name,
                head,
                desc,
                category,
                image: imageUrl,
                adminId: req.user
            })

            res.json({ message: "Department Added Successfully", result })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong", error })
        }
    })
})


exports.updateDepartment = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image Upload Failed", error: err })
        }

        const { id } = req.params
        const { name, head, desc, category } = req.body
        console.log(req.file, "req.file")
        // Validation 
        const { isError, error } = checkEmpty({ name, head, desc, category })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        try {
            let DepartmentImg = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    DepartmentImg.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }

            const result = await Departement.findByIdAndUpdate(id, { name, head, desc, category, image: DepartmentImg })
            res.json({ message: "Department Updated Successfully", result })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Update Failed", error })
        }
    })
})



exports.deleteDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const department = await Departement.findById(id)

        if (!department) {
            return res.status(404).json({ message: "Department not found" })
        }



        await Departement.findByIdAndDelete(id)

        res.status(200).json({ message: "Department deleted successfully" })
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete department", error })
    }
})



// all fetch

exports.findSport = asyncHandler(async (req, res) => {
    try {
        const result = await Departement.find()

        const sportsData = {
            hocky: result.filter(item => item.category === "hocky"),
            cricket: result.filter(item => item.category === "cricket"),
            handball: result.filter(item => item.category === "handball"),
            basketball: result.filter(item => item.category === "bascketbal"),
            classical: result.filter(item => item.category === "classical"),
            western: result.filter(item => item.category === "western"),
            ncc: result.filter(item => item.category === "ncc"),
            clasess: result.filter(item => item.category === "clasess"),
        };

        res.json({ message: "Sport fetch Success", data: sportsData })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})

// music
exports.findMusic = asyncHandler(async (req, res) => {
    try {
        const result = await Departement.find({ adminId: req.user })


        const sportsData = {
            hocky: result.filter(item => item.category === "hocky"),
            cricket: result.filter(item => item.category === "cricket"),
            handball: result.filter(item => item.category === "handball"),
            basketball: result.filter(item => item.category === "bascketbal") // spelling fix
        };

        res.json({ message: "Professionals fetch Success", data: sportsData })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})


// ncc
exports.findNcc = asyncHandler(async (req, res) => {
    try {
        const result = await Departement.find({ adminId: req.user })


        const sportsData = {
            hocky: result.filter(item => item.category === "hocky"),
            cricket: result.filter(item => item.category === "cricket"),
            handball: result.filter(item => item.category === "handball"),
            basketball: result.filter(item => item.category === "bascketbal") // spelling fix
        };

        res.json({ message: "Professionals fetch Success", data: sportsData })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})



