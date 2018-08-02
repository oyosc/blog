import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {actions} from '../../reducers/comments'
import CommentInputCom from './components/CommentInput';
import { bindActionCreators } from 'redux';

class CommentInput extends Component{
    constructor(){
        super()
        this.state = {username: ''}
    }

    render(){
        return (
            <CommentInputCom
            onSubmit = {this.props.onSubmit}
            userInfo = {this.props.userInfo}
            />
        )
    }
}

CommentInput.defaultProps = {
    comments: []
}

CommentInput.PropTypes = {
    comments: PropTypes.array,
    onSubmit: PropTypes.func
}

function mapStateToProps(state){
    return {
        userInfo: state.globalState.userInfo
    }
}

function mapDispatchToProps(dispatch){
    return {
        onSubmit: bindActionCreators(actions.add_comment, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInput)