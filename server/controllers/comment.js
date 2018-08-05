import Comment from '../models/comment'
import {responseClient, fetchUsers, linkUser} from '../util'
const objectId = require('mongodb').ObjectID

async function addComment(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    console.log("userid: ", userId)
    let names = fetchUsers(body.content)
    let text = await linkUser(body.content, names)
    console.log("addComment", body)
    body.content = text
    let result = await Comment.addComment(body, userId)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '评论添加成功', result.data)
    }else{
        responseClient(ctx.response, 200, 1, '评论添加失败')
    }
}

async function showComments(ctx){
    let pageNum = ctx.request.query.pageNum || 0
    let articleId = ctx.request.query.articleId
    let result = await Comment.showComments(articleId, pageNum)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '评论查询成功')
    }else{
        responseClient(ctx.response, 200, 1, '评论查询失败')
    }
}

module.exports = {
    addComment,
    showComments
}