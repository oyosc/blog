import {take, put, call} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as FrontActionTypes} from '../reducers/frontReducer'
import {clear_userinfo} from './baseSaga'

export function* getArticleList(tag, pageNum){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token = JSON.parse(localStorage.getItem("token"))
        return yield call(get, `/getArticles?pageNum=${pageNum}&isPublish=true&tag=${tag}`, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getAllArticleFlow(){
    while(true){
        let req = yield take(FrontActionTypes.GET_ARTICLE_LIST)
        let res = yield call(getArticleList, req.tag, req.pageNum)
        if(res && res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        console.log(res)
        if(res && res.data.code ===0 && res.data.result){
            yield put({type: FrontActionTypes.RESPONSE_ARTICLE_LIST,data: res.data.result})
        }else if (res && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:res.data.message, msgType:0})
        }
    }
}

export function* getArticleDetail(id){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token = JSON.parse(localStorage.getItem("token"))
        return yield call(get, `/getArticleDetail?id=${id}`, token)
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_START})
    }
}

export function* getArticleDetailFlow(){
    while(true){
        let req = yield take(FrontActionTypes.GET_ARTICLE_DETAIL)
        let res = yield call(getArticleDetail, req.id)

        if(res && res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }

        if(res && res.data.code ===0 && res.data.result){
            yield put({type: FrontActionTypes.RESPONSE_ARTICLE_DETAIL,data: res.data.result})
        }else if (res && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:res.data.message, msgType:0})
        }
    }
}