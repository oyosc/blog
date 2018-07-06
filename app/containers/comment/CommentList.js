import React, {Component} from 'react'
import Comment from './Comment'

class CommentList extends Component{
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
                            <Comment comment={comment}  key={i} />
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

export default CommentList