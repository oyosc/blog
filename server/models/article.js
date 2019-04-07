import Article from '../database/mongodb/models/article'
import Comment from '../database/mongodb/models/comment'
import tags from './tags'
import {prod} from '../../config'
import log from '../log/log'
import {findOneUser, registerUser} from './user'
import {utcToLocal} from '../base/util'
const rp = require('request-promise')
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

async function syncGithubUnfiledArticle () {
    let apiUrl = 'https://api.github.com/repos/oyosc/blog'
    let issueApiUrl = apiUrl + '/issues?access_token=' + '15f6e907b82037e652dde980739cf3493fe6dd9f&state=' + 'all'
    let testUrl = 'https://api.github.com/repos/996icu/996.ICU'
    let options = {
        method: 'GET',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36' }
    }
    options['uri'] = apiUrl
    rp(options)
        .then(async (respBody) => {
            respBody = JSON.parse(respBody)
            console.log('respBody: ', respBody)
            let openIssuesCount = respBody.open_issues_count
            let size = prod.issueSize ? prod.issueSize : 30
            let page = Math.ceil(openIssuesCount / size)
            console.log('page: ', page)
            let issuesFiledUrl = []
            let issuesUnFiledUrl = []
            while (page !== 0) {
                let issueUnFiledUrl = issueApiUrl + '&page=' + page + '&size=' + size + '&labels=' + 'bug'
                let issueFiledUrl = issueApiUrl + '&page=' + page + '&size=' + size + '&labels=' + '已归档'
                issuesUnFiledUrl.push(issueUnFiledUrl)
                issuesFiledUrl.push(issueFiledUrl)
                page--
            }

            function getIssuesUnFiledResult (issuesUnFiledUrl) {
                let getIssueUnfiledPromises = []
                function getIssueUnfiled (issueUnFiledUrl) {
                    options['uri'] = issueUnFiledUrl
                    return rp(options)
                        .then((issueBody) => {
                            issueBody = JSON.parse(issueBody)
                            let issues = []
                            for (let i = 0, l = issueBody.length; i < l; i++) {
                                let issue = {}
                                let commentsUrl = issueBody[i].comments_url
                                issue['user'] = {
                                    name: issueBody[i].user.login,
                                    avatar_url: issueBody[i].user.avatar_url,
                                    url: issueBody[i].user.url
                                }
                                issue['labels'] = issueBody[i].labels.map((item) => {
                                    return item.name
                                })
                                issue['title'] = issueBody[i].title
                                issue['number'] = issueBody[i].number
                                issue['body'] = issueBody[i].body
                                issue['created_at'] = utcToLocal(issueBody[i].created_at)
                                issue['updated_at'] = issueBody[i].updated_at
                                options['uri'] = commentsUrl
                                return rp(options)
                                    .then((commentReuslt) => {
                                        commentReuslt = JSON.parse(commentReuslt)
                                        issue['comments'] = []
                                        for (let i = 0, l = commentReuslt.length; i < l; i++) {
                                            let comment = {}
                                            comment['user'] = {
                                                name: commentReuslt[i].user.login,
                                                avatar_url: commentReuslt[i].user.avatar_url,
                                                url: commentReuslt[i].user.url
                                            }
                                            comment['body'] = commentReuslt[i].body
                                            comment['id'] = commentReuslt[i].id
                                            comment['created_at'] = utcToLocal(commentReuslt[i].created_at)
                                            comment['updated_at'] = utcToLocal(commentReuslt[i].updated_at)
                                            issue['comments'].push(comment)
                                        }
                                        issues.push(issue)
                                        return issues
                                    })
                            }
                        })
                }

                for (let i = 0, l = issuesUnFiledUrl.length; i < l; i++) {
                    getIssueUnfiledPromises.push(getIssueUnfiled(issuesUnFiledUrl[i]))
                }

                console.log('getIssueUnfiledPromises: ', getIssueUnfiledPromises)
                return Promise.all(getIssueUnfiledPromises).then((issues) => {
                    console.log('issues: ', issues)
                    let finalIssues = []
                    for (let i = 0, l = issues.length; i < l; i++) {
                        finalIssues = finalIssues.concat(issues[i])
                    }
                    return finalIssues
                })
            }

            async function syncUnFiledIssues () {
                let unFiledIssues = await getIssuesUnFiledResult(issuesUnFiledUrl)

                for (let i = 0, l = unFiledIssues.length; i < l; i++) {
                    let unFiledIssue = unFiledIssues[i]
                    let userInfo = unFiledIssue.user
                    let isExistUserInfo = findOneUser({github_name: userInfo.name})
                    if (isExistUserInfo.statusCode !== '200') {
                        let registerUserInfo = {
                            username: Math.random().toString(36).substr(2),
                            type: '1',
                            github_url: userInfo.url,
                            github_name: userInfo.name,
                            avatar: userInfo.avatar_url
                        }
                        let registerResult = await registerUser(registerUserInfo)
                        if (registerResult.statusCode === '200') {
                            log.debug(__filename, __line(__filename), registerResult.message)
                        } else {
                            log.error(__filename, __line(__filename), registerResult.message)
                        }
                    }
                    for (let i = 0, l = unFiledIssue.labels.length; i < l; i++) {
                        let labelResult = await tags.addTag({name: unFiledIssue.labels[i]})
                        if (labelResult.statusCode === '200') {
                            log.debug(__filename, __line(__filename), labelResult.message)
                        } else {
                            log.error(__filename, __line(__filename), labelResult.message)
                        }
                    }
                    let newArticle = new Article({
                        title: unFiledIssue.title,
                        content: unFiledIssue.body,
                        isPublish: 1,
                        viewCount: 0,
                        commentCount: unFiledIssue.comments.length,
                        time: unFiledIssue.created_at,
                        updatedTime: unFiledIssue.updated_at,
                        isIssue: true,
                        issueId: unFiledIssue.number,
                        author: unFiledIssue.user.name,
                        tags: unFiledIssue.labels
                    })
                    let newArticleResult = await newArticle.save().then(data => {
                        return {'statusCode': '200', 'message': '文章保存成功', data}
                    }).catch(err => {
                        log.error(__filename, __line(__filename), err)
                        return {'statusCode': '20008', 'message': '文章保存失败'}
                    })
                    if (newArticleResult.statusCode === '200') {
                        log.debug(__filename, __line(__filename), newArticleResult.message)
                    } else {
                        log.error(__filename, __line(__filename), newArticleResult.message)
                    }
                    for (let i = 0, l = unFiledIssue.comments.length; i < l; i++) {
                        let comment = unFiledIssue.comments[i]
                        let userInfo = comment.user
                        let isExistUserInfo = findOneUser({github_name: userInfo.name})
                        if (isExistUserInfo.statusCode !== '200') {
                            let registerUserInfo = {
                                username: Math.random().toString(36).substr(2),
                                type: '1',
                                github_url: userInfo.url,
                                github_name: userInfo.name,
                                avatar: userInfo.avatar_url
                            }
                            let registerResult = await registerUser(registerUserInfo)
                            if (registerResult.statusCode === '200') {
                                isExistUserInfo.userInfo = registerResult.data
                                log.debug(__filename, __line(__filename), registerResult.message)
                            } else {
                                log.error(__filename, __line(__filename), registerResult.message)
                            }
                        }
                        if (isExistUserInfo.userInfo && newArticleResult.data) {
                            let newComment = new Comment({
                                content: comment.body,
                                userId: isExistUserInfo.userInfo._id,
                                createdTime: comment.created_at,
                                updatedTime: comment.updated_at,
                                likeHot: 0,
                                articleId: newArticleResult.data._id,
                                type: '1',
                                isIssueComment: true,
                                issueCommentId: comment.id
                            })

                            let result = await newComment.save().then(async data => {
                                return {'statusCode': '200', 'message': '评论保存成功', data}
                            }).catch(err => {
                                log.error(__filename, __line(__filename), err)
                                return {'statusCode': '20008', 'message': '评论保存失败'}
                            })
                            log.info(__filename, __line(__filename), result)
                        } else {
                            log.error(__filename, __line(__filename), isExistUserInfo.message)
                            log.error(__filename, __line(__filename), newArticleResult.message)
                        }
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

async function syncGithubfiledArticle () {
    let apiUrl = 'https://api.github.com/repos/oyosc/blog'
    let issueApiUrl = apiUrl + '/issues?access_token=' + '15f6e907b82037e652dde980739cf3493fe6dd9f&state=' + 'open'
    let testUrl = 'https://api.github.com/repos/996icu/996.ICU'
    let options = {
        method: 'GET',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36' }
    }
    let articleInfo = await Article.find({}, 'updatedTime', {
        limit: 1
    }).then((result) => {
        return {'code': 200, 'data': result}
    }).catch((err) => {
        return {'code': 20007, 'data': JSON.stringify(err)}
    })
    if (articleInfo.code === 200 && articleInfo.data) {
        let updatedTime = articleInfo.data.updatedTime
        issueApiUrl = issueApiUrl + '&since=' + updatedTime
        options['uri'] = issueApiUrl
        rp(options)
            .then((respBody) => {
                respBody = JSON.parse(respBody)
            })
            .catch((err) => {
                log.error(__filename, __line(__filename), JSON.stringify(err))
            })
    } else {
        log.error(__filename, __line(__filename), articleInfo.data)
    }
    console.log(articleInfo)
    // options['uri'] = apiUrl
    // rp(options)
    //     .then(async (respBody) => {
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
}

// syncGithubArticle()
syncGithubfiledArticle()
module.exports = {
    getArticles,
    updateArticle,
    delArticle,
    addArticle,
    getArticleDetail
}
