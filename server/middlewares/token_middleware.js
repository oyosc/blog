import {logout} from '../controllers/user'
import {findOneUser} from '../models/user'
import {checkToke} from '../base/token'
import {responseClient, verifyPath} from '../base/util'
import log from '../log/log'

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
