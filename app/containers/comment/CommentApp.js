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

    componentWillMount(){
        this._loadComments()
    }

    _saveComments(comments){
        localStorage.setItem("comments", JSON.stringify(comments))
    }

    _loadComments(){
        let comments = localStorage.getItem("comments")
        if(comments){
            comments = JSON.parse(comments)
            this.setState({comments})
        }
    }

    handleDeleteComment(index){
        const comments = this.state.comments
        comments.splice(index, 1)
        this.setState({comments})
        this._saveComments(comments)
    }

    handleSubmitContent(comment){
        if(!comment) return
        if(!comment.username) return alert("请输入用户名")
        if(!comment.content) return alert("请输入评论内容")
        const comments = this.state.comments
        comments.push(comment)
        this.setState({
            comments: this.state.comments
        })
        this._saveComments(comments)
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