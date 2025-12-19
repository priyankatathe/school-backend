const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const { upload, uploadImage } = require("../utils/upload")
const { checkEmpty } = require("../utils/checkEmpty")
const cloudinary = require("../utils/cloudinary.config")
const Function = require("../model/Function")

exports.getFunction = asyncHandler(async (req, res) => {
    try {
        const result = await Function.find()

        res.json({ message: "Function Fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})


exports.addFunction = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image", error: err })
        }
        const { name, desc } = req.body

        // Validation
        const { isError, error } = checkEmpty({ name, desc })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error });
        }

        try {
            let FunctionImg = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    FunctionImg.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }


            const result = await Function.create({
                name,
                desc,
                image: FunctionImg,
                adminId: req.user
            })
            res.json({ message: "Function Added Successfully", result })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong", error })
        }
    })
})


exports.updateFunction = asyncHandler(async (req, res) => {

    //     if (err) {
    //         return res.status(400).json({ message: "Image Upload Failed", error: err })
    //     }

    //     const { id } = req.params
    //     const { name, desc } = req.body

    //     // Validation 
    //     const { isError, error } = checkEmpty({ name, desc })
    //     if (isError) {
    //         return res.status(400).json({ message: "All Fields Required", error })
    //     }
    //     try {
    //         let imgFunction = []

    //         if (req.files && req.files.image && Array.isArray(req.files.image)) {
    //             for (const item of req.files.image) {
    //                 const { secure_url } = await cloudinary.uploader.upload(item.path);
    //                 imgFunction.push(secure_url)
    //             }
    //         } else {
    //             return res.status(400).json({ message: "At least one image is required" });
    //         }
    //         console.log(req.file, "req.file")


    //         const result = await Function.findByIdAndUpdate(id, { name, desc, image: imgFunction })
    //         res.json({ message: "Function Updated Successfully", result })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ message: "Update Failed", error })
    //     }
    // })

    // // 

    uploadImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image Upload Failed", error: err })
        }

        const { id } = req.params
        const { name, desc } = req.body
        console.log(req.file, "req.file")
        // Validation 
        const { isError, error } = checkEmpty({ name, desc })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        try {
            let imgFunction = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    imgFunction.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }

            const result = await Function.findByIdAndUpdate(id, { name, desc, image: imgFunction })
            res.json({ message: "function Updated Successfully", result })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Update Failed", error })
        }
    })
})




exports.deleteFunction = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const func = await Function.findById(id)

        if (!func) {
            return res.status(404).json({ message: "Function not found" });
        }

        await Function.findByIdAndDelete(id);

        res.status(200).json({ message: "Function deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete function", error });
    }
})


