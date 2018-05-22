
import User from '../models/user'
import {MD5_SUFFIX, responseClient, md5} from '../util'
import {signToke, checkToke} from '../base/token'

async function login(ctx){
    let {username, password} = ctx.request.body;
    if(!username){
        responseClient(ctx.response, 400, 2, '用户名不可为空');
        return;
    }
    if(!password){
        responseClient(ctx.response, 400, 2, '密码不能为空');
        return;
    }
    password = md5(MD5_SUFFIX + password);
    let result = await User.findOneUser({username, password});
    if(result.errCode == '200'){
        let token = await signToke(result.userInfo);
        responseClient(ctx.response, 200, 0, '登陆成功', {token});
    }else{
        responseClient(ctx.response, 400, 1, '用户名密码错误');
    }
}

async function userInfo(ctx){
    if(!ctx.header.authorization){
        return responseClient(ctx.response, 200, 0, '不需要进行token验证', {})
    }
    let tokenResult = await checkToke(ctx.header.authorization);
    if(tokenResult.errCode == '200'){
        responseClient(ctx.response, 200, 0, 'token验证成功', tokenResult.message)
    }else{
        responseClient(ctx.response, 400, 1, 'token已经失效,请重新登录', tokenResult.message)
    }
}

async function manageAllUsers(ctx){
    let pageNum = ctx.request.pageNum;
    let responseData = {
        total: 0,
        list: []
    }
    let count = await User.countUsers({});
    let result = await User.findUsers({}, pageNum);
    responseData.total = count;
    responseData.list = result;
    responseClient(ctx.response, 200, 0, '管理用户查询成功', responseData);
}

module.exports = {
    login,
    userInfo,
    manageAllUsers
}