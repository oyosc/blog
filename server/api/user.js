import Koa from 'koa'
import Router from 'koa-router'
import User from '../../models/user'
import {MD5_SUFFIX, responseClient, md5} from '../util'
import {signToke, checkToke} from '../base/token'

const router = Router();
router.post('/login', async (ctx) => {
    console.log(ctx.request.body);
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
    console.log(password);
    await User.findOne({
        username,
        password
    }).then(async userInfo => {
        console.log(userInfo);
        if(userInfo){
            let data = {};
            data.username = userInfo.username;
            data.userType = userInfo.type?'user':'admin';
            data.userId = userInfo._id;
            data.token = await signToke(userInfo);
            ctx.session.userInfo = data;
            responseClient(ctx.response, 200, 0, '登陆成功', data);
        }else{
            responseClient(ctx.response, 400, 1, '用户名密码错误');
        }
    }).catch(err => {
        responseClient(ctx.response);
    })
});

router.get('/userInfo', async (ctx) => {
    let tokenResult = await checkToke(ctx.header.authorization);
    console.log(tokenResult);
    if(tokenResult.errCode){
        responseClient(ctx.response, 200, 0, '', tokenResult.message)
    }else{
        responseClient(ctx.response, 200, 1, 'token已经失效,请重新登录', tokenResult.message)
    }
});

module.exports = router;