const initialState = {
    commentList: [],
    pageNum: 1,
    total: 0
}

export const actionTypes = {
    INIT_COMMENT: 'INIT_COMMENT',
    ADD_COMMENT: 'ADD_COMMENT',
    RESPONSE_ADD_COMMENT: 'RESPONSE_ADD_COMMENT',
    RESPONSE_INIT_COMMENT: 'RESPONSE_INIT_COMMENT',
    DELETE_COMMENT: 'DELETE_COMMENT',
    RESPONSE_DELETE_COMMENT: 'RESPONSE_DELETE_COMMENT',
    ADD_LIKEHOT: 'ADD_LIKEHOT',
    RESPONSE_ADD_LIKEHOT: 'RESPONSE_ADD_LIKEHOT',
    DELETE_LIKEHOT: 'DELETE_LIKEHOT',
    RESPONSE_DELETE_LIKEHOT: 'RESPONSE_DELETE_LIKEHOT'
}

export const actions = {
    init_comment: function (article_id, pageNum = 1) {
        return {
            type: actionTypes.INIT_COMMENT,
            article_id: article_id,
            pageNum: pageNum
        }
    },
    add_comment: function (comment) {
        return {
            type: actionTypes.ADD_COMMENT,
            comment
        }
    },
    delete_comment: function (commentIndex) {
        return {
            type: actionTypes.DELETE_COMMENT,
            commentIndex
        }
    },
    add_likehot: function (comment_id) {
        return {
            type: actionTypes.ADD_LIKEHOT,
            comment_id
        }
    },
    delete_likehot: function (comment_id) {
        return {
            type: actionTypes.DELETE_LIKEHOT,
            comment_id
        }
    }
}

export function reducer (state = initialState, action) {
    switch (action.type) {
        case actionTypes.RESPONSE_DELETE_LIKEHOT:
        case actionTypes.RESPONSE_ADD_LIKEHOT:
            for (let i = 0; i < state.commentList.length; i++) {
                if (state.commentList[i]._id === action.data._id) {
                    state.commentList[i].likeHot = action.data.likeHot
                    state.commentList[i].isLike = action.data.isLike
                }
            }
            return {
                ...state, commentList: [...state.commentList]
            }
        case actionTypes.RESPONSE_ADD_COMMENT:
            console.log('comment_reducer:', action.data)
            return {
                ...state, commentList: [...state.commentList, action.data]
            }
        case actionTypes.RESPONSE_INIT_COMMENT:
            return {
                ...state, commentList: [...action.data.list], pageNum: action.data.pageNum, total: action.data.total
            }
        default:
            return state
    }
}
