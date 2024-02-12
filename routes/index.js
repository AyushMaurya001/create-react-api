const express = require("express");
const v1 = express.Router();

const userRouter = require("./user");
const accountRouter = require("./account");

v1.use("/user", userRouter);
v1.use("/account", accountRouter);

module.exports = v1;