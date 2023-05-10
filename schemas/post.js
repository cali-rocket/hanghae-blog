const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
{ timestamps: true });

module.exports = mongoose.model("Posts", postsSchema);