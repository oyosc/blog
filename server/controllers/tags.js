import Tags from '../models/tags'
import {responseClient} from '../util'

async function addTag(ctx){
    let {name} = ctx.request.body;
    let result = await Tags.addTag({name});
    console.log(JSON.stringify(result));
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '标签添加成功');
    }else{
        responseClient(ctx.response, 200, 1, '标签添加失败');
    }
}

async function delTag(ctx){
    let {name} = ctx.query;
    let result = await Tags.delTag({name});
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '标签删除成功');
    }else{
        responseClient(ctx.response, 200, 1, '标签删除失败');
    }
}

async function getAllTags(ctx){
    let result = await Tags.getAllTags();
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '标签查询成功', result.tagsInfo);
    }else{
        responseClient(ctx.response, 200, 1, '标签查询失败');
    }
}

module.exports = {
    addTag,
    delTag,
    getAllTags
}