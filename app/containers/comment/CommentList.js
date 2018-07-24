import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CommentList from './components/CommentList'
import {actions} from '../../reducers/comments'
import {bindActionCreators} from 'redux'

class CommentList extends Component{
    componentWillMount(){
        this._loadComments()
    }

    _loadComments(){
        let comments = localStorage.getItem('comments')
        comments = comments ? JSON.parse(comments) : []
        this.props.initComments(comments)
    }

    handleDeleteComment(index){
        let {comments} = this.props
        let newComments = [
            ...comments.slice(0, index),
            ...comments.slice(index+1)
        ]
        localStorage.setItem('comments', JSON.stringify(newComments))
        if(this.props.onDeleteComment){
            this.props.onDeleteComment(index)
        }
    }

    render(){
        return (
            <CommentList
                comments = {this.props.comments}
                onDeleteComment={this.handleDeleteComment.bind(this)} />
        )
    }
}

CommentList.defaultProps = {
    comments: []
}

CommentList.PropTypes = {
    comments: PropTypes.array,
    initComments: PropTypes.func,
    onDeleteComment: PropTypes.func
}

function mapStateToProps(state){
    return {
        comments: state.comments
    }
}

function mapDispatchToProps(dispatch){
    return {
        initComments: bindActionCreators(actions.init_comment, dispatch),
        onDeleteComment: bindActionCreators(actions.delete_comment, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentList)