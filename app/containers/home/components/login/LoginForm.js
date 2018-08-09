import React, {Component} from 'react'
import {Input, Form, Icon, Button} from 'antd'
const FormItem = Form.Item;
import style from './style.css'

class LoginFormCom extends Component{
    constructor(props){
        super(props);
    }
    handleLogin = (e) =>{
        console.log("handle_login")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.login(window.location.href, values.userName, values.password)
            }
        });
    }

    handleLoginWithGithub = () => {
        this.props.login_with_github()
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleLogin} className={`${style.formStyle}`}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{required:true, message: '请输入用户名！'}],
                        })(
                            <Input prefix={<Icon type="user" style={{fontSize:13}}/>} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码！'}],
                        })(
                            <Input prefix={<Icon type='lock' style={{fontSize: 13}}/>} type="password" placeholder="Password"/>
                        )
                        
                        }
                    </FormItem>
                    <FormItem>
                        <Button className={`${style.loginButton}`} type="primary" htmlType="submit">
                            登录
                        </Button>
                    </FormItem>
                </Form>
                <Button className={`${style.buttonStyle}`} type="primary" onClick={this.handleLoginWithGithub.bind(this)}>
                    login by github
                </Button>
            </div>
        )
    }
}

const LoginForm = Form.create()(LoginFormCom);

export default LoginForm