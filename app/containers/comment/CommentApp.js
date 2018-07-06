import React, {Component} from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import style from './index.css'

class CommentApp extends Component{
    constructor(){
        super()
        this.state = {
            comments: []
        }
    }

    handleSubmitContent(comment){
        this.state.comments.push(comment)
        this.setState({
            comments: this.state.comments
        })
    }

    render(){
        return (
            <div className={`${style.wrapper}`}>
                <CommentInput onSubmit={this.handleSubmitContent.bind(this)}/>
                <CommentList  comments={this.state.comments} />
            </div>
        )
    }
}

export default CommentApp