import React from 'react'
import style from './style.css'
import {Button} from 'antd'

export const Logined = (props) => (
    <div className={`${style.container}`}>
        <img src={props.userInfo.avatarUrl?props.userInfo.avatarUrl:require('./timg.jpeg')} />
        <p>欢迎: {props.userInfo.username}</p>
        <p className={`${style.centerP}`}>光临我的博客</p>
        <p><Button onClick={() => {props.logout(window.location.href); return false}} type='primary'>注销</Button></p>
        {props.userInfo.userType === 'admin' ?
            <Button onClick={() => props.history.push('/admin')} type='primary'>点击进入管理界面</Button> : null}
    </div>
)