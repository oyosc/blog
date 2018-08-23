import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Redirect} from 'react-router-dom'
import style from './style.css'
import ArticleList from './components/articleList/ArticleList'
import Login from './components/login/Login'
import {Pagination} from 'antd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions as frontActions} from '../../reducers/frontReducer'
import {actions as IndexActions} from '../../reducers/index'
import {Logined} from './components/logined/Logined'
import anStyle from '../../lib/animate.css'

const {get_article_list, get_article_detail} = frontActions

const tags = ['html', 'javascript', 'css', 'reactJs', 'redux', 'vue', '']

class Home extends Component {
    constructor (props) {
        super(props)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    }

    render () {
        const {tags} = this.props
        // localStorage.setItem('userInfo', JSON.stringify(this.props.userInfo));
        return (
            tags.length > 1 && this.props.match.params.tag && (tags.indexOf(this.props.match.params.tag) === -1 || this.props.location.pathname.lastIndexOf('\/') > 0)
                ?
                <Redirect to='404' />
                :
                <div className={`${style.container}`}>
                    <ArticleList
                        history={this.props.history}
                        data={this.props.articleList}
                        getArticleDetail={this.props.get_article_detail}
                    />
                    <div className={`${style.paginationContainer}`}>
                        <Pagination
                            defaultPageSize={5}
                            onChange={(pageNum) => {
                                this.props.get_article_list(this.props.match.params.tag || '', pageNum)
                            }}
                            current={this.props.pageNum}
                            total={this.props.total}
                        />
                    </div>
                </div>
        )
    }

    componentDidMount () {
        this.props.get_article_list(this.props.match.params.tag || '')
        let href = window.location.href
        if (href.indexOf('auth/github/callback') !== -1) {
            href = href.split('api')[1]
            this.props.login_with_github(href)
        }
    }

    // componentDidMount(){
    //     let href = window.location.href
    //     if(href.indexOf('/oauth/callback/?code=') !== -1){
    //         let result = href.split('/oauth/callback/?code=')
    //         this.props.logined_with_github(result[1])
    //         window.location.href = result[0]
    //     }
    // }
}

Home.defaultProps = {
    userInfo: {},
    pageNum: 1,
    total: 0,
    articleList: []
}

console.log(PropTypes)

Home.propsTypes = {
    userInfo: PropTypes.object.isRequired,
    pageNum: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    articleList: PropTypes.array.isRequired
}

function mapStateToProps (state) {
    return {
        userInfo: state.globalState.userInfo,
        tags: state.admin.tags,
        pageNum: state.front.pageNum,
        total: state.front.total,
        articleList: state.front.articleList
    }
}

function mapDispatchToProps (dispatch) {
    return {
        get_article_list: bindActionCreators(get_article_list, dispatch),
        get_article_detail: bindActionCreators(get_article_detail, dispatch),
        login_with_github: bindActionCreators(IndexActions.get_github_login, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
