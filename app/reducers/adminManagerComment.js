const initialState = {
    list: [],
    pageNum: 1,
    total: 0,
    whether_audit: '0'
}

export const actionTypes = {
    'GET_ALL_COMMENTS': 'GET_ALL_COMMENTS',
    'RESOLVE_GET_ALL_COMMENTS': 'RESOLVE_GET_ALL_COMMENTS',
    'DELETE_COMMENT': "DELETE_COMMENT",
    "AUDIT_COMMENT": "AUDIT_COMMENT",
    "CONFIG_AUDIT": "CONFIG_AUDIT",
    "GET_AUDIT": "GET_AUDIT",
    "RESPONSE_GET_AUDIT": "RESPONSE_GET_AUDIT"
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
    audit_comment: function(comment_id, audit_type){
        if(audit_type === true){
            audit_type = '1'
        }else{
            audit_type = '0'
        }

        return {
            type: actionTypes.AUDIT_COMMENT,
            audit_type,
            comment_id
        }
    },
    config_audit: function(audit_status){
        if(audit_status === true){
            audit_status = '1'
        }else{
            audit_status = '0'
        }
        return {
            type: actionTypes.CONFIG_AUDIT,
            audit_status
        }
    },
    get_audit: function(){
        return {
            type: actionTypes.GET_AUDIT,
        }
    }
}

export function reducer(state = initialState, action){
    switch(action.type){
        case actionTypes.RESOLVE_GET_ALL_COMMENTS:
        console.log("RESOLVE_GET_ALL_COMMENTS")
        console.log(action.data)
            return {
                ...state,
                list: [...action.data.list],
                pageNum: action.data.pageNum,
                total: action.data.total
            }
        case actionTypes.RESPONSE_GET_AUDIT:
            return {
                ...state,
                whether_audit: action.data.audit_status
            }
        default:
            return state;
    }
}