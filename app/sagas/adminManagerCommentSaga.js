import {take, put, call} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as AdminCommentActionTypes} from '../reducers/adminManagerComment'
import {clear_userinfo} from './baseSaga'


export function* showCommentList(articleId, pageNum){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'))
        return yield call(get, `/admin/comment/show?pageNum=${pageNum}`, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* showCommentListFlow(){
    while(true){
        let req = yield take(AdminCommentActionTypes.GET_ALL_COMMENTS)
        console.log("comment_Req: ", req)
        let res = yield call(showCommentList, req.article_id, req.pageNum)
        console.log("adminCommentList: ", res)
        if(res && res.data && res.data.code ===0 && res.data.result){
            let data = {}
            data.list = res.data.result.list
            data.pageNum = res.data.result.pageNum
            data.total = res.data.result.total
            yield put({type: AdminCommentActionTypes.RESOLVE_GET_ALL_COMMENTS,data: data})
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:res.data.message, msgType:0})
        }
    }
}