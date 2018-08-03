import Comment from '../../models/comment'
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
    if(replyToId == ''){
        finalReplyToId = userId
    }
    const createdTime = Date.now()
    const likeHot = '0'
    const newComment = new Comment({
        content,
        finalReplyToId,
        userId,
        createdTime,
        likeHot,
        articleId
    })
    let result = await newComment.save().then(data => {
        return {'statusCode': '200', 'message': '评论保存成功', data}
    }).catch(err => {
        return {'statusCode': '20008', 'message': '评论保存失败'}
    })
    return result
}

async function showComments(articleId, pageNum){
    let searchCondition = {
        articleId
    }
    let commentInfos = {
        total: 0,
        list: []
    }
    console.log("show comments", searchCondition)
    let skip = pageNum - 1 < 0 ? 0 : (pageNum-1)*5
    let result = await Comment.count(searchCondition).then(async (count) => {
        commentInfos.total = count
        let commentResult = await Comment.find(searchCondition, '_id content createdTime likeHot replyToUser userName articleId',{
            skip: skip,
            limit: 5
        }).then(async (result) => {
            if(result.code == 1){
                commentInfos.list = result.data
                return {'statusCode': '200', 'message': '成功查询到comment信息', commentInfos}
            }else{
                return {'statusCode': '20002', 'message': result.data}
            }
        }).catch(err=>{
            return {'statusCode': '20002', 'message': JSON.stringify(err)}
        })
    })

    return result

}

module.exports = {
    addComment,
    showComments
}