import React, {Component} from 'react'
import PropTypes from 'prop-types'
import style from './index.css'

class Comment extends Component{

    constructor(){
        super()
        this.state = {timeString: ''}
    }

    componentWillMount(){
        this._updateTimeString()
        this._timer = setInterval(this._updateTimeString.bind(this), 5000)
    }

    componentWillUnmount(){
        clearInterval(this._timer)
    }

    handleDeleteComment(){
        if(this.props.onDeleteComment){
            this.props.onDeleteComment(this.props.index)
        }
    }

    _updateTimeString(){
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) /1000
        this.setState({
            timeString: duration > 60 ? `${Math.round(duration/60)}分钟前` : `${Math.round(Math.max(duration, 1))} 秒前`
        })
    }

    _getProcessedContent (content) {
        return content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
    }

    render(){
        return (
            <div className={`${style.comment}`}>
                <div className={`${style.commentUser}`}>
                    <span>{this.props.commentUsername}</span>
                </div>
                <p dangerouslySetInnerHTML={{
                    __html: this._getProcessedContent(comment.content)
                }} />createdTime
                <span className={`${style.commentCreatedTime}`}>
                    {this.state.timeString}
                </span>
                <span className={`${style.commentDel}`} onClick = {this.handleDeleteComment.bind(this)}>
                    删除
                </span>
            </div>
        )
    }
}

Comment.PropTypes = {
    comment: PropTypes.object.isRequired,
    onDeleteComment: PropTypes.func,
    index: PropTypes.number
}

export default Comment