const { errorHandler } = require('../../lib/error-handler');
const blogModel = require('../models/Blog');
const voteModel = require('../models/Vote')

const createUpvoteOrDownVoteOnBlog = async(req,res,next) => {
    try{
        const {blogId} = req.params;
        const {type} = req.body
        const userId = req.currentUser._id
        if(!blogId || !type){
            return errorHandler({message:"BlogId and Type Of Vote is Required"},res,400)
        }
        const isBlogExistQuery = blogModel.findById(blogId)
        const isAlreadyVotedOrDownVotedQuery = voteModel.findOne({blogId,userId})

        //running both queries in parallel
        const [isBlogExist,isAlreadyVotedOrDownVoted] = await Promise.all([isBlogExistQuery,isAlreadyVotedOrDownVotedQuery])

        if(!isBlogExist){
            return errorHandler({message:"Blog not exist or deleted"},400,res)
        }
        if(isAlreadyVotedOrDownVoted){
            return errorHandler({message:"You have already upvoted/downvoted"},res,400)
        }
        const createVote = await voteModel.create({
            blogId,
            type,
            userId
        })
        return res.status(201).json({
            status:"Success",
            message:`${type} Successfully`,
            data:createVote
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}


const getAllUpVotesOrDownVotesOfBlog = async (req,res,next) => {
    try{
        const {voteType} = req.query
        const {blogId} = req.params;
        const allowedVoteType = ['UpVote','DownVote']
        if(!voteType || !blogId){
            return errorHandler({message:"vote type and blog Id is required"},res,400)
        }
        if(!allowedVoteType.includes(voteType)){
            return errorHandler({message:"invalid vote type"},res,400)
        }
        const votes = await voteModel.find({blogId,type:voteType}).populate({
            path:'userId',
            select:"userName -_id"
        })
        return res.status(200).json({
            status:"Success",
            message:`${voteType} of blogs fetched successfully`,
            data:votes
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const removeMyVotesOrDownVotesOnBlog = async(req,res,next) => {
    try{
        const {voteType} = req.query
        const {blogId} = req.params;
        const allowedVoteType = ['UpVote','DownVote']
        if(!voteType || !blogId){
            return errorHandler({message:"vote type and blog Id is required"},res,400)
        }
        if(!allowedVoteType.includes(voteType)){
            return errorHandler({message:"invalid vote type"},res,400)
        }
        const deletedVote = await voteModel.findOneAndDelete({
            userId:req.currentUser._id,
            blogId,
            type:voteType
        })
        if(!deletedVote){
            return errorHandler({message:"Votes not exist"},res,404)
        }
        return res.status(203).json({
            status:"Success",
            message:"Vote removed successfully",
            data:null
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

module.exports = {
    createUpvoteOrDownVoteOnBlog,
    getAllUpVotesOrDownVotesOfBlog,
    removeMyVotesOrDownVotesOnBlog
}