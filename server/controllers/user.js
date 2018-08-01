
import User from '../models/user'
import {MD5_SUFFIX, responseClient, md5, asyncRequest} from '../util'
import {github_oauth} from '../config'
import {signToke} from '../base/token'
import request from 'request'
const jwt = require('jsonwebtoken')

async function login(ctx){
    let {username, password} = ctx.request.body;
    if(!username){
        responseClient(ctx.response, 200, 2, '用户名不可为空');
        return;
    }
    if(!password){
        responseClient(ctx.response, 200, 2, '密码不能为空');
        return;
    }
    password = md5(MD5_SUFFIX + password);
    let result = await User.findOneUser({username, password});
    if(result.statusCode == '200'){
        let token = await signToke(result.userInfo);
        responseClient(ctx.response, 200, 0, '登陆成功', {token});
    }else{
        responseClient(ctx.response, 200, 1, '用户名密码错误');
    }
}

async function login_with_github(ctx){
    console.log("node login with github")
    console.log(ctx.request.body)
    let {code} = ctx.request.body

    let data = {
        "code": code,
        "client_id": github_oauth.client_id,
        "client_secret": github_oauth.client_secret
    }

    
    let options = {
        url: github_oauth.token_path,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    
    let result = await asyncRequest(options)
    if(result.code == 1){
        let access_token = result.data.body.split('&')[0]
        let getOptions = {
            url: github_oauth.user_path + access_token,
            method: 'GET',
            headers: {
                'User-Agent': 'oyosc'
            }
        }
        console.log(getOptions)
        let user_result = await asyncRequest(getOptions)
        console.log(user_result)
        if(user_result.code == 1){
            let user_info = JSON.parse(user_result.data.body)
            let githubName = user_info.login
            let is_exist_result = await User.findOneUser({github_name: githubName})
            console.log("is_exist_result")
            console.log(is_exist_result)
            if(is_exist_result.statusCode == '200'){
                let token = await signToke(is_exist_result.userInfo);
                responseClient(ctx.response, 200, 0, 'github用户已经存在正确信息', {token});
            }else{
                let register_user_info = {
                    username: Math.random().toString(36).substr(2),
                    type: 1, 
                    github_url: user_info.html_url,
                    github_name: githubName,
                    avatar: user_info.avatar_url
                }
                let register_result = await User.registerUser(register_user_info)
                console.log('register_result')
                console.log(register_result)
                if(register_result.statusCode == '200'){
                    let token = await signToke(register_result.data);
                    responseClient(ctx.response, 200, 0, 'github用户注册成功', {token});
                }else{
                    responseClient(ctx.response, 200, 1, 'github用户注册失败');
                }
            }
        }else{
            responseClient(ctx.response, 200, 1, 'github第三方登录请求access_token失败');
        }
    }else{
        responseClient(ctx.response, 200, 1, result.err);
    }
}

async function userInfo(ctx){
    let decoded =jwt.decode(ctx.header.authorization, {complete: true});
    if(!decoded) return responseClient(ctx.response, 200, 1, 'token验证失败'); //这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await User.findOneUser({id: decoded.payload['userId']});
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '用户信息正确');
    }else{
        responseClient(ctx.response, 200, 1, '用户名密码错误');
    }
}

async function manageAllUsers(ctx){
    console.log(ctx.request.pageNum);
    let pageNum = ctx.request.pageNum;
    let responseData = {
        total: 0,
        list: []
    }
    let count = await User.countUsers({});
    let result = await User.findUsers({}, pageNum);
    responseData.total = count;
    responseData.list = result;
    console.log(responseData);
    responseClient(ctx.response, 200, 0, '管理用户查询成功', responseData);
}

module.exports = {
    login,
    userInfo,
    manageAllUsers,
    login_with_github
}