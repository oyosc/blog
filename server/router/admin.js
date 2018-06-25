import Koa from 'koa'
import Router from 'koa-router'
import {manageAllUsers} from '../controllers/user'
import {addTag, delTag} from '../controllers/tags'
import {addArticle, delArticle, updateArticle} from '../controllers/article'

const router = Router();

//获取用户信息
router.get('/getUsers', manageAllUsers);

//添加标签
router.post('/tags/addTag', addTag);

//删除标签
router.get('/tags/delTag', delTag);

//添加文章
router.post('/article/add', addArticle)

//删除文章
router.get('/article/delete', delArticle)

//更新文章
router.post('article/update', updateArticle)

module.exports = router;

