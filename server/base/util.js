import crypto from 'crypto'
import request from 'request'
import {findUsersByNames} from '../models/user'
import log from '../log/log'
import {prod, dev} from '../../config'
import util from 'util'
import _ from 'lodash'

const requestPromisify = util.promisify(request)

const handleErr = (promise) => {
    return promise.then((data) => {
        return [null, data]
    }).catch(err => [err])
}

const fetchUsers = function (text) {
    if (!text) {
        return []
    }

    let ignoreRegexs = [
        /\<a[\s\S]+@[\s\S]\<\/a\>/g
    ]

    ignoreRegexs.forEach(function (ignore_regex) {
        text = text.replace(ignore_regex, '')
    })

    let results = text.match(/@[a-z0-9\-_]+\b/igm)
    let names = []
    if (results) {
        for (let i = 0, l = results.length; i < l; i++) {
            let s = results[i]
            s = s.slice(1)
            names.push(s)
        }
    }
    names = _.uniq(names)
    return names
}

// 将TEXT中的user替换为数据库里
const linkUser = async function (text, names) {
    let user_result = await findUsersByNames(names)
    if (user_result.statusCode === '200') {
        let users = user_result.data
        for (let i = 0; i < users.length; i++) {
            let name = users[i].github_name !== '' ? users[i].github_name : users[i].username
            text = text.replace(new RegExp('@' + name + '\\b', 'g'), '<a href="' + users[i].github_url + '" target="_blank">@' + name + '</a>')
        }
    }
    return text
}

const asyncRequest = async (options) => {
    let [err, data] = await handleErr(requestPromisify(options))
    if (err) {
        return {code: 0, err}
    } else {
        return {code: 1, data}
    }
}

const getLocalTime = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

function utcToLocal (utcDatetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    // 处理成为时间戳
    console.log('utcDatetime', utcDatetime)
    let timestamp = new Date(utcDatetime)
    timestamp = timestamp.getTime()
    timestamp = timestamp / 1000

    // 时间戳转为时间
    var local_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
    return {local_datetime, timestamp}
}

const verifyPath = function (path) {
    switch (true) {
        case /\/user\/login([\s\S])*?/.test(path):
            return true
        case /\/auth\/github([\s\S])*?/.test(path):
            return true
        case /logout([\s\S])*?/.test(path):
            return true
        case /\/user\/comment\/show([\s\S])*?/.test(path):
            return true
        case /\/admin([\s\S])*?/.test(path):
            return false
        case /\/user([\s\S])*?/.test(path):
            return false
        default:
            return true
    }
}

module.exports = {
    MD5_SUFFIX: process.env.NODE_ENV === 'production' ? prod.md5_suffix : dev.md5_suffix,
    md5: function (pwd) {
        let md5 = crypto.createHash('md5')
        return md5.update(pwd).digest('hex')
    },
    responseClient (res, httpCode = 500, code = 3, message = '服务端异常', result = {}) {
        let responseData = {}
        responseData.code = code
        responseData.message = message
        res.status = httpCode
        log.debug(__filename, __line(__filename), result)
        if (result.token) res.set({'Authorization': result.token})
        if (result !== {}) responseData.result = result
        log.debug(__filename, __line(__filename), responseData)
        res.body = JSON.stringify(responseData)
    },
    handleErr,
    getLocalTime,
    asyncRequest,
    fetchUsers,
    linkUser,
    verifyPath,
    utcToLocal
}
