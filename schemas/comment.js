const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
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
    comment: {
        type: String,
        required: true
    },  
},
{ timestamps: true });

module.exports = mongoose.model("Comments", commentsSchema);