import Tags from '../models/tags'
import {MD5_SUFFIX, responseClient, md5} from '../util'
import {signToke, checkToke} from '../base/token'
import errCodes from '../errCodes'
const jwt = require('jsonwebtoken')

async function addTag(ctx){
    let {name} = ctx.request.body;
    console.log("addtag")
    console.log(name)
    let decoded =jwt.decode(ctx.header.authorization, {complete: true});
    if(!decoded) return responseClient(ctx.response, 400, 0, 'token验证失败'); //这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await Tags.addTag({name});
    console.log(JSON.stringify(result));
    if(result.errCode == '200'){
        responseClient(ctx.response, 200, 0, '标签添加成功');
    }else{
        responseClient(ctx.response, 400, 1, '标签添加失败');
    }
}

async function delTag(ctx){
    let {name} = ctx.query;
    let decoded =jwt.decode(ctx.header.authorization, {complete: true});
    if(!decoded) return responseClient(ctx.response, 400, 0, 'token验证失败'); //这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await Tags.delTag({name});
    console.log(result)
    if(result.errCode == '200'){
        responseClient(ctx.response, 200, 0, '标签删除成功');
    }else{
        responseClient(ctx.response, 400, 1, '标签删除失败');
    }
}

async function getAllTags(ctx){
    let decoded =jwt.decode(ctx.header.authorization, {complete: true});
    if(!decoded) return responseClient(ctx.response, 400, 0, 'token验证失败'); //这里要进行判断，因为jwt.decode这个不会返回错误
    let result = await Tags.getAllTags();
    console.log("getalltag")
    console.log(result)
    if(result.errCode == '200'){
        responseClient(ctx.response, 200, 0, '标签查询成功', result.tagsInfo);
    }else{
        responseClient(ctx.response, 400, 1, '标签查询失败');
    }
}

module.exports = {
    addTag,
    delTag,
    getAllTags
}