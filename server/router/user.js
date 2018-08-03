import Koa from 'koa'
import Router from 'koa-router'
import {login, login_with_github, userInfo, manageAllUsers} from '../controllers/user'
import {addComment, showComments} from '../controllers/comment'

const router = Router();
//用户登录
router.post('/login', login);

//github第三方登录
router.post('/loginedWithGithub', login_with_github)

//获取用户信息
router.get('/userInfo', userInfo);

//添加评论
router.post('/comment/add', addComment)

router.get('/comment/show', showComments)

module.exports = router;