import React, {Component} from 'react'
import style from '../index.css'
import PropTypes from 'prop-types'

export default class CommentInputCom extends Component{
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

    handleUserNameBlur(event){
        if(this.props.onUserNameInputBlur){
            this.props.onUserNameInputBlur(event.target,value)
        }
    }

    render(){
        return (
            <div className={`${style.commentInput}`}>
                <div className={`${style.commentField}`}>
                    <span className={`${style.commentFieldName}`}>用户名: </span>
                    <div className={`${style.commentFieldInput}`}>
                        <input value={this.state.comment_user} onChange={this.handleUserNameBlur.bind(this)} onBlur={this.handleUserNameBlur.bind(this)}/>
                    </div>
                </div>
                <div className={`${style.commentField}`}>
                    <span className={`${style.commentFieldName}`}>评论内容: </span>
                    <div className={`${style.commentFieldInput}`}>
                        <textarea ref={(textarea)=> this.textarea = textarea }value={this.state.content} onChange={this.handleContentChange.bind(this)}/>
                    </div>
                </div>
                <div className={`${style.commentFieldButton}`}>
                    <button onClick = {this.handleSubmit.bind(this)}>
                        发布
                    </button>
                </div>
            </div>
        )
    }
}

CommentInputCom.defaultProps = {
    username: ''
}

CommentInputCom.PropTypes = {
    username: PropTypes.any,
    onSubmit: PropTypes.func,
    onUserNameInputBlur: PropTypes.func
}