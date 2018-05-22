import Koa from 'koa'
import Router from 'koa-router'
import {manageAllUsers} from '../controllers/user'

const router = Router();

//获取用户信息
router.get('/getUsers', manageAllUsers);

module.exports = router;

