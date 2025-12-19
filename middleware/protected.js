const jwt = require("jsonwebtoken")

// admin protected
exports.adminProtected = (req, res, next) => {
    const { admin } = req.cookies
    if (!admin) {
        return res.status(401).json({ messae: "No Cookie Found" })
    }
    // token verify
    jwt.verify(admin, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ message: "Invalid Token" })

        }
        req.user = decode.userId
    })
    next()
}

// cleark protected
exports.clearkProtected = (req, res, next) => {
    const { cleark } = req.cookies
    if (!cleark) {
        return res.status(401).json({ messae: "No Cookie Found" })
    }
    // token verify
    jwt.verify(cleark, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode.adminId
    })
    next()
}