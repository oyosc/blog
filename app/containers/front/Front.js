import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import style from './style.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import Login from '../home/components/login/Login'
import {Logined} from '../home/components/logined/Logined'
import {actions as IndexActions} from '../../reducers/index'
import NotFound from '../../components/notFound/NotFound'
import {Home} from '../home/index'
import Banner from '../components/banner/Banner'
import Menus from '../components/menu/Menus'
import {Detail} from '../detail'
import {actions} from '../../reducers/adminManagerTags'
import {actions as FrontActions} from '../../reducers/frontReducer'
const {get_all_tags} = actions
const {get_article_list} = FrontActions
const {user_auth} = IndexActions

class Front extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        const {url} = this.props.match
        console.log(url)
        const {login, login_with_github, logout} = this.props
        if (this.props.userInfo.userId) {
            localStorage.setItem('userInfo', JSON.stringify({userId: this.props.userInfo.userId, username: this.props.userInfo.username, userType: this.props.userInfo.userType, avatarUrl: this.props.userInfo.avatar_url, github_url: this.props.userInfo.github_url}))
        }
        console.log('path:', this.props.history.location)
        return (
            <div>
                <div>
                    <Banner />
                    <Menus getArticleList={(tag) => this.props.get_article_list(tag, 1)} categories={this.props.categories} history={this.props.history} />
                </div>
                <div className={`${style.container}`}>
                    <div className={`${style.contentContainer}`}>
                        <div className={`${style.content}`}>
                            <Switch>
                                {/* <Redirect from='/oauth/callback/' to='/' /> */}
                                <Route exact path={url} component={Home} history={this.props.history}/>
                                <Route path={'/detail/:id'} component={Detail} />
                                <Route path={'/:tag'} component={Home} />
                                <Route path={'/api/auth/github/:callback?'} history={this.props.history} component={Home} />
                                <Route path={'/api/auth/github/(:callback?)'} history={this.props.history} component={Home} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                        <div className={`${style.loginContainer}`}>
                            {
                                this.props.userInfo.userId ?
                                    <Logined logout={logout} history={this.props.history} userInfo={this.props.userInfo} /> :
                                    <Login login={login} login_with_github={login_with_github}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount () {
        this.props.get_all_tags()
    }

    componentWillMount () {
        this.props.user_auth()
    }
}

Front.defaultProps = {
    categories: []
}

Front.propTypes = {
    categories: PropTypes.array.isRequired
}

function mapStateToProps (state) {
    return {
        userInfo: state.globalState.userInfo,
        categories: state.admin.tags
    }
}

function mapDispatchToProps (dispatch) {
    return {
        login: bindActionCreators(IndexActions.get_login, dispatch),
        login_with_github: bindActionCreators(IndexActions.get_github_code, dispatch),
        get_all_tags: bindActionCreators(get_all_tags, dispatch),
        get_article_list: bindActionCreators(get_article_list, dispatch),
        logout: bindActionCreators(IndexActions.logout, dispatch),
        user_auth: bindActionCreators(user_auth, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Front)
