import Articles from '../models/article'
import {responseClient} from '../base/util'
const objectId = require('mongodb').ObjectID
import log from "../log/log"

//获取文章
async function getArticles(ctx){
    let tag = ctx.request.query.tag || null
    let ispublish = ctx.request.query.isPublish
    let pageNum = ctx.request.query.pageNum
    let result = await Articles.getArticles(tag, ispublish, pageNum)
    log.debug(__filename, 11, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '文章查询成功', result.articlesInfo)
    }else{
        responseClient(ctx.response, 200, 1, '文章查询失败')
    }
}

//更新文章
async function updateArticle(ctx){
    let body = ctx.request.body
    let result = await Articles.updateArticle(body)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '文章更新成功')
    }else{
        responseClient(ctx.response, 200, 1, '文章更新失败')
    }
}

//删除文章
async function delArticle(ctx){
    let id = objectId(ctx.request.query.id)
    let result = await Articles.delArticle(id)
    console.log(result)
    if(result.statusCode == '200'||result.statusCode == '201'){
        responseClient(ctx.response, 200, 0, '文章删除成功')
    }else{
        responseClient(ctx.response, 200, 1, '文章删除失败')
    }
}

//添加文章
async function addArticle(ctx){
    console.log("add article")
    let body = ctx.request.body
    let userName= ctx.session.username
    let result = await Articles.addArticle(body, userName)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '文章添加成功')
    }else{
        responseClient(ctx.response, 200, 1, '文章添加失败')
    }
}

async function getArticleDetail(ctx){
    console.log(ctx.request.query.id)
    let id = objectId(ctx.request.query.id)
    console.log("articledetail")
    console.log(id)
    let userId= ctx.session.userId
    let result = await Articles.getArticleDetail(userId, id)
    console.log(result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '文章详情查询成功', result.data)
    }else{
        responseClient(ctx.response, 200, 1, '文章详情查询失败')
    }
}

module.exports = {
    getArticles,
    updateArticle,
    delArticle,
    addArticle,
    getArticleDetail
}