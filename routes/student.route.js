const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const studentController = require("./../controller/student.controller");

router
    .post("/student-add", adminProtected, studentController.addStudent)
    .put("/student-update/:id", studentController.updateStudent)
    .get("/student-get", studentController.getStudent)
    .delete("/student-delete/:id", studentController.deleteStudent)

module.exports = router
