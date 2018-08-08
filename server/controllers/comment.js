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
    let userId = ctx.session.userId
    console.log("userId:", userId)
    let result = await Comment.showComments(articleId, pageNum, userId)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '评论查询成功', result.commentInfos)
    }else{
        responseClient(ctx.response, 200, 1, '评论查询失败')
    }
}

async function addLikeHot(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    console.log("userid: ", userId)
    console.log("addLikeHot", body)
    let result = await Comment.addLikeHot(body, userId)
    console.log(result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'likeHot添加成功', result.data)
    }else{
        responseClient(ctx.response, 200, 1, 'likeHot添加失败')
    }
}

async function deleteLikeHot(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    console.log("userid: ", userId)
    console.log("addLikeHot", body)
    let result = await Comment.deleteLikeHot(body, userId)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'likeHot删除成功', result.data)
    }else{
        responseClient(ctx.response, 200, 1, 'likeHot删除失败')
    }
}

async function showCommentsByAdmin(ctx){
    let pageNum = ctx.request.query.pageNum || 0
    let userId = ctx.session.userId
    console.log("userId:", userId)
    let result = await Comment.showCommentsByAdmin(userId, pageNum)
    console.log(result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'admin评论查询成功', result.commentInfos)
    }else{
        responseClient(ctx.response, 200, 1, 'admin评论查询失败')
    }
}

async function auditCommentByAdmin(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    console.log("userId:", userId)
    console.log("audit_comment:", body)
    let result = await Comment.auditCommentByAdmin(userId, body)
    console.log(result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'admin评论审核成功')
    }else{
        responseClient(ctx.response, 200, 1, 'admin评论审核失败')
    }
}

module.exports = {
    addComment,
    showComments,
    addLikeHot,
    deleteLikeHot,
    showCommentsByAdmin,
    auditCommentByAdmin
}