import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

import NotFound from '../../components/notFound/NotFound'
import AdminMenu from '../../components/adminMenu/AdminMenu'
import AdminIndex from '../adminIndex/AdminIndex'
import style from './style.css'
import {bindActionCreators} from 'redux'
import {actions} from '../../reducers/admin'
import PureRenderMixin from 'react-addons-pure-render-mixin'

const {change_location_admin} = actions;

class Admin extends Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    }

    render(){
        const {url} = this.props.match;
        if(this.props.userInfo&&this.props.userInfo.userType){
            return (
                <div>
                    {
                        this.props.userInfo.userType === 'admin' ?
                            <div className={style.container}>
                                <div className={style.menuContainer}>
                                    <AdminMenu history={this.props.history}
                                        url={this.props.adminUrl}
                                        changeUrl={this.props.change_location_admin}
                                    />
                                </div>
                                <div className={style.contentContainer}>
                                    <Switch>
                                        <Route exact path={url} component={AdminIndex} />
                                        {/* <Route path={`${url}/managerUser`} component={AdminManagerUser} /> */}
                                    </Switch>
                                </div>
                            </div> :
                            <Redirect to='/' />
                    }
                </div>
            )
        }else{
            if(localStorage.getItem('userInfo')){
                let userInfo = localStorage.getItem('userInfo');
                let parseUserInfo = JSON.parse(userInfo)
                return (
                    <div>
                        {
                            parseUserInfo['userType'] === 'admin' ?
                                <div className={style.container}>
                                    <div className={style.menuContainer}>
                                        <AdminMenu history={this.props.history}
                                            url={this.props.adminUrl}
                                            changeUrl={this.props.change_location_admin}
                                        />
                                    </div>
                                    <div className={style.contentContainer}>
                                        <Switch>
                                            <Route exact path={url} component={AdminIndex} />
                                            {/* <Route path={`${url}/managerUser`} component={AdminManagerUser} /> */}
                                        </Switch>
                                    </div>
                                </div> :
                                <Redirect to='/' />
                        }
                    </div>
                )
            }else{
                alert("no");
                return <Redirect to='/' />
            }
        }
    }

    componentWillReceiveProps(){
        this.props.change_location_admin(window.location.pathname.replace(/\/admin/, '')|| '/');
    }
}

Admin.defaultProps = {
    adminUrl: '/'
}

Admin.propTypes = {
    adminUrl: PropTypes.string,
    change_location_admin: PropTypes.func
}

function mapStateToProps(state){
    const {url} = state.admin.adminGlobalState;
    return {
        adminUrl: url,
        userInfo: state.globalState.userInfo
    }
}

function mapDispatchToProps(dispatch){
    return {
        change_location_admin: bindActionCreators(change_location_admin, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin)