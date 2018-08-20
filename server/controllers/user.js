
import User from '../models/user'
import {MD5_SUFFIX, responseClient, md5, asyncRequest} from '../base/util'
import {githubOauth} from '../base/config'
import {signToke, deleteToke} from '../base/token'
import log from '../log/log'

const jwt = require('jsonwebtoken')

async function login (ctx) {
    let {username, password} = ctx.request.body
    if (!username) {
        responseClient(ctx.response, 200, 2, '用户名不可为空')
    }
    if (!password) {
        responseClient(ctx.response, 200, 2, '密码不能为空')
    }
    password = md5(MD5_SUFFIX + password)
    let result = await User.findOneUser({username, password})
    if (result.statusCode === '200') {
        let token = await signToke(result.userInfo)
        ctx.session.username = result.userInfo.username
        ctx.session.userId = result.userInfo._id
        log.debug(__filename, __line(__filename), 'ctx_login')
        log.debug(__filename, __line(__filename), ctx.session.username)
        log.debug(__filename, __line(__filename), ctx.session.userId)
        responseClient(ctx.response, 200, 0, '登陆成功', {token})
    } else {
        responseClient(ctx.response, 200, 1, '用户名密码错误')
    }
}

async function loginWithGithub (ctx) {
    let {code} = ctx.request.body
    let data = {
        'code': code,
        'client_id': githubOauth.client_id,
        'client_secret': githubOauth.client_secret
    }
    let options = {
        url: githubOauth.token_path,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    let result = await asyncRequest(options)
    if (result.code === 1) {
        let accessToken = result.data.body.split('&')[0]
        let getOptions = {
            url: githubOauth.user_path + accessToken,
            method: 'GET',
            headers: {
                'User-Agent': 'oyosc'
            }
        }
        let userResult = await asyncRequest(getOptions)
        log.debug(__filename, __line(__filename), userResult)
        if (userResult.code === 1) {
            let userInfo = JSON.parse(userResult.data.body)
            let githubName = userInfo.login
            let isExistResult = await User.findOneUser({github_name: githubName})
            if (isExistResult.statusCode === '200') {
                ctx.session.username = isExistResult.userInfo.username
                ctx.session.userId = isExistResult.userInfo._id
                isExistResult.userInfo.username = isExistResult.userInfo.github_name
                let token = await signToke(isExistResult.userInfo)
                responseClient(ctx.response, 200, 0, 'github用户已经存在正确信息', {token})
            } else {
                let registerUserInfo = {
                    username: Math.random().toString(36).substr(2),
                    type: '1',
                    github_url: userInfo.html_url,
                    github_name: githubName,
                    avatar: userInfo.avatar_url
                }
                let registerResult = await User.registerUser(registerUserInfo)
                if (registerResult.statusCode === '200') {
                    ctx.session.username = registerResult.data.username
                    ctx.session.userId = registerResult.data._id
                    registerResult.data.username = registerResult.data.github_name
                    let token = await signToke(registerResult.data)
                    responseClient(ctx.response, 200, 0, 'github用户注册成功', {token})
                } else {
                    responseClient(ctx.response, 200, 1, 'github用户注册失败')
                }
            }
        } else {
            responseClient(ctx.response, 200, 1, 'github第三方登录请求access_token失败')
        }
    } else {
        responseClient(ctx.response, 200, 1, result.err)
    }
}

async function userInfo (ctx) {
    let decoded = jwt.decode(ctx.header.authorization, {complete: true})
    if (!decoded) return responseClient(ctx.response, 200, 1, 'token验证失败') // 这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await User.findOneUser({id: decoded.payload['userId']})
    if (result.statusCode === '200') {
        responseClient(ctx.response, 200, 0, '用户信息正确')
    } else {
        responseClient(ctx.response, 200, 1, '用户名密码错误')
    }
}

async function manageAllUsers (ctx) {
    console.log(ctx.request.pageNum)
    let pageNum = ctx.request.pageNum
    let responseData = {
        total: 0,
        list: []
    }
    let count = await User.countUsers({})
    let result = await User.findUsers({}, pageNum)
    responseData.total = count
    responseData.list = result
    console.log(responseData)
    responseClient(ctx.response, 200, 0, '管理用户查询成功', responseData)
}

// 注销
async function logout (ctx) {
    console.log(ctx.header.authorization)
    console.log('logout_path: ', ctx.request.path)
    let decoded = jwt.decode(ctx.header.authorization, {complete: true})
    if (!decoded) return responseClient(ctx.response, 200, 1, 'token验证失败') // 这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await User.findOneUser({id: decoded.payload['userId']})
    if (result.statusCode === '200') {
        let result = await deleteToke(ctx.header.authorization)
        if (result.code === '1') {
            ctx.session.username = ''
            ctx.session.userId = ''
            responseClient(ctx.response, 200, 0, '注销成功')
        } else {
            responseClient(ctx.response, 200, 1, '注销失败')
        }
    } else {
        responseClient(ctx.response, 200, 1, '用户信息错误')
    }
}

module.exports = {
    login,
    userInfo,
    manageAllUsers,
    loginWithGithub,
    logout
}
