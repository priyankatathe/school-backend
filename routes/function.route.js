const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const functionController = require("./../controller/function.controller");

router
    .post("/function-add", adminProtected, functionController.addFunction)
    .put("/function-update/:id", functionController.updateFunction)
    .get("/function-get", functionController.getFunction)
    .delete("/function-delete/:id", functionController.deleteFunction)

// .post("/admin-login", authController.loginAdmin)
// .post("/admin-logout", authController.logoutAdmin)




module.exports = router
