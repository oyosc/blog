import React, {Component} from 'react'
import {Menu, Icon} from 'antd'

const menus = [
    {url: '/', name: '首页', iconType: 'home'},
    {url: '/managerUser', name: '用户管理', iconType: 'usergroup-delete'},
    {url: '/managerTags', name: '标签管理', iconType: 'usergroup-delete'},
    {url: '/managerArticles', name: '文章管理', iconType: 'usergroup-delete'},
    {url: '/managerComments', name: '评论管理', iconType: 'usergroup-delete'},
    {url: '/newArticle', name: '发文', iconType: 'file-text'}
]

export default class AdminMenu extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div>
                <Menu
                    selectedKeys={[this.props.url]}
                    mode='inline'
                    theme='dark'
                    onClick={
                        ({key}) => {
                            console.log('key')
                            console.log(key)
                            this.props.changeUrl(key)
                            this.props.history.push(`/admin${key}`)
                        }
                    }
                >
                    {
                        menus.map((item, index) =>
                            <Menu.Item key={item.url}>
                                <Icon type={item.iconType} />
                                <span>{item.name}</span>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </div>
        )
    }
}
