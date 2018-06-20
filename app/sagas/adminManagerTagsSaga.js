import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as ManagerTagsTypes} from '../reducers/adminManagerTags'

export function* getAllTags(){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        console.log(token);
        return yield call(get, '/getAllTags', token);
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* addTag(name){
    yield put({type: IndexActionTypes.FETCH_START});
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        console.log("addtoken")
        console.log(token)
        return yield call(post, '/admin/tags/addTag', {name}, token);
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* delTag(name){
    yield put({type: IndexActionTypes.FETCH_START});
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        return yield call(get, `admin/tags/delTag?name=${name}`, token);
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType:0});
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getAllTagsFlow(){
    while(true){
        yield take(ManagerTagsTypes.GET_ALL_TAGS);
        let res = yield call(getAllTags);
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        console.log(res);
        if(res && res.data.code ===0 && res.data.result){
            let tagArr = [];
            console.log(res);
            for(let i=0; i< res.data.result.length; i++){
                tagArr.push(res.data.result[i].name)
            }
            yield put({type: ManagerTagsTypes.SET_TAGS, data: tagArr})
        }else if (res && res.data.code ===3){
            console.log(res.data)
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:"token已经失效,请重新登录", msgType:3})
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType:0});
        }
    }
}

export function* delTagFlow(){
    while(true){
        let req = yield take(ManagerTagsTypes.DELETE_TAG);
        let res = yield call(delTag, req.name);
        console.log("deltagtoken");
        console.log(res.headers.authorization);
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res && res.data.code === 0){
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType: 1});
            yield put({type: ManagerTagsTypes.GET_ALL_TAGS});
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType:0});
        }
    }
}

export function* addTagFlow(){
    while(true){
        let req = yield take(ManagerTagsTypes.ADD_TAG);
        let res = yield call(addTag, req.name);
        console.log(res);
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res.data.code === 0){
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType: 1});
            yield put({type: ManagerTagsTypes.GET_ALL_TAGS});
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.data.message, msgType:0});
        }
    }
}