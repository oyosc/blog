import Comment from '../../models/comment'
import Like from '../../models/like'
import {findOneUser} from './user'
import log from "../log/log"
const objectId = require('mongodb').ObjectID

//添加评论
async function addComment(commentInfo, userId){
    const {
        content,
        replyToId,
        articleId
    } = commentInfo
    let finalReplyToId
    console.log(replyToId)
    const createdTime = Date.now()
    const newComment = new Comment({
        content,
        finalReplyToId,
        userId,
        createdTime,
        likeHot: 0,
        articleId,
        type: '0'
    })
    let result = await newComment.save().then(async data => {
        let userResult = await findOneUser({'id': userId})
        if(userResult.statusCode === '200'){
            if(userResult.userInfo && (typeof userResult.userInfo.github_name === 'undefined')){
                userResult.userInfo.github_name = userResult.userInfo.username
            }
            data = data.toObject()
            data["userInfo"] = userResult.userInfo
        }else{
            return {'statusCode': '20002', 'message': '评论获取用户信息失败'}
        }
        return {'statusCode': '200', 'message': '评论保存成功', data}
    }).catch(err => {
        return {'statusCode': '20008', 'message': '评论保存失败'}
    })
    console.log(result)
    return result
}

async function showComments(articleId, pageNum, userId){
    console.log("show comments userId: ", userId)
    let searchCondition = {
            articleId,
            type: '1'
        }
    
    let commentInfos = {
        total: 0,
        list: []
    }
    console.log("show comments", searchCondition)
    let skip = pageNum - 1 < 0 ? 0 : (pageNum-1)*5
    let result = await Comment.count(searchCondition).then(async (count) => {
        commentInfos.total = count
        let commentResult = await Comment.find(searchCondition, '_id content createdTime likeHot replyToId articleId',{
            skip: skip,
            limit: 5
        }).populate({
            path: 'userId',
            select: 'github_name github_url username type _id avatar',
            model: 'User'
        })
        .then(async (result) => {
            result = JSON.parse(JSON.stringify(result).replace(/userId/g, 'userInfo'))
            for(let i=0; i<result.length; i++){
                if(typeof result[i].replyToId === 'undefined'){
                    result[i].replyToId = result[i]._id
                }
                if(result[i].userInfo && (typeof result[i].userInfo.github_name === 'undefined')){
                    result[i].userInfo.github_name = result[i].userInfo.username
                }
                let isLike
                if(typeof userId === 'undefined'){
                    isLike = 0
                }else{
                    isLike = await Like.findOne({"likeId": result[i]._id, "userId": userId, "type": '1'}).then((likeInfo) => {
                        if(likeInfo){
                            return 1
                        }else{
                            return 0
                        }
                    }).catch((err) => {
                        console.log("isLike: ", err)
                        return 0
                    })
                }
                // result[i] = result[i].toObject()
                result[i]["isLike"] = isLike
            }
            return {'code': 1, 'data': result}
        }).catch(err => {
            console.log(err)
            return {'code': 0, 'data': JSON.stringify(err)}
        })
        if(commentResult.code == 1){
            commentInfos.list = commentResult.data
            return {'statusCode': '200', 'message': '成功查询到comment信息', commentInfos}
        }else{
            return {'statusCode': '20002', 'message': commentResult.data}
        }
    }).catch(err => {
        return {'statusCode': '20002', 'message': JSON.stringify(err)}
    })
    console.log(JSON.stringify(result))
    return result
}

//查询单个评论
async function getOneComment(info){
    if(info.id){
        info._id = objectId(info.id);
        delete info.id;
    }
    let result = await Comment.findOne(
        info,
        '_id content createdTime likeHot replyToId articleId'
    ).populate({
        path: 'userId',
        select: 'github_name github_url username type _id avatar',
        model: 'User'
    }).then((commentInfo) => {
        if(!commentInfo){
            return {'statusCode':'20016','message':'get commentInfo 为空'}
        }
        commentInfo = JSON.parse(JSON.stringify(commentInfo).replace(/userId/g, 'userInfo'))
        console.log("commentInfo:", commentInfo)
        if(typeof commentInfo.replyToId === 'undefined'){
            commentInfo.replyToId = commentInfo._id
        }
        if(commentInfo.userInfo && (typeof commentInfo.userInfo.github_name === 'undefined')){
            commentInfo.userInfo.github_name = commentInfo.userInfo.username
        }
        console.log("final_commentInfo: ", commentInfo)
        if(commentInfo){
            return {'statusCode':'200','message':'已查询到该评论', commentInfo}
        }else{
            return {'statusCode':'20001','message':errCodes['20001']}
        }
    }).catch((err) =>{
        return {'statusCode': '20002', 'message': JSON.stringify(err)};
    })
    return result
}

