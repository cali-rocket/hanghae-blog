const mongoose = require("mongoose");


const postsSchema = new mongoose.Schema({

    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: Number,
        required: true
    },
    title: {
        type: String,
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


/* postsSchema.virtual('postId').get(function() {
    return this._id.toHexString();  // 이 부분의 this._id에 해당하는 부분을 가상화 시킨다.
  }); 
  postsSchema.set('toJSON', { virtuals: true });
   */

module.exports = mongoose.model("Posts", postsSchema);
