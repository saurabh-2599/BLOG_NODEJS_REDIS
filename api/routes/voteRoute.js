const express = require('express')
const router = express.Router({mergeParams:true})
const voteController = require('../controllers/vote')
const { verifyLogin } = require('../../lib/middlewares/authorization')


router
.route('/')
.post(verifyLogin,voteController.createUpvoteOrDownVoteOnBlog)
.get(voteController.getAllUpVotesOrDownVotesOfBlog)
.delete(verifyLogin,voteController.removeMyVotesOrDownVotesOnBlog)

router.get('/test',async(req,res,next) => {
    res.send("test")
})

module.exports = router