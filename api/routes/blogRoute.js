const express = require('express')
const router = express.Router()
const commentRouter = require('./commentRoute')
const voteRouter = require('./voteRoute')
const blogController = require('../controllers/blog')
const {verifyLogin} = require('../../lib/middlewares/authorization')

router
.route('/')
.post(verifyLogin,blogController.createNewBlog)
.get(blogController.getAllBlogs)

router
.route('/me')
.get(verifyLogin,blogController.getMyBlogs)


router
.route('/:blogId')
.get(blogController.getBlogDetailsById)
.patch(verifyLogin,blogController.updateBlogById)
.delete(verifyLogin,blogController.deleteBlogById)

//router is also a middleware so mounting this route to comment router
router.
use('/:blogId/comments',commentRouter)

//mounting to vote Router
router
.use('/:blogId/votes',voteRouter)



router.get('/test',async(req,res,next) => {
    res.send("test")
})

module.exports = router
