import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CommentListCom from './components/CommentList'
import {actions} from '../../reducers/comments'
import {bindActionCreators} from 'redux'

class CommentList extends Component{
    componentDidMount(){
        let href = window.location.href
        let article_id = href.split("detail/")[1]
        this.props.initComments(article_id)
    }

    render(){
        return (
            <CommentListCom
                comments = {this.props.commentList}
                userInfo = {this.props.userInfo}
                addLikeHot = {this.props.addLikeHot}
                deleteLikeHot = {this.props.deleteLikeHot}
                showComments = {this.props.initComments}
                article_id = {this.props.article_id}
                total = {this.props.total}
            />
        )
    }
}

CommentList.defaultProps = {
    commentList: []
}

CommentList.PropTypes = {
    commentList: PropTypes.array,
    initComments: PropTypes.func,
    article_id: PropTypes.string
}

function mapStateToProps(state){
    const {_id} = state.front.articleDetail
    return {
        article_id: _id,
        commentList: state.comment.commentList,
        userInfo: state.globalState.userInfo,
        total: state.comment.total
    }
}

function mapDispatchToProps(dispatch){
    return {
        initComments: bindActionCreators(actions.init_comment, dispatch),
        addLikeHot: bindActionCreators(actions.add_likehot, dispatch),
        deleteLikeHot: bindActionCreators(actions.delete_likehot, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentList)