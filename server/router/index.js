import Router from 'koa-router'
import {getAllTags} from '../controllers/tags'
import {getArticles, getArticleDetail} from '../controllers/article'
import {github} from '../middlewares/conf'
import passport from 'koa-passport'
import {loginWithGithub} from '../controllers/user'

const router = Router()

// 获取标签信息
router.get('getAllTags', getAllTags)

// 获取文章信息
router.get('getArticles', getArticles)

// 获取文章详情
router.get('getArticleDetail', getArticleDetail)

// github第三方登录
router.get('auth/github', github, passport.authenticate('github'))
router.get('auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    loginWithGithub
)

module.exports = router
