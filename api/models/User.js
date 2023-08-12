const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
        unique:true
    },
    userName:{
        type:String,
        required:[true,"UserName is Required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        trim:true,
        select:false
    },
    passwordUpdatedAt:{
        type:Date
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    verifyEmailToken:{
        type:String,
        trim:true,
        select:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    blogName:{
        type:String,
        required:[true,"blogName is required"],
        unique:true,
        index:true
    }
},{timestamps:true})

//emailtoken encryption and password encryption

userSchema.pre('save',async function(next){
    if(!this.isModified('password') || !this.isModified('verifyEmailToken')){
        next();
    }
    //if any of them is modified encrypt them
    const saltRounds = 10;
    this.password = this.password ? await bcrypt.hash(this.password,saltRounds) : undefined
    this.verifyEmailToken = this.verifyEmailToken ? await bcrypt.hash(this.verifyEmailToken,saltRounds) : undefined

    next();

})

userSchema.methods.isValidPassword = async function(userPwd,dbPwd){
    return await bcrypt.compare(userPwd,dbPwd)
}

userSchema.methods.isValidEmailToken = async function(userToken,dbToken){
    return await bcrypt.compare(userToken,dbToken)
}

const userModel = mongoose.model('User',userSchema)

module.exports = userModel