import Koa from 'koa'
import Router from 'koa-router'
import {manageAllUsers} from '../controllers/user'
import {addTag, delTag} from '../controllers/tags'

const router = Router();

//获取用户信息
router.get('/getUsers', manageAllUsers);

//添加标签
router.post('/tags/addTag', addTag);

//删除标签
router.get('/tags/delTag', delTag);

module.exports = router;