//添加Likehot
async function addLikeHot(likeInfo, userId){
    const {
        comment_id
    } = likeInfo
    let commentResult = await getOneComment({id: objectId(comment_id)})
    console.log(commentResult)
    if(commentResult.statusCode !== '200'){
        return {'statusCode': '20009', 'message': '添加Likehot的评论无此数据'}
    }
    let likeResult = await Like.findOne({
        likeId: comment_id,
        userId,
        type: 1
    }).then((like)=>{
        console.log("like:", like)
        if(like){
            return {'code': 1,'message':'已查询到该likeHot'}
        }else{
            return {'code': 0,'message':'未查询到该likeHot'}
        }
    }).catch((err) => {
        return {'code': 2, 'message': '查询likehot出现错误'}
    })
    
    if(likeResult.code === 1 || likeResult.code === 2){
        return {'statusCode': '20011', 'message': '查询likeHot出错或者已经存在该数据'}
    }

    const createdTime = Date.now()
    const newLike = new Like({
        likeId: comment_id,
        userId,
        type: 1,
        createdTime
    })
    let result = await newLike.save().then(async () => {
        let updateResult = await Comment.update({"_id": objectId(comment_id)}, {"likeHot": commentResult.commentInfo.likeHot + 1})
            .then((result)=>{
                return {'code': 1, 'data': "comment更新成功"}
            }).catch(err=> {
                return {'code': 0, 'data': JSON.stringify(err)}
            })
        if(updateResult.code === 0){
            return {'statusCode': '20010', 'message': 'commment更新likeHot失败'}
        }
        let finalCommentResult = await getOneComment({"_id": objectId(comment_id)})
        if(finalCommentResult.statusCode === '200'){
            finalCommentResult.commentInfo["isLike"] = 1
            return {'statusCode': '200', 'message': 'likeHot添加成功', data: finalCommentResult.commentInfo}
        }else{
            return {'statusCode': '20008', 'message': 'likeHot添加失败'}
        }
    }).catch(err => {
        return {'statusCode': '20008', 'message': 'likeHot添加失败'}
    })
    return result
}

//删除likeHot
async function deleteLikeHot(likeInfo, userId){
    const {
        comment_id
    } = likeInfo
    let commentResult = await getOneComment({id: objectId(comment_id)})
    if(commentResult.statusCode !== '200'){
        return {'statusCode': '20009', 'message': '删除Likehot的评论无此数据'}
    }
    let result = await Like.remove({
        likeId: objectId(comment_id),
        userId,
        type: 1
    }).then(async (likeData) => {
        if(likeData.n !== 1){
            return {'statusCode': '20012', 'message': 'likeHot删除失败'}
        }
        let updateResult = await Comment.update({"_id": objectId(comment_id)}, {"likeHot": commentResult.commentInfo.likeHot - 1})
            .then((result)=>{
                return {'code': 1, 'data': "comment更新成功"}
            }).catch(err=> {
                return {'code': 0, 'data': JSON.stringify(err)}
            })
        if(updateResult.code === 0){
            return {'statusCode': '20013', 'message': 'commment更新likeHot失败'}
        }
        let finalCommentResult = await getOneComment({id: objectId(comment_id)})
        if(finalCommentResult.statusCode === '200'){
            finalCommentResult.commentInfo["isLike"] = 0
            return {'statusCode': '200', 'message': 'likeHot删除成功', data: finalCommentResult.commentInfo}
        }else{
            return {'statusCode': '200014', 'message': 'likeHots删除失败'}
        }
    }).catch(err => {
        return {'statusCode': '200015', 'message': 'likeHot删除失败'}
    })
    return result
}

//管理员查询所有评论
async function showCommentsByAdmin(userId, pageNum){
    let searchCondition
    if(userId){
        let userResult = await findOneUser({'id': userId})
        if(userResult.statusCode === '200'){
            console.log(userResult)
            if(userResult.userInfo.type === '0'){
                searchCondition = {}
            }else{
                return {'statusCode': '20018', 'message': '非管理员禁止访问'}
            }
        }else{
            return {'statusCode': '20017', 'message': '获取用户信息失败'}
        }
    }else{
        return {'statusCode': '20019', 'message': '未查询到用户信息'}
    }

    let commentInfos = {
        total: 0,
        list: []
    }

    console.log("searchCondition: ",searchCondition)
    let skip = pageNum - 1 < 0 ? 0 : (pageNum-1)*5
    let result = await Comment.count(searchCondition).then(async (count) => {
        console.log(count)
        commentInfos.total = count
        let commentResult = await Comment.find(searchCondition, '_id content createdTime articleId type',{
            skip: skip,
            limit: 5
        }).populate({
            path: 'userId',
            select: 'username',
            model: 'User'
        }).populate({
            path: 'articleId',
            select: 'title _id',
            model: 'Article'
        }).then((result) =>{
            console.log("first_result:", result)
            result = JSON.parse(JSON.stringify(result).replace(/userId/g, 'userInfo'))
            result = JSON.parse(JSON.stringify(result).replace(/articleId/g, 'articleInfo'))
            let finalResult = []
            for(let i=0; i<result.length; i++){
                console.log("result[i]", result[i])
                let finalComment = {}
                finalComment.comment_id = result[i]._id
                finalComment.article_id = result[i].articleInfo._id
                finalComment.article_title = result[i].articleInfo.title
                finalComment.comment_content = result[i].content
                finalComment.comment_time = result[i].createdTime
                finalComment.comment_user = result[i].userInfo.username
                finalComment.whether_audit = result[i].type
                console.log("finalComment:", finalComment)
                finalResult.push(finalComment)
            }
            return {'code': 1, 'data': finalResult}
        }).catch(err => {
            console.log(err)
            return {'code': 0, 'data': JSON.stringify(err)}
        })
        console.log("commentResult: ", commentResult)
        if(commentResult.code == 1){
            commentInfos.list = commentResult.data
            return {'statusCode': '200', 'message': '成功查询到comment信息', commentInfos}
        }else{
            return {'statusCode': '20020', 'message': commentResult.data}
        }
    }).catch((err) => {
        console.log(err)
        return {'statusCode': '20021', 'message': JSON.stringify(err)}
    })

    console.log("adminResult: ", result)
    return result
}

module.exports = {
    addComment,
    showComments,
    addLikeHot,
    deleteLikeHot,
    showCommentsByAdmin
}