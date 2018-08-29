# token+session功能

***[项目地址：](https://github.com/oyosc/blog)https://github.com/oyosc/blog***

## 主要代码如下:
- token中间件，如果不满足就进行注销，重新登录，代码地址: [blog/server/middlewares/token_middleware.js](https://github.com/oyosc/blog/blob/master/server/middlewares/token_middleware.js)
```
exports.tokenMiddleWare = async function (ctx, next) {
    let path = ctx.request.path
    log.debug(__filename, __line(__filename), 'path: ' + path)
    if (verifyPath(path)) {
        return await next()
    } else {
        if (!ctx.header.authorization) {
            return responseClient(ctx.response, 200, 3, '没有token信息，请进行登录')
        } else if (ctx.header.authorization && ctx.session.userId) {
            let userId = ctx.session.userId
            if (userId) {
                let userResult = await findOneUser({'id': userId})
                if (userResult.statusCode === '200') {
                    let tokenResult = await checkToke(ctx.header.authorization)
                    log.debug(__filename, __line(__filename), tokenResult)
                    if (tokenResult.statusCode === '200') {
                        ctx.session.username = tokenResult.message.username
                        ctx.session.userId = tokenResult.message.userId
                        await next()
                        if (tokenResult.message.token) {
                            log.debug(__filename, __line(__filename), tokenResult.message.token)
                            ctx.response.set({'Authorization': tokenResult.message.token})
                        }
                    } else {
                        await logout(ctx)
                        responseClient(ctx.response, 200, 3, tokenResult.message.err)
                    }
                } else {
                    await logout(ctx)
                    responseClient(ctx.response, 200, 3, '获取用户信息失败')
                }
            } else {
                await logout(ctx)
                responseClient(ctx.response, 200, 3, '未查询到用户信息')
            }
        } else {
            responseClient(ctx.response, 200, 3, '请重新登录')
        }
    }
}
```

- 前后端接口不一致跨域问题解决，代码地址: [blog/server/server.js](https://github.com/oyosc/blog/blob/master/server/server.js),这里需要主要的是必须添加exposeHeaders字段，否则前端无法获取Authorization这个字段，可以参考cors中的Access-Control-Expose-Headers
```
app.use(cors({origin: corsConfig.origin, credentials: true, exposeHeaders: ['Authorization']}))
```