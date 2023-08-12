const userModel = require('../../api/models/User');
const {errorHandler} = require('../error-handler/index');
const {verifyAccessToken} = require('./../utils/token')
exports.verifyLogin = async(req,res,next) => {
    try{
        let token = req.headers.authorization
        if(!token){
            return errorHandler({message:"Invalid Access.Please Login Again"},res,401)
        }
        token = token.split('Bearer ')[1]
        //decode token
        const decode = verifyAccessToken(token)
        if(!decode){
            return errorHandler({message:"UnAuthorised Access.Please login again"},res,401)
        }
        const user = await userModel.findById(decode.userId)
        if(!user){
            return errorHandler({message:"User not found or account suspended"},403)
        }
        //assigning this user to currentUser for next Middleware
        req.currentUser = user
        next()
    }
    catch(err){
        console.log(err)
        return errorHandler(err,res,500)
    }
}