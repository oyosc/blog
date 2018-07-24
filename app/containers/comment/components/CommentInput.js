import React, {Component} from 'react'
import style from './index.css'
import PropTypes from 'prop-types'

export default class CommentInput extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: props.username,
            content: ''
        }
    }

    componentDidMount(){
        this.textarea.focus()
    }

    handleUserNameChange(event){
        this.setState({comment_user: event.target.value})
    }

    handleContentChange(event){
        this.setState({content: event.target.value})
    }

    handleSubmit(){
        if(this.props.onSubmit){
            const {comment_user, content} = this.state
            this.props.onSubmit({comment_user, content, createdTime: +new Date()})
        }
        this.setState({content: ""})
    }

    handleUsernameBlur(event){
        if(this.props.onUserNameInputBlur){
            this.props.onUserNameInputBlur(event.target,value)
        }
    }

    render(){
        return (
            <div className={`${style.comment-input}`}>
                <div className={`${style.comment-field}`}>
                    <span className={`${style.comment-field-name}`}>用户名: </span>
                    <div className={`${style.comment-field-input}`}>
                        <input value={this.state.comment_user} onChange={this.handleUserNameChange.bind(this)} onBlur={this.handleUsernameBlur.bind(this)}/>
                    </div>
                </div>
                <div className={`${style.comment-field}`}>
                    <span className={`${style.comment-field-name}`}>评论内容: </span>
                    <div className={`${comment-field-input}`}>
                        <textarea ref={(textarea)=> this.textarea = textarea }value={this.state.content} onChange={this.handleContentChange.bind(this)}/>
                    </div>
                </div>
                <div className='comment-field-button'>
                    <button onClick = {this.handleSubmit.bind(this)}>
                        发布
                    </button>
                </div>
            </div>
        )
    }
}

CommentInput.defaultProps = {
    username: ''
}

CommentInput.PropTypes = {
    username: PropTypes.any,
    onSubmit: PropTypes.func,
    onUserNameInputBlur: PropTypes.func
}