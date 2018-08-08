import {take, put, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as AdminCommentActionTypes} from '../reducers/adminManagerComment'
import {clear_userinfo} from './baseSaga'


export function* showCommentList(pageNum){
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
        let res = yield call(showCommentList, req.pageNum)
        if(res && res.data && res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        console.log("adminCommentList: ", res)
        if(res && res.data && res.data.code ===0 && res.data.result){
            let data = {}
            data.list = res.data.result.list
            data.pageNum = res.data.result.pageNum
            data.total = res.data.result.total
            return yield put({type: AdminCommentActionTypes.RESOLVE_GET_ALL_COMMENTS,data: data})
        }else if (res && res.data && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}

export function* auditComment(switchType, comment_id){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'))
        return yield call(post, `/admin/comment/audit`, {switchType, comment_id}, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* auditCommentFlow(){
    while(true){
        let req = yield take(AdminCommentActionTypes.AUDIT_COMMENT)
        console.log("audit_comment_Req: ", req)
        if(req.audit_type === true){
            req.audit_type = '1'
        }else{
            req.audit_type = '0'
        }
        const pageNum = yield select(state => state.admin.comments.pageNum)
        let res = yield call(auditComment, req.audit_type, req.comment_id)
        if(res && res.data && res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        console.log("auditComment: ", res)
        if(res && res.data && res.data.code ===0){
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '审核成功', msgType: 1})
            return yield put({type: AdminCommentActionTypes.GET_ALL_COMMENTS, pageNum})
        }else if (res && res.data && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}