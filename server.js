const dotenv = require('dotenv')
const mongoose = require('mongoose')

//reading environment variables
dotenv.config({path:"./config.env"})
require('./lib/cache/cache')

const app = require('./app.js')

//setting up connection with database
mongoose
.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(data => console.log("__Database connection successful__"))
.catch(err => console.log("___Failed in connection with database____",err))


//making our express server to listen requests

app.listen(process.env.PORT,() => {
    console.log(`___Server has been started on port - ${process.env.PORT}____`)
    console.log("RedisUrl",process.env.REDIS_URL)
})
