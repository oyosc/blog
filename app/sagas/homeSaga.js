import {put, take, call, fork} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
const jwt = require('jsonwebtoken')

function checkToken(authorization){
    let decoded = jwt.decode(authorization, {complete: true});
    let userId = decoded.payload['userId'];
    let username = decoded.payload['username'];
    let userType = decoded.payload['userType'];
    return {userId, username, userType}
}

export function* login(username, password){
    yield put({type: IndexActionTypes.FETCH_START});
    try{
        return yield call(post, '/user/login', {username, password})
    } catch(error){
        yield put({type:IndexActionTypes.SET_MESSAGE, msgContent:'用户名或密码错误', msgType: 0});
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* loginFlow(){
    while(true){
        let request = yield take(IndexActionTypes.USER_LOGIN);
        let response = yield call(login, request.username, request.password);
        if(response.data&&response.data.code === 0){
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录成功', msgType: 1});
            let userInfo = checkToken(response.headers.authorization);
            let data = Object.assign(response.data, userInfo, {token: response.headers.authorization});
            yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
        }
    }
}

export function* user_auth(){
    while(true){
        let result = yield take(IndexActionTypes.USER_AUTH)
        try{
            yield put({type: IndexActionTypes.FETCH_START})
            let response = yield call(get, '/user/userInfo', result.token);
            if(response && response.code === 0){
                let userInfo = checkToken(response.headers.authorization);
                let data = Object.assign(response.data, userInfo, {token: response.headers.authorization});
                yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
            }
        }catch(err){
            console.log(err);
        }finally{
            yield put({type: IndexActionTypes.FETCH_END})
        }
    }
}