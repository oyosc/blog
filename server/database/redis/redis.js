const {promisify} = require('util')
const redis = require("redis")

let getAsync, setAsync, ttlAsync, delAsync;

//对redis的函数进行promisify并初始化
const redis_init = (port, url) => {
    let client = redis.createClient(port, url)
    getAsync = promisify(client.get).bind(client)
    setAsync = promisify(client.set).bind(client)
    ttlAsync = promisify(client.ttl).bind(client)
    delAsync = promisify(client.del).bind(client)
    return client;
}



export {
    getAsync,
    setAsync,
    ttlAsync,
    delAsync,
    redis_init
}