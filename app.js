const express = require('express')
const morgan = require('morgan')
const userRouter = require('./api/routes/userRoute')
const blogRouter = require('./api/routes/blogRoute')
const commentRouter = require('./api/routes/commentRoute')
const voteRouter = require('./api/routes/voteRoute')
const {errorHandler} = require('./lib/error-handler')

//creating a express server
const app = express()

//allow our server to receive data in body using body parser middleware

app.use(express.json())

//morgan - a logging middleware
app.use(morgan('dev'))
//mounting router to route
app.use('/api/users',userRouter)
app.use('/api/blogs',blogRouter)
app.use('/api/comments',commentRouter)
app.use('/api/votes',voteRouter)

//handling unhandledRoutes 
app.all('*',(req,res,next) => {
    return errorHandler({
        message:"No such path exist"
    },res,404)
})


module.exports = app;