const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:[true,"Blog Id is required"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User Id is Required"]
    },
    comment:{
        type:String,
        trim:true,
        maxLength:150
    },
    //one-level nesting of comment --> reply on comment
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        default:null
    }
},{timestamps:true})

const commentModel = mongoose.model('Comment',commentSchema)

module.exports = commentModel