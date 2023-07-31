const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const multer = require("multer")
const path = require("path")
const port = 8000;
const userRoute = require("./routes/users");
const authRouter = require("./routes/auth")
const postRouter = require("./routes/posts")
dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected Database")).catch((err) => console.log("Database Error"))


app.use("/images", express.static(path.join(__dirname, "public/images")))

//Middle
let corsOptions = {
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet())
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images")
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const upload = multer({storage:storage })
// const upload = multer({dest:"public/images"})

app.post('/api/upload', upload.single("file"), (req, res) => {
    console.log(req.file)
    try {
        res.status(200).json("File uploaded")
    } catch (error) {
        console.log(error)
    }
})

app.use("/api/users", userRoute)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


app.listen(port, () => {
    console.log(`App is Running at ${port}`)
})