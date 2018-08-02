import React, {Component} from 'react'
import style from '../index.css'
import PropTypes from 'prop-types'

export default class CommentInputCom extends Component{
    constructor(props){
        super(props),
        this.state = {
            content: ''
        }
    }

    // componentDidMount(){
    //     this.textarea.focus()
    // }

    handleSubmit(){
        if(this.props.userInfo.userId){
            alert(this.state.content)
        }
    }

    handleContentChange(e){
        this.setState({
            content: e.target.value
        })
    }

    render(){
        return (
            <div>
                <div lang="en-US" className={`${style.gitmentContainer} ${style.gitmentEditorContainer}`}>
                    <a className={`${style.gitmentEditorAvatar}`} href={this.props.userInfo.githubUrl} target="_blank">
                        <img className={`${style.gitmentEditorAvatarImg}`} src={this.props.userInfo.userId ? this.props.userInfo.avatarUrl : require('../../home/components/logined/timg.jpeg')} />
                    </a>
                    <div className={`${style.gitmentEditorMain}`}>
                        <div className={`${style.gitmentEditorHeader}`}>
                            <nav className={`${style.gitmentEditorTabs}`}>
                                <button className={`${style.gitmentEditorTab} ${style.gitmentSelected}`} >Write</button>
                                {/* <button className={`${style.gitmentEditorTab}`}>Preview</button> */}
                            </nav>
                        </div>
                        <div className={`${style.gitmentEditorBody}`}>
                            <div className={`${style.gitmentEditorWriteField}`}>
                                {this.props.userInfo.userId ? <textarea placeholder="Leave a comment" value={this.state.content} ref={(textarea)=>this.textarea = textarea} onChange={this.handleContentChange.bind(this)} ></textarea> : <textarea placeholder="please login first" readonly="readonly"></textarea>}
                            </div>
                            {/* <div className={`${style.gitmentEditorPreviewField} ${style.gitmentHidden}`}>
                                <div className={`${style.gitmentEditorPreview} ${style.gitmentMarkdown}`}></div>
                            </div> */}
                        </div>
                    </div>
                    <div className={`${style.gitmentEditorFooter}`}>
                        {/* <a className={`${style.gitmentEditorFooterTip}`} href="https://guides.github.com/features/mastering-markdown/" target="_blank">
                            Styling with Markdown is supported
                        </a> */}
                        <button className={`${style.gitmentEditorSubmit}`} title="" onClick={this.handleSubmit.bind(this)}>Comment</button>
                    </div>
                </div>
            </div>
        )
    }
}


CommentInputCom.PropTypes = {
    userInfo: PropTypes.any,
    onSubmit: PropTypes.func
}