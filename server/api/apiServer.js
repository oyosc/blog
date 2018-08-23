import Koa from 'koa'
import mongoose from 'mongoose'
import session from 'koa-session'
import {redisConfig, mongoConfig, apiProxy, githubOauth} from '../base/config'
import {redisInit} from '../database/redis/redis'
import router from '../router/main'
import log from '../log/log'
import passport from 'koa-passport'
import githubStrategyMiddleware from '../middlewares/github_strategy'
import {adminMiddleWare} from '../middlewares/admin_middleware'
import {tokenMiddleWare} from '../middlewares/token_middleware'
let GitHubStrategy = require('passport-github').Strategy

// const koaBody = require('koa-body')

const app = new Koa()
const mongodb_url = 'mongodb://' + mongoConfig.ip + ':' + mongoConfig.port + '/' + mongoConfig.db
const redis_client = redisInit(redisConfig.port, redisConfig.url)

console.log('api_server@@@@@@@@@@@@')
// app.use(bodyParser());
app.keys = ['koa_react_cookie']
let store = {
    storage: {},
    createDate: {},
    async get (key, maxAge) {
        if (this.storage[key] && ((this.createDate[key].getTime() - new Date().getTime()) > (maxAge * 1000))) {
            return this.storage[key]
        }
    },
    async set (key, sess, maxAge) {
        this.storage[key] = sess
        this.createDate[key] = new Date(Date.now() + maxAge * 1000)
    },
    async destroy (key) {
        delete this.storage[key]
        delete this.createDate[key]
    }
}

// 还可以使用arguments.callee，不过在es5里不再支持，已经被废弃
// Object.defineProperty(global, '__stack', {
//     get: function errName(){
//       var orig = Error.prepareStackTrace;
//       Error.prepareStackTrace = function(_, stack){ return stack; };
//       var err = new Error;
//       Error.captureStackTrace(err, arguments.callee);
//       var stack = err.stack;
//       Error.prepareStackTrace = orig;
//       return stack;
//     }
//   });
// Object.defineProperty(global, '__line', {
//     get: function(){
//         return __stack[1].getLineNumber();
//     }
// })

if (process.env.DEBUG === 'true') {
    global.__line = function (filePath) {
        let stack = new Error().stack
        let regexp = new RegExp(filePath + ':([0-9]+):([0-9]+)')
        let result = stack.match(regexp)
        return result
    }
} else {
    global.__line = function (filePath) {
        return false
    }
}

const CONFIG = {
    key: 'koa_react_cookie',
    maxAge: 86400000,
    store: store
}

// oauth中间件
app.use(passport.initialize())

// github oauth
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GitHubStrategy(githubOauth, githubStrategyMiddleware))

app.use(session(CONFIG, app))

// 非admin用户禁止访问接口
app.use(adminMiddleWare)

app.use(tokenMiddleWare)

// app.use(async ctx => {
//     console.log(ctx.req);
//     ctx.body = 'hello world';
// });

// app.use('/', require('./main'));

// app.use('/admin', require('./admin'))

app.use(router.routes())

if (redis_client) {
    console.log('redis 启动成功，端口号：' + redisConfig.port)
    redis_client.on('error', (error) => {
        log.error(__filename, __line(__filename), error)
    })
}

mongoose.Promise = require('bluebird')
mongoose.connect(mongodb_url, function (err) {
    if (err) {
        log.error(__filename, __line(__filename), err)
        return
    }
    console.log('数据库连接成功')
})

export default app.listen(apiProxy.port, function (err) {
    if (err) {
        log.error(__filename, __line(__filename), err)
    } else {
        log.info(__filename, __line(__filename), '===> api server is running at ' + apiProxy.port)
    }
})
