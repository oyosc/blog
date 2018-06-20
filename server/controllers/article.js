import Articles from '../models/article'
import {responseClient} from '../util'
import log from "../log/log"

//获取文章
async function getArticles(ctx){
    let tag = ctx.request.tag || null
    let ispublish = ctx.request.query.ispublish
    let pageNum = ctx.request.query.pageNum
    let result = await Articles.getArticles(tag, ispublish, pageNum)
    log.debug(__filename, 11, result)
    if(result.statusCode == '200'){
        responseClient(ctx.response, 200, 0, '文章查询成功', result.articlesInfo)
    }else{
        responseClient(ctx.response, 200, 1, '文章查询失败')
    }
}

module.exports = {
    getArticles
}