const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { User, Account } = require("../database/db");
const zod = require("zod");
const { default: mongoose } = require("mongoose");
const accountRouter = express.Router();

const sendMoneyBody = zod.object({
    to: zod.string(),
    amount: zod.number()
})

accountRouter.post("/sendmoney", authMiddleware, async (req, res)=>{
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const { to, amount } = req.body;
        const { success } = sendMoneyBody.safeParse({ to, amount });
        if (!success || amount===0){
            await session.abortTransaction();
            return res.status(411).json({
                msg: "Incorrect(to, amount) inputs"
            })
        }
        // debit + save as transaction in send
        const fromAccount = await Account.findOne({
            userId: req.userId
        }).session(session);
        if (!fromAccount || fromAccount.balance<amount){
            await session.abortTransaction();
            return res.status(411).json({
                msg: "Insufficient balance"
            })
        }
        const debitedAccount = await Account.updateOne({
            userId: req.userId
        }, {
            $inc: {
                balance: -amount
            },
            $push: {
                "transaction.send": {
                    toUserId: to,
                    amount: amount
                }
            }
        }).session(session);
        // credit + save as transaction in recieved
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);
        if (!toAccount){
            await session.abortTransaction();
            return res.status(411).json({
                msg: "Incorrect(to) inputs"
            })
        }
        const creditedAccount = await Account.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount
            },
            $push: {
                "transaction.recieved": {
                    fromUserId: req.userId,
                    amount: amount
                }
            }
        }).session(session);
        session.commitTransaction();
        res.json({
            msg: "Transaction successful"
        })
    } catch (err){
        console.log(err);
    }
})

accountRouter.get("/balance", authMiddleware, async (req, res)=>{
    const userId = req.userId
    const userAccount = await Account.findOne({
        userId
    })
    const balance = userAccount.balance;
    res.json({
        balance
    })
})

accountRouter.get("/transaction", authMiddleware, async (req, res)=>{
    const userId = req.userId
    const userAccount = await Account.findOne({
        userId
    })
    const transactions = userAccount.transaction;
    res.json({
        transactions
    })
})

module.exports = accountRouter;