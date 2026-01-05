const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const addformController = require("./../controller/addForm.controller");

router
// ✅ ADD ADMISSION
.post("/add-admission", addformController.addAdmission)

// ✅ GET ALL ADMISSIONS
.get("/get-admissions", addformController.getAdmissions)

// ✅ UPDATE ADMISSION STATUS
.put("/update-admission-status/:id", addformController.updateAdmissionStatus)


module.exports = router
