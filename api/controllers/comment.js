const { errorHandler } = require('../../lib/error-handler');
const commentModel = require('../models/Comment')
const {clearCaches} = require('../../lib/cache/cache')
const cacheUtils = require('../../lib/utils/cacheUtil');
const { application } = require('express');
const postNewComment = async(req,res,next) => {
    try{
        const {blogId} = req.params;
        if(!req.body.comment || !blogId){
            return errorHandler({message:"Comment and blogId is required"},res,400)
        }
        const blogObj = {
            blogId,
            userId:req.currentUser._id,
            comment:req.body.comment,
            //reply to a comment cannot be created using this api
            parentId:null
        }

        //lets finally create comment
        const newComment = await commentModel.create(blogObj)
        clearCaches([cacheUtils.hashForCommentOnBlog(blogId)])
        return res.status(201).json({
            status:"Success",
            message:"Comment Created Successfully",
            data:newComment
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const getCommentOnBlogs = async(req,res,next) => {
    try{
        //get root level comments of a blog
        const comments = await commentModel.find({blogId:req.params.blogId,parentId:null}).sort('-createdAt').applyCache({parentHashKeys:cacheUtils.hashForCommentOnBlog(req.params.blogId)})
        return res.status(200).json({
            status:"Success",
            message:"List Of Comment On Blogs",
            data:comments
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const replyToAComment = async(req,res,next) => {
    try{
        const {commentId} = req.params
        const {comment} = req.body
        let parentId;
        if(!comment || !commentId){
            return errorHandler({message:"Comment and comment id is required"},res,400)
        }
        const isParentCommentExist = await commentModel.findById(commentId)
        if(!isParentCommentExist){
            return errorHandler({message:"Comment You are replying to no longer exist"},res,400)
        }
        //if parent comment is also a child comment assign this new comment to root comment otherwise to comment id passed in path
        parentId = isParentCommentExist.parentId != null ? isParentCommentExist.parentId : commentId

        //let's finally create a reply
        const reply = await commentModel.create({
            userId:req.currentUser._id,
            blogId:isParentCommentExist.blogId,
            comment,
            parentId
        })
        clearCaches([cacheUtils.hashForCommentReplies(commentId)])

        return res.status(200).json({
            status:"Success",
            message:"Reply Posted Successfully",
            data:reply
        })
        
    }
    catch(err){
        console.log(err)
        return errorHandler(err,res,500)
    }
}
const getChildCommentsOfAComment = async(req,res,next) => {
    try{
        const {commentId} = req.params
        if(!commentId){
            return errorHandler({message:"Path should have commentId"},res,400)
        }
        const childComments = await commentModel.find({
            parentId:commentId
        }).sort('-createdAt').applyCache({parentHashKeys:cacheUtils.hashForCommentReplies(commentId)})
        return res.status(200).json({
            status:"Success",
            message:"Comments of A comment",
            data:childComments
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const updateMyComment = async(req,res,next) => {
    try{
        //first check if the comment we are trying to edit belongs to us
        const {commentId} = req.params
        const {comment} = req.body
        if(!comment || !commentId){
            return errorHandler({message:"Comment and comment id is required"},res,400)
        }
        const isCommentMine = await commentModel.findOneAndUpdate(
            {
                _id:commentId,
                userId:req.currentUser._id
            },
            {comment},
            {new:true}
        )

        if(!isCommentMine){
            return errorHandler({message:"No such comment exist or doesn't belongs to you"},res,404)
        }
        return res.status(202).json({
            status:"Success",
            message:"Comment Edited Successfully",
            data:isCommentMine

        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const deleteMyComment = async(req,res,next) => {
    try{
        const {commentId} = req.params
        if(!commentId){
            return errorHandler({message:"Comment and comment id is required"},res,400)
        }
        const isCommentMine = await commentModel.findOneAndDelete({
            _id:commentId,
            userId:req.currentUser._id
        })
        if(!isCommentMine){
            return errorHandler({message:"No such comment exist or doesn't belongs to you"},res,404)
        }
        //--------------Todo-----------------------------
        //if comment is root comment also delete its child element if exist
        return res.status(202).json({
            status:"Success",
            message:"Comment Edited Successfully",
            data:null
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

module.exports = {
    postNewComment,
    getCommentOnBlogs,
    replyToAComment,
    getChildCommentsOfAComment,
    updateMyComment,
    deleteMyComment
}