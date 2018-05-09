import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import style from './style.css'
import {Switch, Route} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import Login from '../home/components/login/Login'
import {Logined} from '../home/components/logined/logined'
import {actions as IndexActions} from '../../reducers/index'

class Front extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {url} = this.props.match;
        const {login} = this.props;
        if(this.props.userInfo.userId){
            localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
        }
        if(localStorage.getItem('userInfo')){
            this.props.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        }
        return (
            <div>
                <div className={`${style.container}`}>
                    <div className={`${style.loginContainer}`}>
                        {
                            this.props.userInfo.userId?
                            <Logined history={this.props.history} userInfo={this.props.userInfo} />:
                            <Login login={login} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        userInfo: state.globalState.userInfo
    }
}

function mapDispatchToProps(dispatch){
    return {
        login: bindActionCreators(IndexActions.get_login, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Front)