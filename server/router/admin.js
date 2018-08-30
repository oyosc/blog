import Router from 'koa-router'
import {manageAllUsers} from '../controllers/user'
import {addTag, delTag} from '../controllers/tags'
import {addArticle, delArticle, updateArticle, getArticles} from '../controllers/article'
import {showCommentsByAdmin, auditCommentByAdmin, configAuditByAdmin, getConfigAuditByAdmin} from '../controllers/comment'

const router = Router()

// 获取用户信息
router.get('/getUsers', manageAllUsers)

// 添加标签
router.post('/tags/addTag', addTag)

// 删除标签
router.get('/tags/delTag', delTag)

// 查询所有文章
router.get('/article/get', getArticles)

// 添加文章
router.post('/article/add', addArticle)

// 删除文章
router.get('/article/delete', delArticle)

// 更新文章
router.post('/article/update', updateArticle)

// 查询评论
router.get('/comment/show', showCommentsByAdmin)

// 审核评论
router.post('/comment/audit', auditCommentByAdmin)

// 配置审核
router.post('/comment/config/set', configAuditByAdmin)

// 获取配置审核
router.post('/comment/config/get', getConfigAuditByAdmin)

module.exports = router
