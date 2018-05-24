const jwt = require('jsonwebtoken')
import {Base64} from 'js-base64'
import {jwt_config} from '../config'
import {getAsync, setAsync, ttlAsync} from '../database/redis/redis'
import {handleErr} from '../util'
import {findOneUser} from '../models/user'
import errCodes from '../errCodes'

const util = require('util')

//token进行签名
async function signToke(user){
    console.log(user);
    let baseJti = user._id + Base64.encode(user.username) + Date.parse(new Date());
    const token = jwt.sign({
        userId: user._id,
        userType: user.type?'user':'admin',
        username: user.username,
        jti: baseJti,
        iat: Date.parse(new Date()),
        exp: Date.parse(new Date()) + 30
    }, jwt_config.jwt_secret);
    let [err, message] = await handleErr(setAsync(baseJti, '0', 'EX', 30));
    console.log("token");
    console.log(token);
    if(err) console.log("redis存储key失败");
    return token;
}

//验证token
async function checkToke(authorization){
    let decoded =jwt.decode(authorization, {complete: true});
    if(!decoded) return {'errcode': '10002', 'message': errCodes['10002']}; //这里要进行判断，因为jwt.decode这个不会返回错误
    let baseJti = decoded.payload['jti'];
    let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwt_config.jwt_secret));
    if(verifyErr) return {'errcode': verifyErr, 'message': verifyMessage}
    let nowTime = Date.parse(new Date());
    if(verifyMessage['iat'] > nowTime || verifyMessage['exp'] > nowTime){
        console.log('token已经失效，请重新登录');
        return {'errCode': '401', 'message': errCodes['401']}
    }else{
        let [getRedisErr, getRedisValue] = await handleErr(getAsync(verifyMessage['jti']));
        if(getRedisErr) return {'errcode': '30001', 'message': getRedisErr}
        if(getRedisValue === null) return {'errcode': '30002', 'message': errCodes['30002']}
        if(getRedisValue == '0'){
            let [ttlErr, ttlTime] = await handleErr(ttlAsync(baseJti)); //查询redis中是否有该token
            let [err, message] = await handleErr(setAsync(baseJti, '1', 'EX', ttlTime));
            if(err || ttlErr) return {'errcode': '30001', 'message': getRedisErr};
            let userInfo = {
                _id: decoded.payload['userId'],
                type: decoded.payload['usertype'] == 'user' ? 1 : 0,
                username: decoded.payload['username']
            };
            let [registerTokenErr, registerToken] = await handleErr(signToke(userInfo));//生成新的token
            if(registerTokenErr) return {'errcode': '30004', 'message': registerTokenErr};
            return {'errCode': '200', 'message': {'token': registerToken}};
        }else{
            return {'errCode': '30003', 'message': errCodes['30003']}
        }
    }
}

module.exports = {
    signToke,
    checkToke
}
