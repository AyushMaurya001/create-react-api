const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const v1 = require("../routes/index");
const cors = require("cors");
const { connectDb } = require("../database/db");
require('dotenv').config();

try {
    connectDb(process.env.MONGODB_CONNECTION_STRING)
} catch (err){
    console.log(err);
}

app.use(cors());
// app.use(cors({
//     origin: ["https://ayush-payment-system.vercel.app"],
//     methods: ["POST", "GET"],
//     credentials: true
// }));

app.use('/api/v1', v1);

app.get("/", (req, res)=>{
    res.json("Server started");
})

app.get("*", (req, res, next)=>{
    res.status(200).json("bad request");
})

app.listen(1000, (req, res)=>{
    console.log("server running");
})