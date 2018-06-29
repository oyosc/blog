import React, {Component} from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import style from './index.css'

class CommentApp extends Component{
    render(){
        return (
            <div className={`${style.wrapper}`}>
                <CommentInput />
                <CommentList />
            </div>
        )
    }
}

export default CommentApp