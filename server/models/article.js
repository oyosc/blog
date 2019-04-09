import Article from '../database/mongodb/models/article'
import Comment from '../database/mongodb/models/comment'
import Tags from '../database/mongodb/models/tags'
import tags from './tags'
import {prod, dev} from '../../config'
import log from '../log/log'
import {findOneUser, registerUser} from './user'
import {utcToLocal} from '../base/util'
import schedule from 'node-schedule'
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
    let apiUrl = prod.apiUrl
    let issueApiUrl = apiUrl + '/issues?access_token=' + prod.issueAccessToken + '&state=' + prod.issueState + '&labels=' + encodeURI(prod.issueUnfiledFlag) + '&client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
    let options = {
        method: 'GET',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36' }
    }
    options['uri'] = apiUrl + '?client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
    console.log('options_uri', options)
    rp(options)
        .then(async (respBody) => {
            respBody = JSON.parse(respBody)
            let openIssuesCount = respBody.open_issues_count
            let size = prod.issueSize ? prod.issueSize : 30
            let page = Math.ceil(openIssuesCount / size)
            let issuesUnFiledUrl = []
            while (page !== 0) {
                let issueUnFiledUrl = issueApiUrl + '&page=' + page + '&size=' + size
                issuesUnFiledUrl.push(issueUnFiledUrl)
                page--
            }

            function getIssuesUnFiledResult (issuesUnFiledUrl) {
                let getIssueUnfiledPromises = []
                function getIssueUnfiled (issueUnFiledUrl) {
                    options['uri'] = issueUnFiledUrl
                    console.log('issueUnFiledUrl: ', issueUnFiledUrl)
                    return rp(options)
                        .then((issueBodys) => {
                            issueBodys = JSON.parse(issueBodys)
                            console.log('issueBodys_rp: ', issueBodys)
                            function getIssues (issueBody) {
                                let issue = {}
                                let commentsUrl = issueBody.comments_url
                                issue['user'] = {
                                    name: issueBody.user.login,
                                    avatar_url: issueBody.user.avatar_url,
                                    url: issueBody.user.url
                                }
                                issue['labels'] = issueBody.labels.map((item) => {
                                    return item.name
                                })
                                issue['title'] = issueBody.title
                                issue['number'] = issueBody.number
                                issue['body'] = issueBody.body
                                issue['url'] = issueBody.url
                                issue['created_at'] = utcToLocal(issueBody.created_at).local_datetime
                                issue['updated_at'] = utcToLocal(issueBody.updated_at).timestamp
                                options['uri'] = commentsUrl + '?client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
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
                                            comment['created_at'] = utcToLocal(commentReuslt[i].created_at).timestamp * 1000
                                            comment['updated_at'] = utcToLocal(commentReuslt[i].updated_at).timestamp
                                            issue['comments'].push(comment)
                                        }
                                        return {statusCode: '200', issue}
                                    }).catch((err) => {
                                        return {statusCode: '20012', message: JSON.stringify(err)}
                                    })
                            }
                            return Promise.all(issueBodys.map((item) => getIssues(item))).then((loopIssueResults) => {
                                console.log('loopIssueResults: ', loopIssueResults)
                                let finalLoopIssues = []
                                for (let i = 0, l = loopIssueResults.length; i < l; i++) {
                                    let loopIssueResult = loopIssueResults[i]
                                    if (loopIssueResult.statusCode === '200') {
                                        finalLoopIssues = finalLoopIssues.concat(loopIssueResult.issue)
                                    } else {
                                        log.error(__filename, __line(__filename), loopIssueResult.message)
                                    }
                                }
                                return {statusCode: '200', finalLoopIssues}
                            }).catch(err => {
                                return {statusCode: '20010', message: JSON.stringify(err)}
                            })
                        }).catch((err) => {
                            return {statusCode: '20011', message: JSON.stringify(err)}
                        })
                }

                for (let i = 0, l = issuesUnFiledUrl.length; i < l; i++) {
                    getIssueUnfiledPromises.push(getIssueUnfiled(issuesUnFiledUrl[i]))
                }

                return Promise.all(getIssueUnfiledPromises).then((issueResults) => {
                    console.log('issues: ', issueResults)
                    let finalIssues = []
                    for (let i = 0, l = issueResults.length; i < l; i++) {
                        let issuesData = issueResults[i]
                        if (issuesData.statusCode === '200') {
                            finalIssues = finalIssues.concat(issuesData.finalLoopIssues)
                        } else {
                            log.error(__filename, __line(__filename), issuesData.message)
                        }
                    }
                    return {statusCode: '200', finalIssues}
                }).catch((err) => {
                    return {statusCode: '20013', message: JSON.stringify(err)}
                })
            }

            async function syncUnFiledIssues () {
                let unFiledIssues = await getIssuesUnFiledResult(issuesUnFiledUrl)
                if (unFiledIssues.statusCode === '200') {
                    for (let i = 0, l = unFiledIssues.finalIssues.length; i < l; i++) {
                        let unFiledIssue = unFiledIssues.finalIssues[i]
                        let userInfo = unFiledIssue.user
                        let isExistUserInfo = await findOneUser({github_name: userInfo.name})
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
                            let editIssueUrl = unFiledIssue.url + '?access_token=' + prod.issueAccessToken + '&client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
                            console.log('unFiledIssue.labels: ', unFiledIssue.labels)
                            let newLabels = unFiledIssue.labels.filter((item) => {
                                return item !== prod.issueUnfiledFlag
                            })
                            newLabels.push(prod.issueFiledFlag)
                            console.log('newLabels: ', newLabels)
                            options['uri'] = editIssueUrl
                            options['method'] = 'PATCH'
                            options['body'] = {
                                labels: newLabels
                            }
                            options['json'] = true
                            rp(options)
                                .then(async (editIssueResult) => {
                                    console.log('editIssueResult: ', editIssueResult)
                                    for (let i = 0, l = unFiledIssue.comments.length; i < l; i++) {
                                        let comment = unFiledIssue.comments[i]
                                        let userInfo = comment.user
                                        let isExistUserInfo = await findOneUser({github_name: userInfo.name})
                                        console.log('isExistUserInfo: ', isExistUserInfo)
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
                                })
                                .catch((err) => {
                                    log.error(__filename, __line(__filename), err)
                                })
                        } else {
                            log.error(__filename, __line(__filename), newArticleResult.message)
                        }
                    }
                } else {
                    log.error(__filename, __line(__filename), unFiledIssues.message)
                }
            }
            syncUnFiledIssues()
        })
        .catch((err) => {
            console.log(err)
        })
}

