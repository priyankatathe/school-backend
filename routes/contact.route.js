const router = require("express").Router();

const { adminProtected } = require("../middleware/protected");
const contactController = require("./../controller/contact.controller");

router
.get("/contact-get", contactController.getContact)
.post("/contact-add", contactController.addContact)
.get("/contact/:id", contactController.getSingleContact)
.delete("/contact-delete/:id", contactController.deleteContact)


module.exports = router
