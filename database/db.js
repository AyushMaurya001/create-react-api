const mongoose = require("mongoose");

const connectDb = (url) => {
    mongoose.connect(url)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err));
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 1,
        maxLength: 99,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 99,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 99,
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        required: true
    },
    transaction: {
        send: [{
            toUserId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }],
        recieved: [{
            fromUserId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }]
    }
})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    connectDb,
    User,
    Account,
}