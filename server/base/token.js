import {Base64} from 'js-base64'
import {jwtConfig} from './config'
import {getAsync, setAsync, ttlAsync, delAsync} from '../database/redis/redis'
import {handleErr} from './util'
import errCodes from './errCodes'
import log from '../log/log'
const jwt = require('jsonwebtoken')
const util = require('util')

// token进行签名
async function signToke (user) {
    log.debug(__filename, __line(__filename), 'sign_token: ' + user)
    let baseJti = user._id + Base64.encode(user.username) + Date.parse(new Date())
    const token = jwt.sign({
        userId: user._id,
        userType: user.type === '1' ? 'user' : 'admin',
        username: user.username,
        avatar_url: user.avatar,
        github_url: user.github_url,
        jti: baseJti,
        iat: Date.parse(new Date()),
        exp: Date.parse(new Date()) + 1000 * 60 * 30
    }, jwtConfig.jwt_secret)
    let [err, message] = await handleErr(setAsync(baseJti, '0', 'EX', 60 * 30))
    log.debug(__filename, __line(__filename), message)
    if (err) log.error(__filename, __line(__filename), 'redis存储key失败')
    return token
}

// 验证token
async function checkToke (authorization) {
    log.debug(__filename, __line(__filename), authorization)
    let decoded = jwt.decode(authorization, {complete: true})
    if (!decoded) return {'statusCode': '10002', 'message': {err: errCodes['10002']}} // 这里要进行判断，因为jwt.decode这个不会返回错误
    let baseJti = decoded.payload['jti']
    let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwtConfig.jwt_secret))
    if (verifyErr) return {'statusCode': verifyErr, 'message': {err: verifyMessage}}
    let nowTime = Date.parse(new Date())
    if (verifyMessage['iat'] > nowTime || verifyMessage['exp'] < nowTime) {
        log.error(__filename, __line(__filename), 'token已经失效，请重新登录')
        return {'statusCode': '401', 'message': {err: errCodes['401']}}
    } else {
        let [getRedisErr, getRedisValue] = await handleErr(getAsync(verifyMessage['jti']))
        if (getRedisErr) return {'statusCode': '30001', 'message': {err: getRedisErr}}
        if (getRedisValue === null) return {'statusCode': '30002', 'message': {err: errCodes['30002']}}
        if (getRedisValue === '0') {
            let [ttlErr, ttlTime] = await handleErr(ttlAsync(baseJti)) // 查询redis中是否有该token
            let [err, message] = await handleErr(setAsync(baseJti, '1', 'EX', ttlTime))
            log.debug(__filename, __line(__filename), message)
            if (err || ttlErr) return {'statusCode': '30001', 'message': {err: getRedisErr}}
        } else {
            let [getOldTokenErr, getOldTokenValue] = await handleErr(getAsync(authorization))
            if (getOldTokenErr) return {'statusCode': '30001', 'message': {err: getOldTokenErr}}
            if (getOldTokenValue === null) return {'statusCode': '30002', 'message': {err: 'old token不存在或已过期'}}
        }
        let userInfo = {
            _id: decoded.payload['userId'],
            type: decoded.payload['userType'] === 'user' ? '1' : '0',
            username: decoded.payload['username'],
            avatar: decoded.payload['avatar_url'],
            github_url: decoded.payload['github_url']
        }
        let [registerTokenErr, registerToken] = await handleErr(signToke(userInfo)) // 生成新的用户token
        let [registerOldErr, registerOldMessage] = await handleErr(setAsync(authorization, '0', 'EX', 30)) // 以旧token为键，存在redis中
        log.debug(__filename, __line(__filename), registerOldMessage)
        if (registerTokenErr || registerOldErr) {
            log.error(__filename, __line(__filename), registerTokenErr)
            log.error(__filename, __line(__filename), registerOldErr)
            return {'statusCode': '30004', 'message': {err: 'redis缓存键失败'}}
        }
        return {'statusCode': '200', 'message': {'token': registerToken, 'userId': decoded.payload['userId'], 'username': decoded.payload['username']}}
    }
}

// 删除token
async function deleteToke (authorization) {
    let decoded = jwt.decode(authorization, {complete: true})
    if (!decoded) return {'code': '0', 'message': 'token解析错误'} // 这里要进行判断，因为jwt.decode这个不会返回错误
    let [verifyErr, verifyMessage] = await handleErr(util.promisify(jwt.verify)(authorization, jwtConfig.jwt_secret))
    if (verifyErr) return {'code': '0', 'message': '获取jwt发生错误'}
    let [delRedisErr, reply] = await handleErr(delAsync(verifyMessage['jti']))
    log.debug(__filename, __line(__filename), reply)
    if (delRedisErr) {
        log.error(__filename, __line(__filename), delRedisErr)
        return {'code': '0', 'message': '删除token失败'}
    } else {
        return {'code': '1', 'message': '删除token成功'}
    }
}

module.exports = {
    signToke,
    checkToke,
    deleteToke
}
