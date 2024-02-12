const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authMiddleware(req, res, next){
    try {
        const authorization = req.headers.authorization;
        if (!authorization.startsWith('Bearer ')){
            return res.status(403).json({
                msg: "token verification unsuccessful"
            })
        }
        const token = authorization.split(' ');
        const decoded = jwt.verify(token[1], JWT_SECRET);
        const userId = decoded.userId;
        req.userId = userId;
        next();
    } catch (err){
        return res.status(403).json({
            msg: "token verification unsuccessful"
        })
    }
}

module.exports = {
    authMiddleware,
}