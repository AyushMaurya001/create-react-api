const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../database/db");
const { default: mongoose } = require("mongoose");
const { authMiddleware } = require("../middleware/middleware");

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

userRouter.post("/signup", async (req, res)=>{
    try {
        const { email, password, firstName, lastName } = req.body;
        const { success } = signupBody.safeParse({ email, password, firstName, lastName });
        if (!success){
            return res.status(411).json({
                msg: "Entered inputs are wrong"
            })
        }
        const existingUser = await User.findOne({
            email
        });
        if (existingUser){
            return res.status(411).json({
                msg: "email already used"
            })
        }
        const createdUser = await User.create({
            email,
            password,
            firstName,
            lastName
        });
        const createdAccount = await Account.create({
            userId: createdUser._id,
            balance: Math.floor(Math.random()*10000+1)
        });
        const token = jwt.sign({
            userId: createdUser._id
        }, JWT_SECRET);
    
        res.json({
            msg: "Signup successful",
            token: token
        })
    } catch (err){
        res.json({
            err
        })
    }
})

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
})

userRouter.post("/signin", async (req, res)=>{
    const { success } = signinBody.safeParse(req.body);
    if (!success){
        return res.status(411).json({
            msg: "Input entered are in wrong format"
        })
    }
    const existingUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if (!existingUser){
        return res.status(411).json({
            msg: "Entered email/password are wrong"
        })
    }
    const token = jwt.sign({
        userId: existingUser._id
    }, JWT_SECRET);
    return res.json({
        msg: "Signin successful",
        token: token
    })
})

const updateBody = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

userRouter.put("/update", authMiddleware, async (req, res)=>{
    const user = await User.findOne({
        _id: req.userId
    })
    const { success } = updateBody.safeParse(req.body)
    if (!success){
        res.status(411).json({
            msg: "Incorrect Inputs"
        })
    }
    const userDataUpdate = await User.updateOne({
        _id: req.userId
    }, {
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    res.json({
        msg: "Data Updated"
    })
})

userRouter.get("/users", authMiddleware, async (req, res)=>{
    const filter = req.query.search || "";
    const users = await User.find({
        $or: [{
            firstName: {'$regex': filter}
        }, {
            lastName: {'$regex': filter}
        }],
        $nor: [{
            _id: req.userId
        }]
    });
    res.json({
        users: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

userRouter.get("/about", authMiddleware, async (req, res)=>{
    const response = await User.findOne({
        _id: req.query.userId
    })
    if (!response) return res.json();
    const name = response.firstName + " " + response.lastName;
    res.json(
        name
    )
})

userRouter.get("/name", authMiddleware, async (req, res)=>{
    const response = await User.findOne({
        _id: req.userId
    })
    const name = response.firstName + " " + response.lastName;
    res.json(
        name
    )
})

module.exports = userRouter;