import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from '../../reducers/adminManagerComment'
import {Table, Pagination, Switch} from 'antd'
import style from './style.css'

function toLocalDate (timeString) {
    let unixTime = new Date(parseInt(timeString))
    return unixTime.getFullYear() + '/' + (unixTime.getMonth() + 1) + '/' + unixTime.getDate() + '/' + unixTime.getHours() + ':' + unixTime.getMinutes() + ':' + unixTime.getSeconds()
}

const {get_all_comments, audit_comment, config_audit, get_audit} = actions

class AdminManagerComment extends Component {
    constructor (props) {
        super(props)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    }

    columns = [{
        title: '文章标题',
        dataIndex: 'article_title',
        key: 'article_title',
        render: (text, row) => <a target='_blank' href={`/detail/${row.article_id}`}>{text}</a>
    }, {
        title: '评论内容',
        dataIndex: 'comment_content',
        key: 'comment_content'
    }, {
        title: '评论时间',
        dataIndex: 'comment_time',
        key: 'comment_time',
        render: (comment_time) => { return toLocalDate(comment_time) }
    }, {
        title: '评论用户',
        dataIndex: 'comment_user',
        key: 'comment_user'
    }, {
        title: '审核',
        dataIndex: 'whether_audit',
        key: 'whether_audit',
        render: (whether_audit, row) => {
            if (whether_audit === '1') {
                return <Switch checkedChildren="已审核" unCheckedChildren="未审核" checked={true} onChange = {this.props.audit_comment.bind(this, row.comment_id)}/>
            } else {
                return <Switch checkedChildren="已审核" unCheckedChildren="未审核" checked={false} onChange = {this.props.audit_comment.bind(this, row.comment_id)}/>
            }
        }
    }]

    componentDidMount () {
        if (this.props.list.length === 0) {
            this.props.get_all_comments()
        }
        this.props.get_audit()
    }

    render () {
        return (
            <div>
                <h2>评论管理</h2>
                {this.props.whether_audit === '0' ? <Switch checkedChildren="开启审核" unCheckedChildren="关闭审核" checked={false} onChange={this.props.config_audit.bind(this)} /> : <Switch checkedChildren="开启审核" unCheckedChildren="关闭审核" checked={true} onChange={this.props.config_audit.bind(this)} />}
                <Table
                    className={style.table}
                    pagination={false}
                    columns={this.columns}
                    dataSource={this.props.list}
                />
                <Pagination
                    onChange={(pageNum) => {
                        this.props.get_all_comments(pageNum)
                    }}
                    defaultCurrent={1}
                    defaultPageSize={5}
                    current={this.props.pageNum}
                    total={this.props.total}
                />
            </div>
        )
    }
}

AdminManagerComment.propTypes = {
    pageNum: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number.isRequired
}

AdminManagerComment.defaultProps = {
    pageNum: 1,
    list: [],
    total: 0,
    whether_audit: '1'
}

function mapStateToProps (state) {
    let {pageNum, list, total, whether_audit} = state.admin.comments
    return {
        pageNum,
        list,
        total,
        whether_audit
    }
}

function mapDispatchToProps (dispatch) {
    return {
        get_all_comments: bindActionCreators(get_all_comments, dispatch),
        audit_comment: bindActionCreators(audit_comment, dispatch),
        config_audit: bindActionCreators(config_audit, dispatch),
        get_audit: bindActionCreators(get_audit, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManagerComment)
