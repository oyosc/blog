import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionsTypes as ManagerArticlesTypes} from '../reducers/adminManagerArticle'

export function getArticleList(pageNum){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token = JSON.parse(localStorage.getItem("token"));
        return yield call(get, `/getArticleList'?pageNum=${pageNum}&isPublish=false`, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgCongtent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function getAllArticlesFlow(){
    while(true){
        let req = yield take(ManagerArticlesTypes.get_article_list)
        let res = yield call(getArticleList, req.pageNum)
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res && res.data.code ===0 && res.data.result){
            let articleArr = []
            
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgCongtent:res.data.message, msgType:0})
        }
    }
}