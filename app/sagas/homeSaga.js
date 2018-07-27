import {put, take, call, fork} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {resolveToken} from '../base/util'

export function* login(username, password){
    yield put({type: IndexActionTypes.FETCH_START});
    try{
        return yield call(post, '/user/login', {username, password})
    } catch(error){
        yield put({type:IndexActionTypes.SET_MESSAGE, msgContent:'用户名或密码错误', msgType: 2});
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* loginFlow(){
    while(true){
        let request = yield take(IndexActionTypes.USER_LOGIN);
        let response = yield call(login, request.username, request.password);
        if(response && response.data&&response.data.code === 0){
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录成功', msgType: 1});
            let userInfo;
            if(response.headers.authorization){
                userInfo = resolveToken(response.headers.authorization);
                localStorage.setItem('token', JSON.stringify(response.headers.authorization));
            }
            let data = Object.assign(response.data, userInfo);
            yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
        }
    }
}

export function* user_auth(){
    while(true){
        let result = yield take(IndexActionTypes.USER_AUTH)
        try{
            yield put({type: IndexActionTypes.FETCH_START})
            let token =  JSON.parse(localStorage.getItem('token'));
            let response = yield call(get, '/user/userInfo', token);
            if(response && response.data && response.data.code === 0){
                if(!response.headers.authorization){
                    return yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '登录失败,请重新登录', msgType: 2});
                }
                let userInfo;
                if(response.headers.authorization){
                    userInfo = resolveToken(response.headers.authorization);
                    localStorage.setItem('token', JSON.stringify(response.headers.authorization));
                }
                let data = Object.assign(response.data, userInfo);
                yield put({type: IndexActionTypes.RESPONSE_USER_INFO, data: data})
            }
        }catch(err){
            console.log(err)
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: "网络错误,请重试", msgType: 2});
        }finally{
            yield put({type: IndexActionTypes.FETCH_END})
        }
    }
}