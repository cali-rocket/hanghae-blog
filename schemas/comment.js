const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
 /*    createdAt: {
        type: Date,
        required: true
    } */    
},
{ timestamps: true });

module.exports = mongoose.model("Comments", commentsSchema);