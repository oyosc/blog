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

    _updateTimeString(){
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) /1000
        this.setState({
            timeString: duration > 60 ? `${Math.round(duration/60)}分钟前` : `${Math.round(Math.max(duration, 1))} 秒前`
        })
    }

    render(){
        return (
            <div className={`${style.comment}`}>
                <div className={`${style.comment-user}`}>
                    <span>{this.props.comment.username}</span>
                </div>
                <p>{this.props.comment.content}</p>
                <span className={`${style.comment-createdTime}`}>
                    {this.state.timeString}
                </span>
            </div>
        )
    }
}

Comment.PropTypes = {
    comment: PropTypes.object.isRequired
}

export default Comment