const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Users", usersSchema);