import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as ManagerUserActionTypes} from '../reducers/adminManagerUser'
import {resolveToken} from '../base/util'
import {clear_userinfo} from './baseSaga'

export function* fetch_users(pageNum){
    yield put({type: IndexActionTypes.FETCH_START});
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        return yield call(get, `/admin/getUsers?pageNum=${pageNum}`, token);
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* get_all_users_flow(){
    while(true){
        let request = yield take(ManagerUserActionTypes.GET_ALL_USER);
        let pageNum = request.pageNum || 1;
        let response = yield call(fetch_users, pageNum);
        alert(JSON.stringify(response));
        if(response && response.headers.authorization){
            localStorage.setItem('token', JSON.stringify(response.headers.authorization));
        }
        if(response&&response.data&&response.data.code === 0&&response.data.result){
            for(let i = 0;i<response.data.result.list.length; i++){
                response.data.result.list[i].key = i;
            }
            let data = {};
            data.total = response.data.result.total;
            data.list = response.data.result.list;
            data.pageNum = Number.parseInt(pageNum);
            yield put({type:ManagerUserActionTypes.RESOLVE_GET_ALL_USERS, data: data})
        }else if (res && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: response.data.message, msgType:0});
        }
    }
}