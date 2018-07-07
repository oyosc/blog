import React, {Component} from 'react'
import style from './index.css'

class CommentInput extends Component{
    constructor(){
        super()
        this.state = {
            comment_user: '',
            content: ''
        }
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

    _saveUserName(comment_user){
        localStorage.setItem("comment_user", comment_user)
    }

    handleUsernameBlur(event){
        this._saveUserName(event.target.value)
    }

    _loadUserName(){
        const comment_user = localStorage.getItem("comment_user")
        this.setState({comment_user})
    }

    componentWillMount(){
        this._loadUserName()
    }

    componentDidMount(){
        this.textarea.focus()
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

export default CommentInput