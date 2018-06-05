import Koa from 'koa'
import Router from 'koa-router'
import {login, userInfo, manageAllUsers} from '../controllers/user'

const router = Router();
//用户登录
router.post('/login', login);

//获取用户信息
router.get('/userInfo', userInfo);

module.exports = router;