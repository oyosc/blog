const initialState = {
    list: [],
    pageNum: 1,
    total: 0
}

export const actionTypes = {
    'GET_ALL_COMMENTS': 'GET_ALL_COMMENTS',
    'RESOLVE_GET_ALL_COMMENTS': 'RESOLVE_GET_ALL_COMMENTS',
    'DELETE_COMMENT': "DELETE_COMMENT",
    "DEAL_COMMENT": "DEAL_COMMENT"
}

export const actions = {
    get_all_comments: function(pageNum=1){
        return {
            type: actionTypes.GET_ALL_COMMENTS,
            pageNum: pageNum
        }
    },
    delete_comment: function(comment_id){
        return {
            type: actionTypes.DELETE_COMMENT,
            comment_id
        }
    },
    deal_comment: function(comment_id, deal_type){
        return {
            type: actionTypes.DEAL_COMMENT,
            deal_type,
            comment_id
        }
    }
}

export function reducer(state = initialState, action){
    switch(action.type){
        case actionTypes.RESOLVE_GET_ALL_COMMENTS:
            return {
                list: action.data.list,
                pageNum: action.data.pageNum,
                total: action.data.total
            }
        default:
            return state;
    }
}