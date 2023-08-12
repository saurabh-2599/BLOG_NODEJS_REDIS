exports.errorHandler = (error,res,statusCode) => {
    
    //handling mongoose duplicate entry path error 
    if(error.code === 11000){
        const keyName = Object.keys(error.keyPattern)[0]
        const keyValue = error.keyValue[keyName]
        error.message = `Value - ${keyValue } for ${keyName} is already taken.`
    }

    return res.status(statusCode).json({
        status :"Fail",
        error : error.message || "something went wrong"
    })
}