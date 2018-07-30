import React, {Component} from 'react'
import style from '../index.css'
import PropTypes from 'prop-types'

export default class CommentInputCom extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: props.username,
            content: ''
        }
    }

    // componentDidMount(){
    //     this.textarea.focus()
    // }

    handleUserNameChange(event){
        this.setState({comment_user: event.target.value})
    }

    handleContentChange(event){
        this.setState({content: event.target.value})
    }

    handleSubmit(){
        if(this.props.onSubmit){
            const {comment_user, content} = this.state
            this.props.onSubmit({comment_user, content, createdTime: +new Date()})
        }
        this.setState({content: ""})
    }

    handleUserNameBlur(event){
        if(this.props.onUserNameInputBlur){
            this.props.onUserNameInputBlur(event.target,value)
        }
    }

    render(){
        return (
            <div>
                <div lang="en-US" className={`${style.gitmentContainer} ${style.gitmentEditorContainer}`}>
                    <a className={`${style.gitmentEditorAvatar}`} href="https://github.com/oyosc" target="_blank">
                        <img className={`${style.gitmentEditorAvatarImg}`} src="https://avatars1.githubusercontent.com/u/13896491?v=4" />
                    </a>
                    <div className={`${style.gitmentEditorMain}`}>
                        <div className={`${style.gitmentEditorHeader}`}>
                            <nav className={`${style.gitmentEditorTabs}`}>
                                <button className={`${style.gitmentEditorTab} ${style.gitmentSelected}`} >Write</button>
                                {/* <button className={`${style.gitmentEditorTab}`}>Preview</button> */}
                            </nav>
                            <div className={`${style.gitmentEditorLogin}`}>
                                <a className={`${style.gitmentEditorLogoutLink}`} >Logout</a>
                            </div>
                        </div>
                        <div className={`${style.gitmentEditorBody}`}>
                            <div className={`${style.gitmentEditorWriteField}`}>
                                <textarea placeholder="Leave a comment" title=""></textarea>
                            </div>
                            <div className={`${style.gitmentEditorPreviewField} ${style.gitmentHidden}`}>
                                <div className={`${style.gitmentEditorPreview} ${style.gitmentMarkdown}`}></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.gitmentEditorFooter}`}>
                        {/* <a className={`${style.gitmentEditorFooterTip}`} href="https://guides.github.com/features/mastering-markdown/" target="_blank">
                            Styling with Markdown is supported
                        </a> */}
                        <button className={`${style.gitmentEditorSubmit}`} title="">Comment</button>
                    </div>
                </div>
            </div>
        )
    }
}

CommentInputCom.defaultProps = {
    username: ''
}

CommentInputCom.PropTypes = {
    username: PropTypes.any,
    onSubmit: PropTypes.func,
    onUserNameInputBlur: PropTypes.func
}