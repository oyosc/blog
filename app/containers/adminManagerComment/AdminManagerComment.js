import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from '../../reducers/adminManagerComment'
import {Table, Pagination} from 'antd'
import style from './style.css'

function toLocalDate(timeString){
    let unixTime = new Date(parseInt(timeString))
    return unixTime.getFullYear() + "/" + (unixTime.getMonth() + 1) + "/" + unixTime.getDate() + "/ " + unixTime.getHours() + ":" + unixTime.getMinutes() + ":" + unixTime.getSeconds();
}

const {get_all_comments} = actions;

const columns = [{
    title: '文章标题',
    dataIndex: 'article_title',
    key: 'article_title',
    render: (text, row) => <a href={`/detail/${row.article_id}`}>{text}</a>
},{
    title: '评论内容',
    dataIndex: 'comment_content',
    key: 'comment_content',
},{
    title: '评论时间',
    dataIndex: 'comment_time',
    key: 'comment_time',
    render: (comment_time) =>  {return toLocalDate(comment_time)}
},{
    title: '评论用户',
    dataIndex: 'comment_user',
    key: 'comment_user'
},{
    title: '审核',
    dataIndex: 'whether_audit',
    key: 'whether_audit'
}];

class AdminManagerComment extends Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount(){
        if(this.props.list.length===0){
            this.props.get_all_comments();
        }
        console.log("allcomments")
        console.log(this.props.list)
    }

    render(){
        return (
            <div>
                <h2>评论管理</h2>
                <Table
                    className={style.table}
                    pagination={false}
                    columns={columns}
                    dataSource={this.props.list}
                />
                <Pagination
                    onChange={(pageNum) =>{
                        this.props.get_all_comments(pageNum);
                    }}
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
    total: 0
}

function mapStateToProps(state){
    let {pageNum, list, total} = state.admin.comments;
    return {
        pageNum,
        list,
        total
    }
}

function mapDispatchToProps(dispatch){
    return {
        get_all_comments: bindActionCreators(get_all_comments, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManagerComment)