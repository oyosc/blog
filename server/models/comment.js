import Comment from '../../models/comment'
import log from "../log/log"
const objectId = require('mongodb').ObjectID

//添加评论
async function addComment(commentInfo, userId){
    const {
        content,
        replyToId
    } = commentInfo
    if(replyToId == ''){
        replyToId = userId
    }
    const createdTime = Date.now()
    const likeHot = '0'
    const newComment = new Comment({
        content,
        replyToId,
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
    let skip = pageNum - 1 < 0 ? 0 : (pageNum-1)*5
    let result = await Comment.count(searchCondition).then(async (count) => {
        commentInfos.total = count
        let commentResult = await Comment.find(searchCondition, '_id content createdTime likeHot replyToUser userName',{
            skip: skip,
            limit: 5
        }).then(async (result) => {
            console.log(result)
            return result
        })
    })

    return {code:1, data: result}

}