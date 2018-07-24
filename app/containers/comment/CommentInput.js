import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {actions} from '../../reducers/comments'
import Comment from './Comment';

class CommentInput extends Component{
    constructor(){
        super()
        this.state = {username: ''}
    }

    componentWillMount(){
        this._loadUsername
    }

    _loadUsername(){
        const username = localStorage.getItem('username')
        if(username){
            this.setState({username})
        }
    }

    __saveUsername(username){
        localStorage.setItem('username', username)
    }
}

CommentInput.defaultProps = {
    comments: []
}

CommentInput.PropTypes = {
    comments: PropTypes.array,
    onSubmit: PropTypes.func
}