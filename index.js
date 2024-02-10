const express = require("express");
const app = express();

app.get('/', (req, res)=>{
    res.json({
        msg: "server started"
    })
})

app.listen(1000, (req, res)=>{
    console.log(`server is started at ${1000}`)
})