import Router from 'koa-router'
import {getAllTags} from '../controllers/tags'
import {getArticles, getArticleDetail} from '../controllers/article'

const router = Router()

// 获取标签信息
router.get('getAllTags', getAllTags)

// 获取文章信息
router.get('getArticles', getArticles)

// 获取文章详情
router.get('getArticleDetail', getArticleDetail)

module.exports = router
