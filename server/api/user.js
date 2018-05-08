import Koa from 'koa'
import Router from 'koa-router'
import {login, userInfo} from '../controllers/user'

const router = Router();
router.post('/login', login);

router.get('/userInfo', userInfo);

module.exports = router;