async function syncGithubfiledArticle () {
    let apiUrl = prod.apiUrl
    let issueApiUrl = apiUrl + '/issues?access_token=' + prod.issueAccessToken + '&state=' + prod.issueState + '&labels=' + encodeURI(prod.issueFiledFlag) + '&client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
    let options = {
        method: 'GET',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36' }
    }
    let articleInfo = await Article.find({isIssue: true}, 'updatedTime', {
        limit: 1,
        sort: [{updatedTime: -1}]
    }).then((result) => {
        return {'statusCode': '200', 'data': result}
    }).catch((err) => {
        return {'statusCode': '20007', 'data': JSON.stringify(err)}
    })

    async function getIssueFiled (issueBody) {
        let issue = {}
        let commentsUrl = issueBody.comments_url
        issue['labels'] = issueBody.labels.map((item) => {
            return item.name
        })
        issue['title'] = issueBody.title
        issue['number'] = issueBody.number
        issue['body'] = issueBody.body
        issue['updated_at'] = utcToLocal(issueBody.updated_at).timestamp
        issue['comments'] = []
        let commentInfo = await Comment.find({}, 'updatedTime', {
            limit: 1
        }).then((result) => {
            return {'statusCode': '200', 'data': result}
        }).catch((err) => {
            return {'statusCode': '20007', 'data': JSON.stringify(err)}
        })
        if (commentInfo.statusCode === '200' && commentInfo.data) {
            options['uri'] = commentsUrl + '?since=' + new Date((commentInfo.data[0].updatedTime) * 1000 + 1000).toISOString() + '&client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
            return rp(options)
                .then((commentReuslt) => {
                    commentReuslt = JSON.parse(commentReuslt)
                    for (let i = 0, l = commentReuslt.length; i < l; i++) {
                        let comment = {}
                        comment['body'] = commentReuslt[i].body
                        comment['id'] = commentReuslt[i].id
                        comment['updated_at'] = utcToLocal(commentReuslt[i].updated_at).timestamp
                        issue['comments'].push(comment)
                    }
                    return issue
                })
        } else {
            log.error(__filename, __line(__filename), commentInfo.data)
        }
    }

    if (articleInfo.statusCode === '200' && articleInfo.data.length > 0) {
        console.log(articleInfo.data)
        let updatedTime = new Date((articleInfo.data[0].updatedTime) * 1000 + 1000).toISOString()
        issueApiUrl = issueApiUrl + '&since=' + updatedTime + '&client_id=' + prod.githubOauth.clientID + '&client_secret=' + prod.githubOauth.clientSecret
        console.log(issueApiUrl)
        options['uri'] = issueApiUrl
        rp(options)
            .then((respBody) => {
                if (respBody) {
                    let issueBodys = JSON.parse(respBody)
                    Promise.all(issueBodys.map(item => getIssueFiled(item))).then(async (issueDatas) => {
                        for (let i = 0, l = issueDatas.length; i < l; i++) {
                            let issueData = issueDatas[i]
                            let allTags = await tags.getAllTags()
                            if (allTags.statusCode === '200') {
                                let tags = JSON.stringify(allTags.tagsInfo)
                                let notHTags = issueData.labels.filter((item) => {
                                    return tags.indexOf(item) === -1
                                })
                                if (notHTags.length > 0) {
                                    let insertTags = []
                                    for (let index in notHTags) {
                                        let insertTag = new Tags({name: notHTags[index]})
                                        insertTags.push(insertTag)
                                    }
                                    let insertManyTags = await Tags.insertMany(insertTags).then((data) => {
                                        return {'statusCode': '200', 'message': '标签添加成功'}
                                    }).catch((err) => {
                                        return {'statusCode': '20009', 'message': JSON.stringify(err)}
                                    })
                                    log.info(__filename, __line(__filename), insertManyTags.message)
                                }
                                console.log('issueData.labels: ', issueData)
                                Article.update({issueId: issueData.number, isIssue: true}, {title: issueData.title, tags: issueData.labels, content: issueData.body, updatedTime: issueData.updated_at}).then((data) => {
                                    log.info(__filename, __line(__filename), data)
                                }).catch(err => {
                                    log.err(__filename, __line(__filename), JSON.stringify(err))
                                })
                                for (let j = 0, k = issueData.comments.length; j < k; j++) {
                                    let insertComment = issueData.comments[j]
                                    Comment.update({isIssueComment: true, issueCommentId: insertComment.id}, {content: insertComment.body, updatedTime: insertComment.updated_at}).then((data) => {
                                        log.info(__filename, __line(__filename), data)
                                    }).catch(err => {
                                        log.err(__filename, __line(__filename), JSON.stringify(err))
                                    })
                                }
                            } else {
                                log.error(__filename, __line(__filename), allTags.message)
                            }
                        }
                    })
                }
            })
            .catch((err) => {
                log.error(__filename, __line(__filename), JSON.stringify(err))
            })
    } else {
        log.error(__filename, __line(__filename), articleInfo.data)
    }
}
function execTasks () {
    schedule.scheduleJob('30 * * * * *', syncGithubUnfiledArticle)
    schedule.scheduleJob('30 * * * * *', syncGithubfiledArticle)
}

execTasks()
module.exports = {
    getArticles,
    updateArticle,
    delArticle,
    addArticle,
    getArticleDetail
}
