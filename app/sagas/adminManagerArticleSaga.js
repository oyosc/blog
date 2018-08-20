import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionsTypes as ManagerArticlesTypes} from '../reducers/adminManagerArticle'
import {clear_userinfo} from './baseSaga'
import {actionTypes as NewArticleTypes} from '../reducers/adminManagerNewArticle'

export function * getArticlesList (pageNum) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        return yield call(get, `/getArticles?pageNum=${pageNum}&isPublish=false`)
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * getAllArticlesFlow () {
    while (true) {
        let req = yield take(ManagerArticlesTypes.ADMIN_GET_ARTICLE_LIST)
        let res = yield call(getArticlesList, req.pageNum)
        if (res && res.data && res.data.code === 0 && res.data.result) {
            yield put({type: ManagerArticlesTypes.ADMIN_RESPONSE_GET_ARTICLE_LIST, data: res.data.result})
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * deleteArticle (id) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        let token = JSON.parse(localStorage.getItem('token'))
        return yield call(get, `/admin/article/delete?id=${id}`, token)
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * deleteArticleFlow () {
    while (true) {
        let req = yield take(ManagerArticlesTypes.ADMIN_DELETE_ARTICLE)
        const pageNum = yield select(state => state.admin.articles.pageNum)
        let res = yield call(deleteArticle, req.id)
        if (res && res.data && res.headers.authorization) {
            localStorage.setItem('token', JSON.stringify(res.headers.authorization))
        }
        console.log(res)
        if (res && res.data && res.data.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '删除成功', msgType: 1})
            yield put({type: ManagerArticlesTypes.ADMIN_GET_ARTICLE_LIST, pageNum})
        } else if (res && res.data && res.data.code === 3) {
            yield clear_userinfo()
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * editArticle (id) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        return yield call(get, `/getArticleDetail?id=${id}`)
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * editArticleFlow () {
    while (true) {
        let req = yield take(ManagerArticlesTypes.ADMIN_EDIT_ARTICLE)
        let res = yield call(editArticle, req.id)
        if (res && res.data && res.data.code === 0) {
            let title = res.data.result.title
            let content = res.data.result.content
            let tags = res.data.result.tags
            let id = res.data.result._id
            yield put({type: NewArticleTypes.SET_ARTICLE_ID, id})
            yield put({type: NewArticleTypes.UPDATING_TAGS, tags})
            yield put({type: NewArticleTypes.UPDATING_CONTENT, content})
            yield put({type: NewArticleTypes.UPDATING_TITLE, title})
        } else if (res && res.data && res.data.code === 3) {
            yield clear_userinfo()
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}
