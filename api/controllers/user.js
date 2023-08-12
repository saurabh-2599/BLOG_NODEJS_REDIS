const userModel = require('../models/User')
const {errorHandler} = require('../../lib/error-handler')
const {generateAccessToken} = require('./../../lib/utils/token')
const randomToken = require('rand-token')

const signup = async (req,res,next) => {
    try{
        const {
            name,
            email,
            userName,
            password,
            blogName
        } = req.body

        if(!name ||!email ||!blogName){
            return errorHandler({message:"Name, Email And BlogName is Required"},res,400)
        }

        if(!userName || !password){
            return errorHandler({message:"UserName and password is Required"},res,400)
        }

        //generate verify Email Token
        req.body.verifyEmailToken = randomToken.generate(16)
        
        //create user in database finally
        const newUser = await userModel.create(req.body)
        //securing password and email token in response
        newUser.password = undefined;
        newUser.verifyEmailToken = undefined;

        if(!newUser){
            return errorHandler({message:"Something went wrong while creating user"},res,400)
        }

        return res.status(200).json({
            status:"Success",
            data:newUser
        })

    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const login = async (req,res,next) => {
    try{
        const {
            userName,
            password
        } = req.body

        if(!userName || !password){
            return errorHandler({message:"username/email and password is required"},res,400)
        }

        //allow login with both username and email
        const isUserExist = await userModel.findOne({$or:[
            {userName},
            {email:userName}
        ]}).select('+password')

        if(!isUserExist){
            return errorHandler({message:"invalid email or password"},res,401)
        }

        const isValidPassword = await isUserExist.isValidPassword(password,isUserExist.password)

        if(!isValidPassword){
            return errorHandler({message:"invalid email or password"},res,401)
        }

        //if email and password is correct generate token
        const token = generateAccessToken(isUserExist._id)

        return res.status(200).json({
            status:"Success",
            message:"Login Success",
            token
        })
        
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

const getMyProfile = async(req,res,next) => {

    try{
        if(!req.currentUser){
            return errorHandler({message:"Please login Again"},res,401)
        }
        return res.status(200).json({
            status:"Success",
            message:"My Profile Data",
            data:req.currentUser
        })
    }
    catch(err){
        return errorHandler(err,res,500)
    }
}

module.exports = {
    signup,
    login,
    getMyProfile
}