const express = require("express");
const app = express();
const v1 = require("./routes/index")

app.get("/", (req, res)=>{
    res.json("server started")
})

app.use("/api/v1", v1);

app.listen(1000, (req, res)=>{
    console.log("server started at 1000 port");
})