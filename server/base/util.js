import crypto from 'crypto'
import request from 'request'
import {findUsersByNames} from '../models/user'

import util from 'util'
import _ from 'lodash'
import log from "../log/log"
const requestPromisify = util.promisify(request)

const handleErr = (promise) => {
    return promise.then((data) => {
        return [null, data];
    }).catch(err => [err]);
}

const fetchUsers = function(text){
    if(!text){
        return []
    }

    let ignoreRegexs = [
        /\<a[\s\S]+@[\s\S]\<\/a\>/g
    ]

    ignoreRegexs.forEach(function(ignore_regex){
        text = text.replace(ignore_regex, '')
    })

    let results = text.match(/@[a-z0-9\-_]+\b/igm)
    let names = []
    if(results){
        for(let i = 0, l=results.length; i<l; i++){
            let s = results[i]
            s = s.slice(1);
            names.push(s)
        }
    }
    names = _.uniq(names)
    return names
}

//将TEXT中的user替换为数据库里
const linkUser = async function(text, names){
    let user_result = await findUsersByNames(names)
    if(user_result.statusCode === '200'){
        let users = user_result.data
        for(let i=0; i<users.length; i++){
            let name = users[i].github_name !== '' ? users[i].github_name : users[i].username
            text = text.replace(new RegExp('@' + name + '\\b', 'g'), '<a href="' + users[i].github_url + '" target="_blank">@' + name + '</a>')
        }
    }
    return text
}

const asyncRequest = async (options) => {
    let [err, data] = await handleErr(requestPromisify(options))
    if(err){
        return {code:0, err}
    }else{
        return {code:1, data}
    }
}

const getLocalTime = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() +1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year+"/"+month+"/"+day+" " + hour+":"+minute+":"+second
}

module.exports = {
    MD5_SUFFIX: 'eisdsadawwada这个是加密的信息哦%%%@@!',
    md5: function(pwd){
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res, httpCode=500, code=3, message='服务端异常', result={}){
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        res.status = httpCode;
        if(result.token) res.set({'Authorization': result.token});
        if(result!={})  responseData.result = result;
        log.debug(__filename, __line(__filename), responseData)
        res.body = JSON.stringify(responseData)
        return
    },
    handleErr,
    getLocalTime,
    asyncRequest,
    fetchUsers,
    linkUser
}