const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const teacherController = require("./../controller/teacher.controller");

router
    .post("/staff-add", adminProtected, teacherController.addTeacher)
    .put("/staff-update/:id", teacherController.updateTeacher)
    .get("/staff-get", teacherController.getTeacher)
    .delete("/staff-delete/:id", teacherController.deleteTeacher)


module.exports = router
