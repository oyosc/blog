import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {actions} from '../../reducers/comments'
import CommentInputCom from './components/CommentInput';
import { bindActionCreators } from 'redux';

class CommentInput extends Component{
    constructor(){
        super()
        this.state = {username: ''}
    }

    componentWillMount(){
        this._loadUsername
    }

    _loadUsername(){
        const username = localStorage.getItem('username')
        if(username){
            this.setState({username})
        }
    }

    _saveUsername(username){
        localStorage.setItem('username', username)
    }

    handleSubmitComment(comment){
        if(!comment) return
        if(!comment.username)   return alert('请输入用户名')
        if(!comment.content)    return alert('请输入评论内存')
        const {comments} = this.props
        const newComments = [...comments, comment]
        localStorage.setItem('commments', JSON.stringify(newComments))
        if(this.props.onSubmit){
            this.props.onSubmit(comment)
        }
    }

    render(){
        return (
            <CommentInputCom
                username = {this.state.username}
                onUserNameInputBlur={this._saveUsername.bind(this)}
                onSubmit = {this.handleSubmitComment.bind(this)}
            />
        )
    }
}

CommentInput.defaultProps = {
    comments: []
}

CommentInput.PropTypes = {
    comments: PropTypes.array,
    onSubmit: PropTypes.func
}

function mapStateToProps(state){
    return {
        comments: state.comments
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