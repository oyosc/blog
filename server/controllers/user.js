
import User from '../models/user'
import {MD5_SUFFIX, responseClient, md5} from '../util'
import {signToke} from '../base/token'
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

async function userInfo(ctx){
    let decoded =jwt.decode(ctx.header.authorization, {complete: true});
    if(!decoded) return responseClient(ctx.response, 200, 1, 'token验证失败'); //这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await User.findOneUser({id: decoded.payload['userId']});
    if(result.statusCode == '200'){
        let token = await signToke(result.userInfo);
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
    manageAllUsers
}