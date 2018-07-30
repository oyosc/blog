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
            <div>
                <div lang="en-US" className={`${style.gitment-container}` `${style.gitment-comments-container}`}>
                    <ul className={`${style.gitment-comments-list}`}>
                        <li className={`${style.gitment-comment}`}>
                            <a className={`${style.gitment-comment-avatar}`} href="https://github.com/oyosc" target="_blank">
                                <img className={`${style.gitment-comment-avatar-img}`} src="https://avatars1.githubusercontent.com/u/13896491?v=4" />
                            </a>
                            <div className={`${style.gitment-comment-main}`}>
                                <div className={`${style.gitment-comment-header}`}>
                                    <a className={`${style.gitment-comment-name}`} href="https://github.com/oyosc" target="_blank">
                                        oyosc
                                    </a>
                                    commented on
                                    <span title="Sun May 21 2017 17:21:39 GMT+0800 (中国标准时间)">Sun May 21 2017</span>
            
                                    <div className={`${style.gitment-comment-like-btn}` `${style.liked}`}><svg className={`${style.gitment-heart-icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"></path></svg> 1</div>
                                </div>
                                <div className={`${style.gitment-comment-body}` `${style.gitment-markdown}`}><p>测试走起</p></div>
                            </div>
                            <img className={`${style.gitment-hidden}`} src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                        </li>
                    </ul>
                </div>
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