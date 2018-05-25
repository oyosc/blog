import {fork} from 'redux-saga/effects'
import {loginFlow, user_auth} from './homeSaga'
import {get_all_users_flow} from './adminManagerUsersSaga'

export default function* rootSaga(){
    yield fork(loginFlow)
    yield fork(user_auth)
    yield fork(get_all_users_flow)
}