import Article from '../../models/article'
import log from "../log/log"

async function getArticles(tag, isPublish, pageNum){
    let searchCondition = {
        isPublish
    }
    if(tag){
        searchCondition.tags = tag;
    }
    if(isPublish === 'false'){
        searchCondition = null
    }

    let skip = pageNum -1 < 0 ? 0 : (pageNum-1)*5
    let articlesInfo = {
        total: 0,
        list: []
    }

    let result = await Article.count(searchCondition).then(async count => {
        articlesInfo.total = count
        let articleResult = await Article.find(searchCondition, '_id title isPublish author viewCount commentCount time coverImg', {
            skip: skip,
            limit: 5
        }).then(result => {
            log.debug(__filename, 28, result)
            return {'code': 1, 'data': result}
        }).catch(err => {
            return {'code': 0, 'data': JSON.stringify(err)}
        })
        if(articleResult.code == 1){
            articlesInfo.list = articleResult.data
            return {'statusCode': '200', 'message': '成功查询到article信息', articlesInfo}
        }else{
            return {'statusCode': '20002', 'message': articleResult.data}
        }
    }).catch(err => {
        log.error(__filename, 23, err)
        return {'statusCode': '20002', 'message': JSON.stringify(err)}
    })
    return result
}

async function addArticle(articleInfo, userName){
    const {
        title,
        content,
        time,
        tags,
        isPublish
    } = articleInfo
    const author = userName
    const coverImg = `/${Math.round(Math,round()*9 + 1)}.jpg`
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
        return {'statusCode': '20008', 'message': '文章保存失败'}
    })
    return result
}

async function updateArticle(articleInfo){
    const {
        title,
        content,
        time,
        tags,
        isPublish,
        id
    } = articleInfo
    let result = await Article.update({_id: id}, {title, content,time, tags: tags.split(','), isPublish})
        .then(data => {
            return {'statusCode': '200', 'message': '文章保存成功'}
        }).catch(err => {
            return {'statusCode': '20008', 'message': '文章保存失败'}
        })
    return result
}

async function delArticle(id){
    let result = await Article.remove({_id: id})
        .then(data => {
            if(data.result.n === 1){
                return {'statusCode': '200', 'message': '文章删除成功'}
            }else{
                return {'statusCode': '201', 'message': '文章不存在'}
            }
        }).catch(err => {
            return {'statusCode': '20006', 'message': '文章删除失败'}
        })
}

module.exports = {
    getArticles,
    updateArticle,
    delArticle,
    addArticle
}