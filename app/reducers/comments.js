const initialState = {
    comments: []
}

export const actionTypes = {
    INIT_COMMENT: "INIT_COMMENT",
    ADD_COMMENT: "ADD_COMMENT",
    DELETE_COMMENT: "DELETE_COMMENT"
}

export const actions = {
    init_comment: function(comments){
        return {
            type: actionTypes.INIT_COMMENT,
            comments
        }
    },
    add_comment: function(comment){
        return {
            type: actionTypes.ADD_COMMENT,
            comment
        }
    },
    delete_comment: function(commentIndex){
        return {
            type: actionTypes.DELETE_COMMENT,
            commentIndex
        }
    }
}

export function reducer(state=initialState, action){
    switch(action.type){
        case actionTypes.INIT_COMMENT:
            return {
                ...state, comments: action.comments
            }
        case actionTypes.ADD_COMMENT:
            return {
                ...state, comments: [...state.comments, action.comment]
            }
        case actionTypes.DELETE_COMMENT:
            return {
                ...state, comments: [...state.comments.slice(0, action.commentIndex), ...state.comments.slice(action.commentIndex + 1)]
            }
        default:
            return state
    }
}