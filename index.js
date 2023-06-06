const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./Routes/user.routes");
const { postsRouter } = require("./Routes/posts.routes");
const app = express();
require("dotenv").config();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("SOCIAL MEDIA APP")
})

app.use("/",userRouter)
app.use("/",postsRouter)


app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("Connected to the Data Base")
        console.log("Connected to Server")
    } catch (error) {
        console.log({"Message":"Error while making connection","ERROR":error})
    }
})