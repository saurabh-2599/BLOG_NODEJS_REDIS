const redis = require('redis')
const mongoose = require('mongoose')
const redisClient = redis.createClient()

//creating connection
redisClient.connect()
.then(res => {
    console.log("Connected To Redis Successfully")
})
.catch(err => {
    console.log("__Failed in connection with redis")
})
const originalExec = mongoose.Query.prototype.exec

//get data from cache only if this method is called on query
mongoose.Query.prototype.applyCache = function(options){
    this.useCache = true
    if(options){
        this.parentHashKeys = options.parentHashKeys
    }
    return this;
}

//The best place to write caching logic is when query object created and actually issued that is when resolving query
mongoose.Query.prototype.exec = async function(){
    try{
        if(!this.useCache){
            //serving from database
            console.log("Do not check cache get it from database")
            const data = originalExec.apply(this)
            return data
        }
        //this here refers to current query
        const currentQuery = {...(this.getQuery())}
        currentQuery.collectionName = this.model.collection.name
        const cacheKey = JSON.stringify(currentQuery)
    
        //first check if this query issued before usng unique key = queryobj and collectionName

        const isCacheDataExist = await redisClient.hGet(this.parentHashKeys,cacheKey)

        //if prsent servce directly from cache
        if(isCacheDataExist){
            let cacheData = JSON.parse(isCacheDataExist)
            //exec always return mongo document but we have js obj so convert it in mongoose document
            console.log("__Serving from cache____")
            if(Array.isArray(cacheData)){
                cacheData = cacheData.map(element => this.model(element))
                return cacheData
            }
            return this.model(cacheData)
        }
        //go to db fetch result
        const dbResult = await originalExec.apply(this)
        //save this in cache
        await redisClient.hSet(this.parentHashKeys,cacheKey,JSON.stringify(dbResult))
        //autoexpire cache in 10mins
        redisClient.expire(this.parentHashKeys,10*60)
        console.log("___Serving from database___")
        return dbResult
    }
    catch(err){
        console.log(err)
    }
}

const clearCaches = async (parentHashKeys) => {
    try{
        console.log(parentHashKeys)
        for(let hash of parentHashKeys){
            await redisClient.del(hash)
        }
        console.log('((((((((((Cacche Cleared Successfully))))))))))))))))')
    }
    catch(err){
        console.log(err)
    }
}



module.exports = {redisClient,clearCaches}