const asyncHandler = require("express-async-handler")
const { upload, uploadImage } = require("../utils/upload")
const cloudinary = require("../utils/cloudinary.config")
const Gallery = require("../model/Gallery")


exports.getGallery = asyncHandler(async (req, res) => {
    try {
        const result = await Gallery.find()

        res.json({ message: "Gallery Fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})

exports.addGallery = asyncHandler(async (req, res) => {
    uploadImage(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Unable To Upload Image", error: err })
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

            const result = await Gallery.create({
                image: imageUrl,
                adminId: req.user
            })

            res.json({ message: "gallery Added Successfully", result })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong", error })
        }
    })
})


exports.updateGallery = asyncHandler(async (req, res) => {

    //     if (err) {
    //         return res.status(400).json({ message: "Image Upload Failed", error: err })
    //     }

    //     // const { id } = req.params
    //     // const { name, head, desc, category } = req.body
    //     // console.log(req.file, "req.file")
    //     // Validation 
    //     // const { isError, error } = checkEmpty({ name, head, desc, category })
    //     // if (isError) {
    //     //     return res.status(400).json({ message: "All Fields Required", error })
    //     // }
    //     try {
    //         let GallerytImg = []

    //         if (req.files && req.files.image && Array.isArray(req.files.image)) {
    //             for (const item of req.files.image) {
    //                 const { secure_url } = await cloudinary.uploader.upload(item.path);
    //                 GallerytImg.push(secure_url);
    //             }
    //         } else {
    //             return res.status(400).json({ message: "At least one image is required" });
    //         }

    //         await Gallery.findByIdAndUpdate(id, { name, head, desc, category, image: GallerytImg })
    //         res.json({ message: "Gallery Updated Successfully" })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ message: "Update Failed", error })
    //     }
    // })
    //
    uploadImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image Upload Failed", error: err })
        }
        const { id } = req.params

        try {
            let GallerytImg = []

            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (const item of req.files.image) {
                    const { secure_url } = await cloudinary.uploader.upload(item.path);
                    GallerytImg.push(secure_url);
                }
            } else {
                return res.status(400).json({ message: "At least one image is required" });
            }

            const result = await Gallery.findByIdAndUpdate(id, { image: GallerytImg })
            res.json({ message: "galllery Updated Successfully", result })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Update Failed", error })
        }
    })
})

exports.deleteGallery = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const galleryy = await Gallery.findById(id)

        if (!galleryy) {
            return res.status(404).json({ message: "Gallery not found" });
        }

        await Gallery.findByIdAndDelete(id);

        res.status(200).json({ message: "Gallery deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Failed to delete Gallery", error });
    }
})




