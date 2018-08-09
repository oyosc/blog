import {fork} from 'redux-saga/effects'
import {loginFlow, user_auth, loginWithGithubFlow, loginedWithGithubFlow} from './homeSaga'
import {get_all_users_flow} from './adminManagerUsersSaga'
import {getAllTagsFlow, delTagFlow, addTagFlow} from './adminManagerTagsSaga'
import {getAllArticlesFlow, editArticleFlow, deleteArticleFlow} from './adminManagerArticleSaga'
import {saveArticleFlow} from './adminManagerNewArticleSaga'
import {getAllArticleFlow, getArticleDetailFlow} from './frontSaga'
import {addCommentFlow, showCommentFlow, addLikeHotFlow, deleteLikeHotFlow} from './commentSaga'
import {showCommentListFlow, auditCommentFlow, configCommentFlow} from './adminManagerCommentSaga'

export default function* rootSaga(){
    yield fork(loginFlow)
    yield fork(loginWithGithubFlow)
    yield fork(loginedWithGithubFlow)
    yield fork(user_auth)
    yield fork(get_all_users_flow)
    yield fork(getAllTagsFlow)
    yield fork(delTagFlow)
    yield fork(addTagFlow)
    yield fork(getAllArticlesFlow)
    yield fork(saveArticleFlow)
    yield fork(editArticleFlow)
    yield fork(deleteArticleFlow)
    yield fork(getAllArticleFlow)
    yield fork(getArticleDetailFlow)
    yield fork(addCommentFlow)
    yield fork(showCommentFlow)
    yield fork(addLikeHotFlow)
    yield fork(deleteLikeHotFlow)
    yield fork(showCommentListFlow)
    yield fork(auditCommentFlow)
    yield fork(configCommentFlow)
}