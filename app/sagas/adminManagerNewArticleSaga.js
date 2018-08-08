import {take, call, put, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers'
import {actionTypes as NewArticleActionTypes} from '../reducers/adminManagerNewArticle'
import {actionsTypes as ManagerArticlesTypes} from '../reducers/adminManagerArticle'
import {clear_userinfo} from './baseSaga'

export function* saveArticle(data){
    yield put({type: IndexActionTypes.FETCH_START})
    try{
        let id = yield select(state => state.admin.newArticle.id)
        alert(id)
        let token =  JSON.parse(localStorage.getItem('token'));
        if(id){
            data.id = id
            return yield call(post, '/admin/article/update', data, token)
        }else{
            return yield call(post, '/admin/article/add', data, token)
        }
    }catch(err){
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0})
    }finally{
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* saveArticleFlow(){
    while(true){
        let request = yield take(NewArticleActionTypes.SAVE_ARTICLE)
        if(request.data.title === ''){
            return yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '请输入文章标题', msgType: 0})
        }else if(request.data.content === ''){
            return yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '请输入文章内容', msgType: 0})
        }else if(request.data.tags.length === 0){
            return yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '请选择文章分类', msgType: 0})
        }

        if(request.data.title && request.data.content && request.data.tags.length > 0){
            let res = yield call(saveArticle, request.data)
            if(res && res.headers.authorization){
                localStorage.setItem('token', JSON.stringify(res.headers.authorization));
            }
            if(res && res.data.code ===0 && res.data.message){
                yield put({type: ManagerArticlesTypes.SET_MESSAGE,msgContent: res.data.message, msgType: 1})
                setTimeout(function(){
                    location.replace('/admin/managerArticles')
                }, 1000)
                return
            }else if (res && res.data && res.data.code ===3){
                yield clear_userinfo()
            }else{
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent:'网络请求错误', msgType:0})
            }
        }
    }
}