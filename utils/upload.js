const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({        //diskStorage imbild fuction  
    filename: (req, file, cb) => {   // date.now second cout krt
        const fn = Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})
exports.upload = multer({ storage }).single("photo")
exports.uploadImage = multer({ storage }).fields([
    { name: "image", maxCount: 5 },
])