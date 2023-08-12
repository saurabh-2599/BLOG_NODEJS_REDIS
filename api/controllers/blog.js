const { errorHandler } = require('../../lib/error-handler')
const blogModel = require('../models/Blog')
const {clearCaches} = require('../../lib/cache/cache')
const cacheUtils = require('../../lib/utils/cacheUtil')

const createNewBlog = async(req,res,next) => {
    try{
        const body = {...req.body}
        if(!body.title ||!body.content){
            return errorHandler("Title and content is required")
        }
        body.userId = req.currentUser._id;
        body.authorName = req.currentUser.name
        const newBlogQuery = blogModel.create(body)
        const newBlog = await newBlogQuery
        clearCaches([cacheUtils.hashForBlogs(),cacheUtils.hashForUserBlog(body.userId)])
        if(!newBlog){
            return errorHandler({message:"Something went wrong while creating blogs"},res,500)
        }
        return res.status(201).json({
            status:"Success",
            message:"Blog Created Successfully",
            data:newBlog
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const getMyBlogs = async(req,res,next) => {
    try{
        //set up this query in cache
        const blogs = await blogModel
        .find({userId:req.currentUser._id})
        .populate('upVoteCount downVoteCount')
        .sort('-createdAt')
        .applyCache({parentHashKeys:cacheUtils.hashForUserBlog(req.currentUser._id)})
        return res.status(200).json({
            status:"Success",
            message:"Get My Blogs",
            data:blogs
        })
    }
    catch(err){
        console.log(err)
        return errorHandler(err,res,500)
    }
}

const getAllBlogs = async(req,res,next) => {
    try{
        const blogs = await blogModel.find({isPublished:true}).populate('upVoteCount downVoteCount').sort('-createdAt').applyCache({parentHashKeys:cacheUtils.hashForBlogs()})
        return res.status(200).json({
            status:"Success",
            message:"Get All Blogs",
            data:blogs
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}


const getBlogDetailsById = async(req,res,next) => {
    try{
        const {blogId} = req.params
        if(!blogId){
            return errorHandler({message:"Blog Id is required"},res,400)
        }
        const blog = await blogModel.findById(blogId).populate('upVoteCount downVoteCount').applyCache({parentHashKeys:cacheUtils.hashForBlogDetails(blogId)})
        if(!blog){
            return errorHandler({message:"Blog Not Found"},res,404)
        }
        return res.status(200).json({
            status:"Success",
            message:"Blog Details Fetched successfully",
            data:blog
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const updateBlogById = async(req,res,next) => {
    try{
        const {blogId} = req.params
        if(!blogId){
            return errorHandler({message:"Blog Id is required"},res,400)
        }
        const updateBlog = await blogModel.findOneAndUpdate({
            userId:req.currentUser._id,
            _id:blogId

        },{...req.body},{new:true})

        if(!updateBlog){
            return errorHandler({message:"Blog not exists or not belongs to you"},res,404)
        }
        clearCaches([cacheUtils.hashForBlogs(),cacheUtils.hashForUserBlog(req.currentUser._id),cacheUtils.hashForBlogDetails(blogId)])
        
        return res.status(202).json({
            status:"Success",
            message:"Blog Updated Successfully",
            data:updateBlog
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const deleteBlogById = async(req,res,next) => {
    try{
        const {blogId} = req.params
        if(!blogId){
            return errorHandler({message:"Blog Id is required"},res,400)
        }
        const deleteBlog = await blogModel.findOneAndDelete({
            userId:req.currentUser._id,
            _id:blogId

        })
        if(!deleteBlog){
            return errorHandler({message:"Blog not exists or not belongs to you"},res,404)
        }
        clearCaches([cacheUtils.hashForBlogs(),cacheUtils.hashForUserBlog(body.userId),cacheUtils.hashForBlogDetails(blogId)])
        return res.status(203).json({
            status:"Success",
            message:"Blog Deleted Successfully",
            data:null
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}
module.exports = {
    createNewBlog,
    getMyBlogs,
    getAllBlogs,
    getBlogDetailsById,
    updateBlogById,
    deleteBlogById
}