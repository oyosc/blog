import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as ManagerTagsTypes} from '../reducers/adminManagerTags'
import {clear_userinfo} from './baseSaga'

export function * getAllTags () {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        return yield call(get, '/getAllTags')
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * addTag (name) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        let token = JSON.parse(localStorage.getItem('token'))
        console.log('addtoken')
        console.log(token)
        return yield call(post, '/admin/tags/addTag', {name}, token)
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * delTag (name) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        let token = JSON.parse(localStorage.getItem('token'))
        return yield call(get, `admin/tags/delTag?name=${name}`, token)
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * getAllTagsFlow () {
    while (true) {
        yield take(ManagerTagsTypes.GET_ALL_TAGS)
        let res = yield call(getAllTags)
        console.log('get_all_tags: ', res)
        if (res && res.data && res.data.code === 0 && res.data.result) {
            let tagArr = []
            console.log(res)
            for (let i = 0; i < res.data.result.length; i++) {
                tagArr.push(res.data.result[i].name)
            }
            yield put({type: ManagerTagsTypes.SET_TAGS, data: tagArr})
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * delTagFlow () {
    while (true) {
        let req = yield take(ManagerTagsTypes.DELETE_TAG)
        let res = yield call(delTag, req.name)
        console.log('deltagtoken')
        console.log(res.headers.authorization)
        if (res && res.headers.authorization) {
            localStorage.setItem('token', JSON.stringify(res.headers.authorization))
        }
        if (res && res.data && res.data.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType: 1})
            yield put({type: ManagerTagsTypes.GET_ALL_TAGS})
        } else if (res && res.data && res.data.code === 3) {
            yield clear_userinfo()
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * addTagFlow () {
    while (true) {
        let req = yield take(ManagerTagsTypes.ADD_TAG)
        let res = yield call(addTag, req.name)
        console.log(res)
        if (res && res.headers.authorization) {
            localStorage.setItem('token', JSON.stringify(res.headers.authorization))
        }
        if (res && res.data && res.data.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType: 1})
            yield put({type: ManagerTagsTypes.GET_ALL_TAGS})
        } else if (res && res.data && res.data.code === 3) {
            yield clear_userinfo()
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}
