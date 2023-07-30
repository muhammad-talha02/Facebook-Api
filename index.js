const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors')
const port = 8000;
const userRoute = require("./routes/users");
const authRouter =require("./routes/auth")
const postRouter =require("./routes/posts")
dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected Database")).catch((err) => console.log("Database Error"))


//Middle
let corsOptions = {
    origin : ['http://localhost:5173'],
 }

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


app.listen(port, () => {
    console.log(`App is Running at ${port}`)
})