const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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
    type:{
        type:String,
        trim:true,
        enum:['UpVote','DownVote'],
        required:[true,"vote type is required"]
    },
},{timestamps:true})

const voteModel = mongoose.model('Vote',voteSchema)

module.exports = voteModel