const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const { checkEmpty } = require("../utils/checkEmpty")
const Auth = require("../model/Auth")
const sendEmail = require("../utils/email")

const isProd = process.env.NODE_ENV === "production";

exports.registerAdmin = asyncHandler(async (req, res) => {

    const { name, email, password, mobile, role } = req.body
    const { isError, error } = checkEmpty({ name, email, password, mobile, role })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Stong Password" })
    }

    if (mobile && !validator.isMobilePhone(mobile)) {
        return res.status(400).json({ message: "Provide currect phone Number " })
    }

    const isFound = await Auth.findOne({ email, mobile })
    if (isFound) {
        return res.status(400).json({ message: "Email Or Mobile Already registered witho us " })
    }
    const hash = await bcrypt.hash(password, 10)
    await Auth.create({ name, email, password: hash, role: "admin", mobile, adminId: req.user })
    res.json({ message: "Admin register successfully" })
})

exports.loginAdmin = asyncHandler(async (req, res) => {

    const { email, password, } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }


    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const result = await Auth.findOne({ email })
        if (!result) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        const isVerify = await bcrypt.compare(password, result.password)
        if (!isVerify) {
            return res.status(400).json({ message: "Password do not match" })
        }

        const token = jwt.sign({ userId: result._id },
            process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("admin", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: isProd // ✅ prod=true, local=false

        })

        res.json({
            message: "credentials verify success.",
            result: {
                _id: result._id,
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })

    }


    res.json({ message: "Admin register successfully" })
})
exports.logoutAdmin = (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "admin logout success" })
}

exports.fetchAdmin = asyncHandler(async (req, res) => {
    try {
        const result = await Auth.findOne({ _id: req.user })

        res.json({ message: "Admin fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }

})

exports.fetchCleark = asyncHandler(async (req, res) => {
    try {
        const result = await Auth.find({ role: "cleark" })
        res.json({ message: "Cleark fetch Success", result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }

})



exports.registerCleark = asyncHandler(async (req, res) => {
    const { name, email, mobile, } = req.body
    const { isError, error } = checkEmpty({ name, email, mobile, })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }

    if (mobile && !validator.isMobilePhone(mobile)) {
        return res.status(400).json({ message: "Provide correct phone Number " })
    }
    // 
    const fname = name, imobile = mobile //  create code 
    const n = fname.slice(0, 4) // 0 pasun jat 4 prent 
    const m = imobile.slice(-4)
    const password = n + m
    const hash = await bcrypt.hash(password, 10)
    const isFound = await Auth.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Or Mobile Already registered witho us " })
    }
    await sendEmail({
        to: email,
        subject: "Your Login Credentials",
        message: `
            <h2>Welcome, ${name}!</h2>
            <p>Here are your login credentials:</p>
            <ul>
                <li><strong>Login ID:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please change your password after logging in for the first time.</p>
        `
    })
    await Auth.create({ name, email, password: hash, role: "cleark", mobile, adminId: req.user })
    res.json({ message: "Cleark register successfully" })
})

exports.loginCleark = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }


    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }

        const result = await Auth.findOne({ email })
        if (!result) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        const isVerify = await bcrypt.compare(password, result.password)
        if (!isVerify) {
            return res.status(400).json({ message: "Password do not match" })
        }
        const token = jwt.sign({ adminId: result._id },
            process.env.JWT_KEY, { expiresIn: "15d" })
        res.cookie("cleark", token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true
        })

        return res.json({
            message: "credentials verify success.",
            result: {
                _id: result._id,
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })

    }


    res.json({ message: "Cleark register successfully" })
})
exports.logoutCleark = (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Cleark logout success" })
}

exports.findCleark = asyncHandler(async (req, res) => {
    try {
        const result = await Auth.findOne({ _id: req.user })
        res.json({ message: "Cleark fetch Success", result })
        // const clearkData = {
        //     cleark: result.filter(item => item.category === "cleark"),
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ", error: error.message })
    }
})



