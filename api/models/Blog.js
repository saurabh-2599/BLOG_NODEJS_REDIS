const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"User Id id Required"]
    },
    title:{
        type:String,
        required:[true,"title is required"],
        maxLength:100,
        trim:true,
        unique:true
    },
    content:{
       type:String,
       required:[true,"content is required"],
       trim:true,
       maxLength:1000 
    },
    heroImage:{
        type:String,
        required:false,
        default:null
    },
    authorName:{
        type:String,
        required:[true,"Author Name is Required"]
    },
    isPublished:{
        type:Boolean,
        default:true
    }

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

//virtual populate voteCount

blogSchema.virtual('upVoteCount',{
    ref:'Vote',
    localField:'_id',
    foreignField:'blogId',
    options:{match:{type:'UpVote'}},
    count:true
})

//virtual populate downvote count

blogSchema.virtual('downVoteCount',{
    ref:'Vote',
    localField:'_id',
    foreignField:'blogId',
    options:{match:{type:'DownVote'}},
    count:true
})

const blogModel = mongoose.model('Blog',blogSchema)

module.exports = blogModel