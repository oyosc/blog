import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {actions} from '../../reducers/adminManagerUser'
import {Table, Pagination} from 'antd'
import style from './style.css'

const {get_all_users} = actions;

const columns = [{
    title: '姓名',
    dataIndex: 'username',
    key: 'name',
    render: text => <a href="#">{text}</a>
},{
    title: 'ID',
    dataIndex: '_id',
    key: 'ID',
},{
    title: '密码(加密后)',
    dataIndex: 'password',
    key: 'password',
},{
    title: '身份',
    dataIndex: 'type',
    key: 'address'
}];

class AdminManagerUser extends Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount(){
        if(this.props.list.length===0){
            console.log("adminmanageuser");
            this.props.getAllUsers();
        }
    }

    render(){
        return (
            <div>
                {this.props.token && localStorage.setItem('token', JSON.stringify(this.props.token))}
                <h2>用户管理</h2>
                <Table
                    className={style.table}
                    pagination={false}
                    columns={columns}
                    dataSource={this.props.list}
                />
                <Pagination
                    onChange={(pageNum) =>{
                        this.props.getAllUsers(pageNum);
                    }}
                    current={this.props.pageNum}
                    total={this.props.total}
                />
            </div>
        )
    }
}

AdminManagerUser.propTypes = {
    pageNum: PropTypes.number.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    total: PropTypes.number.isRequired
}

AdminManagerUser.defaultProps = {
    pageNum: 1,
    list: [],
    total: 0
}

function mapStateToProps(state){
    let {pageNum, list, total, token} = state.admin.users;
    return {
        pageNum,
        list,
        total,
        token
    }
}

function mapDispatchToProps(dispatch){
    return {
        getAllUsers: bindActionCreators(get_all_users, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManagerUser)