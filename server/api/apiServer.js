import Koa from 'koa'
import config from '../../config/config'
import bodyParser from 'koa-bodyparser'
import mongoose from 'mongoose'
import session from 'koa-session'
import Router from 'koa-router'
import userRouter from './user'
import adminRouter from './admin'
import {redisConfig} from '../config'
import {redis_init} from '../database/redis/redis'

const koaBody = require('koa-body')

const router = new Router();

const port = '8080';
const app = new Koa();
const redis_client = redis_init(redisConfig.port, redisConfig.url);

console.log("api_server@@@@@@@@@@@@")
// app.use(bodyParser());
app.keys = ['koa_react_cookie'];
let store = {
    storage: {},
    createDate: {},
    async get (key, maxAge){
        if(this.storage[key] && ((this.createDate[key].getTime() - new Date().getTime()) > (maxAge*1000))){
            return this.storage[key]
        }
    },
    async set (key, sess, maxAge){
        this.storage[key] = sess;
        this.createDate[key] = new Date(Date.now() + maxAge*1000);
    },
    destroy (key){
        delete this.storage[key]
        delete this.createDate[key]
    }
}

const CONFIG = {
    key: 'koa_react_cookie',
    maxAge: 86400000,
    store: store
};

app.use(session(CONFIG, app));

// app.use(async ctx => {
//     console.log(ctx.req);
//     ctx.body = 'hello world';
// });

// app.use('/', require('./main'));

// app.use('/admin', require('./admin'))


router.use('/user', koaBody(), userRouter.routes())

router.use('/admin', koaBody(), adminRouter.routes())

app.use(router.routes())

if(redis_client){
    console.log("redis 启动成功，端口号：" + redisConfig.port);
    redis_client.on('error', (error) => {
        console.log(error);
    })
}

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:27017/blog', function(err){
    if(err){
        console.log(err, '数据库连接失败');
        return;
    }
    console.log('数据库连接成功');
    app.listen('8080', function(err){
        if(err){
            console.error('err:', err);
        }else{
            console.info('===> api server is running at 8080')
        }
    });
});