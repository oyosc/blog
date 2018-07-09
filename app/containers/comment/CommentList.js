import React, {Component} from 'react'
import Comment from './Comment'
import PropTypes from 'prop-types'

class CommentList extends Component{

    handleDeleteComment(index){
        if(rhis.props.index){
            this.props.onDeleteComment(index)
        }
    }

    render(){
        const comments = [
            {username: "Jerry", content: "hello"},
            {username: "Tony", content: "World"},
            {username: "Lucy", content: "Good"}
        ]

        return (
            <div>{
                comments.map((comment, i) => {
                    return (
                        <div key={i}>
                            <Comment comment={comment} index={i} onDeleteComment={this.handleDeleteComment.bind(this)}  key={i} />
                        </div>
                    )
                })
            }
            </div>
        )
    }
}

CommentList.defaultProps = {
    comments: []
}

CommentList.PropTypes = {
    comments: PropTypes.array,
    onDeleteComment: PropTypes.func
}

export default CommentList