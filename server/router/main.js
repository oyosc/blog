
import Router from 'koa-router'
import userRouter from './user'
import adminRouter from './admin'
import indexRouter from './index'
const koaBody = require('koa-body')
const router = Router();

router.use('/user', koaBody(), userRouter.routes())

router.use('/admin', koaBody(), adminRouter.routes())

router.use('/', koaBody(), indexRouter.routes())

module.exports = router