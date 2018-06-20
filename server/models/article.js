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

module.exports = {
    getArticles
}