const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const galleryController = require("./../controller/gallery.controller");

router
    .post("/gallery-add", adminProtected, galleryController.addGallery)
    .put("/gallery-update/:id", galleryController.updateGallery)
    .get("/gallery-get", galleryController.getGallery)
    .delete("/gallery-delete/:id", galleryController.deleteGallery)

// .post("/admin-login", authController.loginAdmin)
// .post("/admin-logout", authController.logoutAdmin)




module.exports = router
