import Koa from 'koa'
import Router from 'koa-router'
import {getAllTags} from '../controllers/tags'
import {getArticles} from '../controllers/article'

const router = Router();

//获取标签信息
router.get('getAllTags', getAllTags);

//获取文章信息
router.get('getArticles', getArticles)

module.exports = router;