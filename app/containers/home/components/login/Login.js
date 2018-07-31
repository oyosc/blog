import React, {Component} from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import style from './style.css'
import {Tabs} from 'antd'
import LoginForm from './LoginForm'
const TabPane = Tabs.TabPane

export default class Login extends Component {
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    }

    render(){
        const {login, login_with_github} = this.props;
        return (
            <Tabs defaultActiveKey="1" tabBarStyle={{textAlign:'center'}} className={`${style.container}`}>
                <TabPane tab='登录' key='1'>
                    <LoginForm login={login} login_with_github={login_with_github} />
                </TabPane>
            </Tabs>
        )
    }
}