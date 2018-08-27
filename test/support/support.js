import {registerUser, deleteUser} from '../../server/models/user'
import request from 'supertest'
import {MD5_SUFFIX, md5} from '../../server/base/util'

function randomInt () {
    return (Math.random() * 10000).toFixed(0)
}

exports.registerUserTest = async (type) => {
    let key = new Date().getTime() + '_' + randomInt()
    let result = await registerUser({
        'username': 'oyosc' + key,
        'password': md5(MD5_SUFFIX + 'oyosc' + key),
        'type': type
    })
    if (result.statusCode === '200') {
        result.data.password = 'oyosc' + key
        return result.data
    }
}

exports.getLoginResult = async (user, server) => {
    let response = await request(server)
        .post('/api/user/login')
        .send({
            username: user.username,
            password: user.password
        })
    let authorization, cookie
    if (response.text.indexOf('{\"code\":0') > -1) {
        authorization = response.headers.authorization
        let reg = new RegExp('koa_react_cookie([\\S]*)=([\\S]+)[^; ]', 'g')
        let cookieResult = response.headers['set-cookie'][0].match(reg)
        cookie = cookieResult[0] + ';' + cookieResult[1]
        return {authorization, cookie}
    }
}

exports.delUserTest = async (userVerify, userInfo, server) => {
    await request(server)
        .post('/api/user/logout')
        .set('authorization', userVerify.authorization)
        .set('cookie', userVerify.cookie)
    await deleteUser(userInfo)
}

exports.ready = async function (status, server) {
    console.log('status: ', status)
    if (status) {
        exports.normalUser = await exports.registerUserTest('1')
        exports.admin = await exports.registerUserTest('0')
        exports.normalUserVerify = await exports.getLoginResult(exports.normalUser, server)
        exports.adminVerify = await exports.getLoginResult(exports.admin, server)
    } else {
        await exports.delUserTest(exports.normalUserVerify, exports.normalUser, server)
        await exports.delUserTest(exports.adminVerify, exports.admin, server)
    }
}
