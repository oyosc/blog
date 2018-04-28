import crypto from 'crypto'

const handleErr = (promise) => {
    return promise.then((data) => {
        return [null, data];
    }).catch(err => [err]);
}

module.exports = {
    MD5_SUFFIX: 'eisdsadawwada这个是加密的信息哦%%%@@!',
    md5: function(pwd){
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res, httpCode=500, code=3, message='服务端异常', data={}){
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        res.status = httpCode;
        res.set({'Authorization': data.token});
        res.body = JSON.stringify(responseData)
    },
    handleErr
}