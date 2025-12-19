const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const departmentController = require("./../controller/department.controller");

router
    .post("/department-add", adminProtected, departmentController.addDepartment)
    .put("/department-update/:id", departmentController.updateDepartment)
    .get("/department-get", departmentController.getDepartment)


    // find sport
    .get("/fetch-sport", departmentController.findSport)
    .delete("/department-delete/:id", departmentController.deleteDepartment)
// .post("/admin-logout", authController.logoutAdmin)




module.exports = router
