const express = require('express')
const router = express.Router({mergeParams:true})
const commentController = require('../controllers/comment')
const { verifyLogin } = require('../../lib/middlewares/authorization')


router.
route('/')
.post(verifyLogin,commentController.postNewComment)
.get(verifyLogin,commentController.getCommentOnBlogs)

router
.route('/:commentId')
.patch(verifyLogin,commentController.updateMyComment)
.delete(verifyLogin,commentController.deleteMyComment)

router
.route('/:commentId/replies')
.post(verifyLogin,commentController.replyToAComment)
.get(verifyLogin,commentController.getChildCommentsOfAComment)

router.get('/test',async(req,res,next) => {
    res.send("test")
})

module.exports = router