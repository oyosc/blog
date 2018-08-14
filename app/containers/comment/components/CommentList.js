import React, {Component} from 'react'
import Comment from '../Comment'
import PropTypes from 'prop-types'
import {Pagination} from 'antd'

class CommentListCom extends Component{

    render(){
        return (
            <div>{
                this.props.comments.map((comment) => {
                    console.log(comment)
                    return (
                        <div>
                            <Comment 
                                comment={comment} 
                                userInfo={this.props.userInfo}
                                addLikeHot = {this.props.addLikeHot}
                                deleteLikeHot = {this.props.deleteLikeHot}
                            />
                        </div>
                    )
                })
            }
            <Pagination
                onChange={(pageNum) =>{
                    this.props.showComments(this.props.article_id, pageNum);
                }}
                defaultCurrent={1}
                defaultPageSize={5}
                total={this.props.total}
            />
            </div>
        )
    }
}

CommentListCom.defaultProps = {
    comments: []
}

CommentListCom.PropTypes = {
    comments: PropTypes.array
}

export default CommentListCom