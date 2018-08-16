// import http from 'http'
import Koa from 'koa'
import httpProxy from 'http-proxy'
import {api_proxy, node_config} from './base/config'
import Router from 'koa-router'
const fs = require('fs')
const pathLib = require('path');
const app = new Koa()
const serve = require('koa-static')
// const memwatch = require('memwatch-next')

const router = new Router()
const targetUrl = 'http://' + api_proxy.ip + ':' + api_proxy.port
const proxy = httpProxy.createProxyServer();
const ROOT_PATH = pathLib.resolve(__dirname, '..');
const BUILD_PATH = pathLib.resolve(ROOT_PATH, 'build');
const history = require('koa-connect-history-api-fallback')
const util = require('util')
// const heapdump = require('heapdump')

// router.all('/', async (ctx, next) => {
//     console.log("this is the first");
//     await next()
// })

// router.get('*', async (ctx, next) => {
//     let frontFile = await (
//         new Promise(function(resolve, reject){
//             fs.readFile(pathLib.resolve(BUILD_PATH, 'index.html'), (err, data) => {
//                 if(err){
//                     reject(err);
//                 }else{
//                     resolve(data);
//                 }
//             });
//         })
//     )
//     ctx.type = 'html';
//     ctx.body = frontFile
// })

router.all('/api/*', async (ctx, next) => {
    ctx.req.url = ctx.req.url.split("api")[1];
    ctx.respond = false;
    proxy.web(ctx.req, ctx.res, {target: targetUrl});
    await next()
})

app.use(history()); //react是signal page,防止刷新无响应或者404,单纯测试后端接口的时候要注释，防止请求被拦截

app.use(serve(ROOT_PATH + "/build/"))
app.use(serve(ROOT_PATH + "/static/"))

// app.use(ctx => {
//     ctx.respond = false;
//     proxy.web(ctx.req, ctx.res, { target: 'http://localhost:8080' })
//   })

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)

if(process.env.NODE_ENV !== 'production'){
    const webpack = require('webpack');
    const {devMiddleware, hotMiddleware} = require('koa-webpack-middleware');
    const webpackConfig = require('../webpack.dev')

    const compiler = webpack(webpackConfig);
    app.use(devMiddleware(compiler, {
        lazy: false,
        stats: {colors: true},
        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },
        publicPath: "/"

    }));
    app.use(hotMiddleware(compiler));
}

app.use(router.routes());

app.listen(node_config.port, (err) => {
    if(err){
        console.error(err);
    }else{
        console.log("===>open " + node_config.ip + ":" + node_config.port + " in a browser to view the app");
    }
});

// let hd;

// memwatch.on('leak', (info) => {
//     // if(!hd){
//     //     console.log("11111111");
//     //     hd = new memwatch.HeapDiff();
//     // }else{
//     //     console.log("22222222")
//     //     let diff = hd.end();
//     //     console.error(util.inspect(diff, true, null));
//     //     hd = null;
//     // }
//     console.error(info);
//     var file =  '/tmp/myapp-' + process.pid + '-' + Date.now() + '.heapsnapshot';
//     heapdump.writeSnapshot(file, function(err){
//         if(err) console.error(err);
//         else console.error('Wrote snapshot: ' + file);
//     })
// })