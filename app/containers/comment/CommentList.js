import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CommentListCom from './components/CommentList'
import {actions} from '../../reducers/comments'
import {bindActionCreators} from 'redux'

class CommentList extends Component{
    componentDidMount(){
        let href = window.location.href
        alert(href)
        let article_id = href.split("detail/")[1]
        this.props.initComments(article_id)
    }

    render(){
        return (
            <CommentListCom
                comments = {this.props.commentList}
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
        commentList: state.comment.commentList
    }
}

function mapDispatchToProps(dispatch){
    return {
        initComments: bindActionCreators(actions.init_comment, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentList)