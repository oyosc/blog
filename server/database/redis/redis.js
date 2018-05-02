const {promisify} = require('util')
const redis = require("redis")

let getAsync, setAsync, ttlAsync;

const redis_init = (port, url) => {
    let client = redis.createClient(port, url);
    getAsync = promisify(client.get).bind(client);
    setAsync = promisify(client.set).bind(client);
    ttlAsync = promisify(client.ttl).bind(client);
    return client;
}



export {
    getAsync,
    setAsync,
    ttlAsync,
    redis_init
}