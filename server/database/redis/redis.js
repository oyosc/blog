const {promisify} = require('util')
const redis = require("redis")

let getAsync, setAsync;

const redis_init = (port, url) => {
    let client = redis.createClient(port, url);
    getAsync = promisify(client.get).bind(client);
    setAsync = promisify(client.set).bind(client);
    return client;
}



export {
    getAsync,
    setAsync,
    redis_init
}