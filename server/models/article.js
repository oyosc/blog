import Article from '../database/mongodb/models/article'
import Comment from '../database/mongodb/models/comment'
import log from '../log/log'
import {findOneUser} from './user'
const objectId = require('mongodb').ObjectID

// 获取文章列表
async function getArticles (tag, isPublish, pageNum) {
    console.log(isPublish)
    console.log(typeof isPublish)
    let searchCondition = {
        isPublish: isPublish === 'true'
    }
    let commentType

    if (tag) {
        searchCondition.tags = tag
    }

    if (!global.audit_status || (global.audit_status && global.audit_status === '1')) {
        commentType = '1'
    } else {
        commentType = '0'
    }

    if (isPublish === 'false') {
        searchCondition = {}
    }

    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * 5
    let articlesInfo = {
        total: 0,
        list: []
    }
    let result = await Article.count(searchCondition).then(async count => {
        articlesInfo.total = count
        articlesInfo.pageNum = pageNum
        let aggreResult = await Article.aggregate([
            {$match: searchCondition},
            {$sort: {'createdTime': 1}},
	    {$skip: skip},
            {$limit: 5},
            {$lookup: {
                from: 'comment',
                let: {article_id: '$_id'},
                pipeline: [
                    {$match: {
                        $expr: {
                            $and: [
                                {$eq: ['$articleId', '$$article_id']},
                                {$eq: ['$type', commentType]}
                            ]
                        }
                    }},
                    {$group: {_id: null, count: {$sum: 1}}}
                ],
                as: 'comment'
            }}
        ]).then(result => {
            for (let i = 0; i < result.length; i++) {
                result[i].commentCount = result[i].comment.length > 0 ? result[i].comment[0].count : 0
            }
            log.debug(__filename, __line(__filename), result)
            return {'code': 1, 'data': result}
        }).catch(err => {
            log.error(__filename, __line(__filename), err)
            return {'code': 0, 'data': JSON.stringify(err)}
        })
        if (aggreResult.code === 1) {
            articlesInfo.list = aggreResult.data
            return {'statusCode': '200', 'message': '成功查询到article信息', articlesInfo}
        } else {
            return {'statusCode': '20002', 'message': aggreResult.data}
        }
    }).catch(err => {
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20002', 'message': JSON.stringify(err)}
    })
    return result
}

// 获取文章详情
async function getArticleDetail (userId, articleId) {
    let searchCondition
    if (userId) {
        let userResult = await findOneUser({'id': userId})
        if (userResult.statusCode === '200') {
            if (userResult.userInfo.type === '0') {
                searchCondition = {'_id': articleId}
            } else {
                searchCondition = {'_id': articleId, 'isPublish': true}
            }
        } else {
            return {'statusCode': '20017', 'message': '获取用户信息失败'}
        }
    } else {
        searchCondition = {'_id': articleId, 'isPublish': true}
    }

    let commentSearchCondition

    if (!global.audit_status || (global.audit_status && global.audit_status === '1')) {
        commentSearchCondition = {
            articleId,
            type: '1'
        }
    } else {
        commentSearchCondition = {
            articleId
        }
    }

    let result = await Article.findOne(searchCondition).then(async (data) => {
        data.viewCount = data.viewCount + 1
        let commentCountResult = await Comment.count(commentSearchCondition).then((count) => {
            return {'code': 1, 'data': count}
        }).catch(err => {
            return {'code': 0, 'data': JSON.stringify(err)}
        })
        log.debug(__filename, __line(__filename), commentCountResult)
        if (commentCountResult.code === 1) {
            data.commentCount = commentCountResult.data
        } else {
            return {'statusCode': '20022', 'message': '获取文章评论数量失败', data: commentCountResult.data}
        }

        let updateResult = await Article.update(searchCondition, {viewCount: data.viewCount})
            .then((result) => {
                return {'code': 1, 'data': '更新成功'}
            }).catch(err => {
                log.error(__filename, __line(__filename), err)
                return {'code': 0, 'data': JSON.stringify(err)}
            })

        if (updateResult.code === 1) {
            return {'statusCode': '200', 'message': '成功查询到article信息', data}
        } else {
            return {'statusCode': '20002', 'message': '获取文章信息失败', data: updateResult.data}
        }
    }).catch(err => {
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20002', 'message': JSON.stringify(err)}
    })
    return result
}

async function addArticle (articleInfo, userName) {
    const {
        title,
        content,
        time,
        tags,
        isPublish
    } = articleInfo
    const author = userName
    const coverImg = `/${Math.round(Math.round() * 9 + 1)}.jpg`
    const viewCount = 0
    const commentCount = 0
    let tempArticle = new Article({
        title,
        content,
        isPublish,
        viewCount,
        commentCount,
        time,
        author,
        coverImg,
        tags: tags.split(',')
    })
    let result = await tempArticle.save().then(data => {
        return {'statusCode': '200', 'message': '文章保存成功', data}
    }).catch(err => {
        log.error(__filename, __line(__filename), err)
        return {'statusCode': '20008', 'message': '文章保存失败'}
    })
    return result
}

async function updateArticle (articleInfo) {
    const {
        title,
        content,
        time,
        tags,
        isPublish,
        id
    } = articleInfo
    let _id = objectId(id)
    let result = await Article.update({'_id': _id}, {title, content, time, tags: tags.split(','), isPublish})
        .then(data => {
            return {'statusCode': '200', 'message': '文章保存成功'}
        }).catch(err => {
            log.error(__filename, __line(__filename), err)
            return {'statusCode': '20008', 'message': '文章保存失败'}
        })
    return result
}

async function delArticle (id) {
    let result = await Comment.deleteMany({'articleId': id}).then(async (commentData) => {
        if (commentData.acknowledged === false) {
            return {'statusCode': '200', 'message': '文章评论删除失败'}
        }
        let Articleresult = await Article.deleteOne({'_id': id})
            .then(data => {
                if (data.n === 1) {
                    return {'statusCode': '200', 'message': '文章删除成功'}
                } else {
                    return {'statusCode': '201', 'message': '文章不存在'}
                }
            }).catch(err => {
                log.error(__filename, __line(__filename), err)
                return {'statusCode': '20006', 'message': '文章删除失败'}
            })
        return Articleresult
    })
    return result
}

module.exports = {
    getArticles,
    updateArticle,
    delArticle,
    addArticle,
    getArticleDetail
}
