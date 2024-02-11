const express = require("express");
const app = express();

app.get("/", (req, res)=>{
    res.json("server started")
})

app.listen(1000, (req, res)=>{
    console.log("server started at 1000 port");
})