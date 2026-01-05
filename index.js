const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieparser = require("cookie-parser")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: ["http://localhost:5173",
        "https://school-frontend-wx5h.onrender.com"
    ],
    credentials: true
}))

app.use("/api/admin", require("./routes/auth.route"))
app.use("/api/department", require("./routes/department.route"))
app.use("/api/function", require("./routes/function.route"))
app.use("/api/teacher", require("./routes/teacher.route"))
app.use("/api/student", require("./routes/student.route"))
app.use("/api/gallery", require("./routes/gallery.routes"))
app.use("/api/contact", require("./routes/contact.route"))


app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("mongoose connected")
    app.listen(process.env.PORT, console.log("server runnningg"))
})

