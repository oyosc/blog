import React, {Component} from 'react'
import style from './index.css'

class Comment extends Component{
    render(){
        return (
            <div className={`${style.comment}`}>
                <div className={`${style.comment-user}`}>
                    <span>{this.props.comment.username}</span>
                </div>
                <p>{this.props.comment.content}</p>
            </div>
        )
    }
}

export default Comment