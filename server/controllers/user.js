
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
    let result = await User.findUser({username, password});
    if(result.errCode == '200'){
        let data = {};
        data.username = result.userInfo.username;
        data.userType = result.userInfo.type?'user':'admin';
        data.userId = result.userInfo._id;
        data.token = await signToke(result.userInfo);
        ctx.session.userInfo = data;
        responseClient(ctx.response, 200, 0, '登陆成功', data);
    }else{
        responseClient(ctx.response, 400, 1, '用户名密码错误');
    }
}

async function userInfo(ctx){
    let tokenResult = await checkToke(ctx.header.authorization);
    console.log(tokenResult);
    if(tokenResult.errCode == '200'){
        responseClient(ctx.response, 200, 0, 'token验证成功', tokenResult.message)
    }else{
        responseClient(ctx.response, 400, 1, 'token已经失效,请重新登录', tokenResult.message)
    }
}

module.exports = {
    login,
    userInfo
}