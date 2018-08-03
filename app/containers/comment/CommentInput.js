import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {actions} from '../../reducers/comments'
import CommentInputCom from './components/CommentInput';
import { bindActionCreators } from 'redux';

class CommentInput extends Component{
    constructor(){
        super()
    }

    render(){
        return (
            <CommentInputCom
            onSubmit = {this.props.onSubmit}
            userInfo = {this.props.userInfo}
            article_id = {this.props.article_id}
            comments = {this.props.comments}
            />
        )
    }
}

CommentInput.PropTypes = {
    onSubmit: PropTypes.func
}

function mapStateToProps(state){
    const {_id} = state.front.articleDetail
    return {
        userInfo: state.globalState.userInfo,
        article_id: _id,
        comments: state.comment.comments
    }
}

function mapDispatchToProps(dispatch){
    return {
        onSubmit: bindActionCreators(actions.add_comment, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInput)