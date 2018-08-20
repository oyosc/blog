import React, {Component} from 'react'
import PropTypes from 'prop-types'
import style from './index.css'

class Comment extends Component {
    constructor () {
        super()
        this.state = {
            timeString: ''
        }
    }

    likeHot () {
        if (!this.props.userInfo.userId) {
            alert('please login first')
            return
        }

        if (this.props.comment.isLike) {
            this.props.deleteLikeHot(this.props.comment._id)
        } else {
            this.props.addLikeHot(this.props.comment._id)
        }
    }

    toLocalDate (timeString) {
        let unixTime = new Date(parseInt(timeString))
        return unixTime.getFullYear() + '/' + (unixTime.getMonth() + 1) + '/' + unixTime.getDate() + '/' + unixTime.getHours() + ':' + unixTime.getMinutes() + ':' + unixTime.getSeconds()
    }

    componentWillMount () {
        this._updateTimeString()
        this._timer = setInterval(this._updateTimeString.bind(this), 5000)
    }
    componentWillUnmount () {
        clearInterval(this._timer)
    }

    _updateTimeString () {
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) / 1000
        this.setState({
            timeString: duration > 60 ? (duration > 3600 ? (duration > 86400 ? (duration > 259200 ? this.toLocalDate(comment.createdTime) : `${Math.round(duration / 3600)}天前`) : `${Math.round(duration / 3600)}小时前`) : `${Math.round(duration / 60)}分钟前`) : `${Math.round(Math.max(duration, 1))} 秒前`
        })
    }

    render () {
        return (
            <div>
                <div lang="en-US" className={`${style.gitmentContainer} ${style.gitmentCommentsContainer}`}>
                    <ul className={`${style.gitmentCommentsList}`}>
                        <li className={`${style.gitmentComment}`}>
                            <a className={`${style.gitmentCommentAvatar}`} href={this.props.comment.userInfo.github_url} target="_blank">
                                <img className={`${style.gitmentCommentAvatarImg}`} src={this.props.comment.userInfo.avatar ? this.props.comment.userInfo.avatar : require('../home/components/logined/timg.jpeg')} />
                            </a>
                            <div className={`${style.gitmentCommentMain}`}>
                                <div className={`${style.gitmentCommentHeader}`}>
                                    <a className={`${style.gitmentCommentName}`} href={this.props.comment.userInfo.github_url} target="_blank">
                                        {this.props.comment.userInfo.github_name}{' '}
                                    </a>
                                    commented on
                                    <span> {this.state.timeString} </span>
                                    <div className={this.props.comment.isLike === 1 ? `${style.gitmentCommentLikeBtn} ${style.liked}` : `${style.gitmentCommentLikeBtn}`}><svg className={`${style.gitmentHeartIcon}`} onClick = {this.likeHot.bind(this)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"></path></svg> {this.props.comment.likeHot}</div>
                                </div>
                                <div className={`${style.gitmentCommentBody} ${style.gitmentMarkdown}`}><p>{this.props.comment.content}</p></div>
                            </div>
                            <img className={`${style.gitmentHidden}`} src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

Comment.PropTypes = {
    comment: PropTypes.object.isRequired,
    userInfo: PropTypes.any
}

export default Comment
