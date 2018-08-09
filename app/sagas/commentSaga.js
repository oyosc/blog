import {take, put, call} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as CommentActionTypes} from '../reducers/comments'
import {clear_userinfo} from './baseSaga'

export function* addComment(comment){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        return yield call(post, '/user/comment/add', comment, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* addCommentFlow(){
    while(true){
        let req = yield take(CommentActionTypes.ADD_COMMENT)
        let res = yield call(addComment, req.comment)
        console.log(res)
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res && res.data && res.data.code ===0 && res.data.result){
            yield put({type: CommentActionTypes.RESPONSE_ADD_COMMENT,data: res.data.result})
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '评论添加成功', msgType: 1});
        }else if (res && res.data && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}

export function* showComment(articleId, pageNum){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        return yield call(get, `/user/comment/show?pageNum=${pageNum}&articleId=${articleId}`) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* showCommentFlow(){
    while(true){
        let req = yield take(CommentActionTypes.INIT_COMMENT)
        console.log("comment_Req: ", req)
        let res = yield call(showComment, req.article_id, req.pageNum)
        console.log(res)
        if(res && res.data && res.data.code ===0 && res.data.result){
            yield put({type: CommentActionTypes.RESPONSE_INIT_COMMENT,data: res.data.result})
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}

//添加likehot
export function* addLikeHot(comment_id){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        return yield call(post, '/user/comment/likeHot/add', {comment_id}, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* addLikeHotFlow(){
    while(true){
        let req = yield take(CommentActionTypes.ADD_LIKEHOT)
        let res = yield call(addLikeHot, req.comment_id)
        console.log(res)
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res && res.data && res.data.code ===0 && res.data.result){
            yield put({type: CommentActionTypes.RESPONSE_ADD_LIKEHOT,data: res.data.result})
        }else if (res && res.data && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}

//删除likehot
export function* deleteLikeHot(comment_id){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let token =  JSON.parse(localStorage.getItem('token'));
        return yield call(post, '/user/comment/likeHot/delete', {comment_id}, token) 
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* deleteLikeHotFlow(){
    while(true){
        let req = yield take(CommentActionTypes.DELETE_LIKEHOT)
        let res = yield call(deleteLikeHot, req.comment_id)
        console.log(res)
        if(res.headers.authorization){
            localStorage.setItem('token', JSON.stringify(res.headers.authorization));
        }
        if(res && res.data && res.data.code ===0 && res.data.result){
            yield put({type: CommentActionTypes.RESPONSE_DELETE_LIKEHOT,data: res.data.result})
        }else if (res && res.data && res.data.code ===3){
            yield clear_userinfo()
        }else{
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
        }
    }
}