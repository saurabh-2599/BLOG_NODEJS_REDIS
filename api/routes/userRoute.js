const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const {verifyLogin} = require('../../lib/middlewares/authorization')

router.post('/signup',userController.signup)
router.post('/login',userController.login)

router
.route('/me')
.get(verifyLogin,userController.getMyProfile)

router.get('/test',async(req,res,next) => {
    res.send("test")
})


module.exports = router