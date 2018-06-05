import Koa from 'koa'
import Router from 'koa-router'
import {getAllTags} from '../controllers/tags'

const router = Router();

//获取标签信息
router.get('getAllTags', getAllTags);

module.exports = router;