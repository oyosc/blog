const jwt = require('jsonwebtoken')
import {Base64} from 'js-base64'
import {jwt_config} from '../config'
import {getAsync, setAsync} from '../database/redis/redis'
import {handleErr} from '../util'
import {findUserById} from '../models/user'
import errCodes from '../errCodes'

const util = require('util')

async function signToke(user){
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
    if(err) console.log("redis存储key失败");
    return token;
}

async function checkToke(authorization){
    let decoded = jwt.decode(authorization, {complete: true});
    console.log(decoded.payload['userId']);
    let result = await findUserById(decoded.payload['userId']);
    if(result.errCode == '200'){
        let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwt_config.jwt_secret));
        if(verifyErr) return {'errcode': verifyErr, 'message': verifyMessage}
        let nowTime = Date.parse(new Date());
        if(verifyMessage['iat'] > nowTime || verifyMessage['exp'] > nowTime){
            console.log('token已经失效，请重新登录');
            return {'errCode': '401', 'message': errCodes['401']}
        }else{
            let [getRedisErr, getRedisValue] = await handleErr(getAsync(verifyMessage['jti']));
            if(getRedisErr) return {'errcode': '20001', 'message': getRedisErr}
            if(getRedisValue === null) return {'errcode': '20002', 'message': errCodes['20002']}
            if(getRedisValue == '0'){
                return {'errCode': '200', 'message': 'token正常，可以访问'}
            }else{
                return {'errCode': '20003', 'message': errCodes['20003']}
            }
        }
    }else{
        return {'errCode': result.errCode, 'message': result.message}
    }
}

module.exports = {
    signToke,
    checkToke
}
