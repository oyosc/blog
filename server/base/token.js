const jwt = require('jsonwebtoken')
import {Base64} from 'js-base64'
import {jwt_config} from './config'
import {getAsync, setAsync, ttlAsync, delAsync} from '../database/redis/redis'
import {handleErr} from './util'
import {findOneUser} from '../models/user'
import errCodes from './errCodes'
import log from "../log/log"

const util = require('util')

//token进行签名
async function signToke(user){
    log.debug(__filename, __line(__filename), "sign_token: " + user)
    let baseJti = user._id + Base64.encode(user.username) + Date.parse(new Date());
    const token = jwt.sign({
        userId: user._id,
        userType: user.type === '1' ?'user':'admin',
        username: user.username,
        avatar_url: user.avatar,
        github_url: user.github_url,
        jti: baseJti,
        iat: Date.parse(new Date()),
        exp: Date.parse(new Date()) + 1000*60*30
    }, jwt_config.jwt_secret);
    let [err, message] = await handleErr(setAsync(baseJti, '0', 'EX', 60*30));
    if(err) log.error(__filename, __line(__filename), "redis存储key失败");
    return token;
}

//验证token
async function checkToke(authorization){
    log.debug(__filename, __line(__filename), authorization)
    let decoded =jwt.decode(authorization, {complete: true})
    if(!decoded) return {'statusCode': '10002', 'message': {err: errCodes['10002']}} //这里要进行判断，因为jwt.decode这个不会返回错误
    let baseJti = decoded.payload['jti']
    let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwt_config.jwt_secret))
    if(verifyErr) return {'statusCode': verifyErr, 'message': {err: verifyMessage}}
    let nowTime = Date.parse(new Date())
    if(verifyMessage['iat'] > nowTime || verifyMessage['exp'] < nowTime){
        log.error(__filename, __line(__filename),'token已经失效，请重新登录')
        return {'statusCode': '401', 'message': {err: errCodes['401']}}
    }else{
        let [getRedisErr, getRedisValue] = await handleErr(getAsync(verifyMessage['jti']))
        if(getRedisErr) return {'statusCode': '30001', 'message': {err: getRedisErr}}
        if(getRedisValue === null) return {'statusCode': '30002', 'message': {err: errCodes['30002']}}
        if(getRedisValue == '0'){
            let [ttlErr, ttlTime] = await handleErr(ttlAsync(baseJti)) //查询redis中是否有该token
            let [err, message] = await handleErr(setAsync(baseJti, '1', 'EX', ttlTime))
            if(err || ttlErr) return {'statusCode': '30001', 'message': {err: getRedisErr}}
            let userInfo = {
                _id: decoded.payload['userId'],
                type: decoded.payload['userType'] == 'user' ? '1' : '0',
                username: decoded.payload['username'],
                avatar: decoded.payload['avatar_url'],
                github_url: decoded.payload['github_url']
            };
            let [registerTokenErr, registerToken] = await handleErr(signToke(userInfo));//生成新的token
            if(registerTokenErr) return {'statusCode': '30004', 'message': {err: registerTokenErr}}
            return {'statusCode': '200', 'message': {'token': registerToken, 'userId': decoded.payload['userId'],'username': decoded.payload['username']}}
        }else{
            return {'statusCode': '30003', 'message': {err: errCodes['30003']}}
        }
    }
}

//删除token
async function deleteToke(authorization){
    let decoded =jwt.decode(authorization, {complete: true})
    if(!decoded) return {'code': '0', 'message': 'token解析错误'} //这里要进行判断，因为jwt.decode这个不会返回错误
    let baseJti = decoded.payload['jti']
    let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwt_config.jwt_secret))
    if(verifyErr) return {'code': '0', 'message': '获取jwt发生错误'}
    let [delRedisErr, reply] = await handleErr(delAsync(verifyMessage['jti']))
    if(delRedisErr){
        log.error(__filename, __line(__filename), delRedisErr);
        return {'code': '0', 'message': '删除token失败'}
    }else{
        return {'code': '1', 'message': '删除token成功'}
    }
}

module.exports = {
    signToke,
    checkToke,
    deleteToke
}
