import {responseClient} from '../base/util'
import {findOneUser} from '../models/user'

// 非admin用户禁止访问接口
exports.adminMiddleWare = async function (ctx, next) {
    let path = ctx.request.path
    let userId = ctx.session.userId
    if (/\/admin([\s\S])*?/.test(path)) {
        if (userId) {
            let userResult = await findOneUser({'id': userId})
            if (userResult.statusCode === '200') {
                if (userResult.userInfo.type === '0') {
                    return await next()
                } else {
                    responseClient(ctx.response, 200, 3, '非管理员禁止访问')
                }
            } else {
                responseClient(ctx.response, 200, 3, '获取用户信息失败')
            }
        } else {
            responseClient(ctx.response, 200, 3, '未查询到用户信息')
        }
    } else {
        await next()
    }
}
