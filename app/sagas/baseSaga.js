import {take, call, put, select} from 'redux-saga/effects'
import {actionsTypes as IndexActionTypes} from '../reducers'

export function * clear_userinfo () {
    console.log('clear_userInfo')
    localStorage.clear()
    yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '长时间未响应,请重新登录', msgType: 2})
    yield put({type: IndexActionTypes.CLEAR_USER_AUTH})
}
