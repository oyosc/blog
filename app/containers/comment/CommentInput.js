import React, {Component} from 'react'
import style from './index.css'

class CommentInput extends Component{
    constructor(){
        super()
        this.state = {
            username: '',
            content: ''
        }
    }

    handleUserNameChange(event){
        this.setState({username: event.target.value})
    }

    handleContentChange(event){
        this.setState({content: event.target.value})
    }

    render(){
        return (
            <div className={`${style.comment-input}`}>
                <div className={`${style.comment-field}`}>
                    <span className={`${style.comment-field-name}`}>用户名: </span>
                    <div className={`${style.comment-field-input}`}>
                        <input value={this.state.username} onChange={this.handleUserNameChange.bind(this)}/>
                    </div>
                </div>
                <div className={`${style.comment-field}`}>
                    <span className={`${style.comment-field-name}`}>评论内容: </span>
                    <div className={`${comment-field-input}`}>
                        <textarea value={this.state.content} onChange={this.handleContentChange.bind(this)}/>
                    </div>
                </div>
                <div className='comment-field-button'>
                    <button>
                        发布
                    </button>
                </div>
            </div>
        )
    }
}

export default CommentInput