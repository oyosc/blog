import crypto from 'crypto'
import request from 'request'
import util from 'util'
const requestPromisify = util.promisify(request)

const handleErr = (promise) => {
    return promise.then((data) => {
        return [null, data];
    }).catch(err => [err]);
}

const asyncRequest = async (options) => {
    let [err, data] = await handleErr(requestPromisify(options))
    if(err){
        return {code:0, err}
    }else{
        return {code:1, data}
    }
}

const getLocalTime = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() +1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year+"/"+month+"/"+day+" " + hour+":"+minute+":"+second

}

module.exports = {
    MD5_SUFFIX: 'eisdsadawwada这个是加密的信息哦%%%@@!',
    md5: function(pwd){
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res, httpCode=500, code=3, message='服务端异常', result={}){
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        res.status = httpCode;
        if(result.token) res.set({'Authorization': result.token});
        if(result!={})  responseData.result = result;
        console.log("result: " + JSON.stringify(responseData));
        res.body = JSON.stringify(responseData)
    },
    handleErr,
    getLocalTime,
    asyncRequest
}