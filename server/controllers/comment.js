import Comment from '../models/comment'
import {responseClient, fetchUsers, linkUser} from '../base/util'
const objectId = require('mongodb').ObjectID
import log from "../log/log"

async function addComment(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    log.debug(__filename, __line, "userid: ", userId)
    let names = fetchUsers(body.content)
    let text = await linkUser(body.content, names)
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
    let result = await Comment.addLikeHot(body, userId)
    log.debug(__filename, __line, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'likeHot添加成功', result.data)
    }else{
        responseClient(ctx.response, 200, 1, 'likeHot添加失败')
    }
}

async function deleteLikeHot(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
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
    let result = await Comment.showCommentsByAdmin(userId, pageNum)
    log.debug(__filename, __line, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'admin评论查询成功', result.commentInfos)
    }else{
        responseClient(ctx.response, 200, 1, 'admin评论查询失败')
    }
}

async function auditCommentByAdmin(ctx){
    let body = ctx.request.body
    let userId = ctx.session.userId
    let result = await Comment.auditCommentByAdmin(userId, body)
    log.debug(__filename, __line, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'admin评论审核成功')
    }else{
        responseClient(ctx.response, 200, 1, 'admin评论审核失败')
    }
}

//开启审核或者不审核评论
async function configAuditByAdmin(ctx){
    let body = ctx.request.body
    let result = await Comment.configAuditByAdmin(body)
    log.debug(__filename, __line, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, 'admin修改审核成功')
    }else{
        responseClient(ctx.response, 200, 1, 'admin修改审核失败')
    }
}

//获取评论审核配置
async function getConfigAuditByAdmin(ctx){
    if(global.audit_status){
        responseClient(ctx.response, 200, 0, '获取评论审核配置成功,有该配置', {audit_status: global.audit_status})
    }else{
        responseClient(ctx.response, 200, 0, '获取评论审核配置失败,无该配置')
    }
}

module.exports = {
    addComment,
    showComments,
    addLikeHot,
    deleteLikeHot,
    showCommentsByAdmin,
    auditCommentByAdmin,
    configAuditByAdmin,
    getConfigAuditByAdmin
}