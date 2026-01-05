const asyncHandler = require("express-async-handler");
const { checkEmpty } = require("../utils/checkEmpty");
const Contact = require("../model/Contact");

/* =========================
   GET ALL CONTACTS
========================= */
exports.getContact = asyncHandler(async (req, res) => {
    try {
        const result = await Contact.find().sort({ createdAt: -1 });

        res.json({
            message: "Contact Fetch Success",
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

/* =========================
   ADD CONTACT
========================= */
exports.addContact = asyncHandler(async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        const { isError, error } = checkEmpty({ name, email, message });
        if (isError) {
            return res.status(400).json({
                message: "All Fields Required",
                error
            });
        }

        const result = await Contact.create({
            name,
            email,
            message,
        });

        res.json({
            message: "Contact Added Successfully",
            result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

/* =========================
   GET SINGLE CONTACT
========================= */
exports.getSingleContact = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Contact.findById(id);

        if (!result) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Single Contact Fetch Success",
            result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


exports.deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        await Contact.findByIdAndDelete(id);

        res.json({
            message: "Contact Deleted Successfully"
        });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            message: "Failed to delete contact",
            error: error.message
        });
    }
});
