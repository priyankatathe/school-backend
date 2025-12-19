const router = require("express").Router();

const { adminProtected, clearkProtected } = require("../middleware/protected");
const authController = require("./../controller/admin.controller");

router
    .post("/admin-register", authController.registerAdmin)
    .post("/admin-login", authController.loginAdmin)
    .post("/admin-logout", authController.logoutAdmin)

    .get("/admin-fetch", adminProtected, authController.fetchAdmin)
    .get("/cleark-fetch", adminProtected, authController.fetchCleark)
    .get("/cleark-find", clearkProtected, authController.findCleark)

    .post("/cleark-register", adminProtected, authController.registerCleark)
    .post("/cleark-login", authController.loginCleark)
    .post("/cleark-logout", authController.logoutCleark)



module.exports = router;
