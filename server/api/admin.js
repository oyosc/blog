import Koa from 'koa'
import Router from 'koa-router'
import User from '../../models/user'
import {responseClient} from '../util'

const adminRouter = new Router()

adminRouter.use(async function(ctx, next){
    if(ctx.session.userInfo){
        next()
    }else{
        ctx.res.end(responseClient(res, 200, 1, '身份证已经过期，请重新登陆'));
    }
});

adminRouter.use('/tags', import('./tags'));
adminRouter.use('/article', import('./article'));
adminRouter.get('/getUsers', (ctx, next)=>{
    let skip = (ctx.req.query.pageNum-1)<0?0:(ctx.req.query.pageNum-1)*10;
    let responseData = {
        total: 0,
        list: []
    };
    User.count();//promise->async
});


