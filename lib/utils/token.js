const jwt = require('jsonwebtoken')

exports.generateAccessToken = (payloadData) => {
    const payload = {
        userId:payloadData
    }
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}

exports.verifyAccessToken = (token) => {
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   
}

exports.generateEmailToken = () => {

}

exports.verifyEmailToken = () => {

}