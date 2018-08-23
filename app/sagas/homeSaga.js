import {put, take, call, fork} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {resolveToken} from '../base/util'
import {clear_userinfo} from './baseSaga'

export function * login (url, username, password) {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        return yield call(post, '/user/login', {username, password})
    } catch (error) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '用户名或密码错误', msgType: 2})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * loginFlow () {
    while (true) {
        let request = yield take(IndexActionTypes.USER_LOGIN)
        console.log('login_request: ', request)
        let response = yield call(login, request.url, request.username, request.password)
        if (response && response.data && response.data.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录成功', msgType: 1})
            let userInfo
            console.log('login_response: ', response)
            alert(window.href)
            if (response.headers.authorization) {
                userInfo = resolveToken(response.headers.authorization)
                localStorage.setItem('token', JSON.stringify(response.headers.authorization))
            }
            console.log('localstorage: ', localStorage)
            let data = Object.assign(response.data, userInfo)
            if (request.url.indexOf('detail/') !== -1) {
                window.location.href = request.url
            }
            yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * loginWithGithub (href) {
    yield put({type: IndexActionTypes.FETCH_START})
    console.log('loginwithgithub', href)
    try {
        return yield call(get, href)
    } catch (error) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: 'github第三方登录出现错误，请重试', msgType: 2})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * loginWithGithubFlow () {
    while (true) {
        let request = yield take(IndexActionTypes.GITHUB_USER_LOGIN)
        let response = yield call(loginWithGithub, request.href)
        console.log(response)
        if (response && response.data && response.data.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录成功', msgType: 1})
            let userInfo
            if (response.headers.authorization) {
                userInfo = resolveToken(response.headers.authorization)
                localStorage.setItem('token', JSON.stringify(response.headers.authorization))
            }
            let data = Object.assign(response.data, userInfo)
            yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
        } else if (response) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}

export function * user_auth () {
    while (true) {
        let result = yield take(IndexActionTypes.USER_AUTH)
        try {
            yield put({type: IndexActionTypes.FETCH_START})
            console.log(localStorage.getItem('token'))
            let token = JSON.parse(localStorage.getItem('token'))
            console.log('user_auth: ', token)
            let response = yield call(get, '/user/userInfo', token)
            if (response && response.data && response.data.code === 0) {
                if (!response.headers.authorization) {
                    return yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录失败,请重新登录', msgType: 2})
                }
                let userInfo
                if (response.headers.authorization) {
                    userInfo = resolveToken(response.headers.authorization)
                    localStorage.setItem('token', JSON.stringify(response.headers.authorization))
                }
                let data = Object.assign(response.data, userInfo)
                yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
            }
        } catch (err) {
            console.log(err)
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络错误,请重试', msgType: 2})
        } finally {
            yield put({type: IndexActionTypes.FETCH_END})
        }
    }
}

export function * logout () {
    yield put({type: IndexActionTypes.FETCH_START})
    try {
        let token = JSON.parse(localStorage.getItem('token'))
        return yield call(post, '/user/logout', {}, token)
    } catch (error) {
        console.log(error)
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '注销失败', msgType: 2})
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function * logoutFlow () {
    while (true) {
        let request = yield take(IndexActionTypes.LOGOUT)
        console.log('注销')
        let response = yield call(logout)
        if (response && response.data && response.data.code === 0) {
            localStorage.clear()
            yield put({type: IndexActionTypes.CLEAR_USER_AUTH})
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '注销成功', msgType: 1})
            // window.location.href = request.url
        } else if (response && response.data && response.data.code === 3) {
            yield clear_userinfo()
        } else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
        }
    }
}
