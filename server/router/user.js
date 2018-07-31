import Koa from 'koa'
import Router from 'koa-router'
import {login, login_with_github, userInfo, manageAllUsers} from '../controllers/user'

const router = Router();
//用户登录
router.post('/login', login);

//github第三方登录
router.get('/loginWithGithub', login_with_github)

//获取用户信息
router.get('/userInfo', userInfo);

module.exports = router;