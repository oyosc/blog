// import {reducer as home} from './homeReducer'
import {combineReducers} from 'redux'
import admin from './admin'
import {reducer as front} from './frontReducer'
const initialState = {
    isFetching: true,
    msg: {
        type: 1, //0失败 1成功
        content: ''
    },
    userInfo: {}
};

export const actionsTypes = {
    FETCH_START: "FETCH_START",
    FETCH_END: "FETCH_END",
    USER_LOGIN: "USER_LOGIN",
    USER_REGISTER: "USER_REGISTER",
    RESPONSE_USER_INFO: "RESPONSE_USER_INFO",
    SET_MESSAGE: "SET_MESSAGE",
    USER_AUTH: "USER_AUTH",
    CLEAR_USER_AUTH: "CLEAR_USER_AUTH",
    GITHUB_USER_LOGIN: "GITHUB_USER_LOGIN",
    GITHUB_USER_LOGINED: "GITHUB_USER_LOGINED"
};



export const actions = {
    get_login: function(username, password){
        return {
            type: actionsTypes.USER_LOGIN,
            username,
            password
        }
    },
    get_github_login: function(){
        return {
            type: actionsTypes.GITHUB_USER_LOGIN
        }
    },
    get_github_logined: function(code){
        return {
            type: actionsTypes.GITHUB_USER_LOGINED,
            code
        }
    },
    get_register: function(data){
        return {
            type: actionsTypes.USER_REGISTER,
            data
        }
    },
    clear_msg: function(){
        return {
            type: actionsTypes.SET_MESSAGE,
            msgType: 1,
            msgContent: ''
        }
    },
    user_auth: function(){
        return {
            type: actionsTypes.USER_AUTH
        }
    }
};

export function reducer(state = initialState, action){
    switch(action.type){
        case actionsTypes.FETCH_START:
            return {
                ...state, isFetching: true
            };
        case actionsTypes.FETCH_END:
            return {
                ...state, isFetching: false
            };
        case actionsTypes.SET_MESSAGE:
            return {
                ...state,
                isFetching: false,
                msg: {
                    type: action.msgType,
                    content: action.msgContent
                }
            };
        case actionsTypes.RESPONSE_USER_INFO:
            return {
                ...state, userInfo: action.data
            };
        case actionsTypes.CLEAR_USER_AUTH:
            return {
                ...state, userInfo: ''
            }
        default:
            return state
    }
}

export default combineReducers({
    globalState: reducer,
    admin,
    front
})