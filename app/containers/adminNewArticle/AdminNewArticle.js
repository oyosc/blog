import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import style from './style.css'
import remark from 'remark'
import reactRenderer from 'remark-react'
import {Input, Select, Button, Modal} from 'antd'
import {actions} from '../../reducers/admin' //TODO
import {actions as tagActions} from '../../reducers/adminManagerTags'
import dateFormat from 'dateformat'


const {get_all_tags} = tagActions
const {update_content, update_tags, update_title, save_article} = actions
const Option = Select.Option

class AdminNewArticle extends Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            options: [],
            modalVisible: false
        }
    }
    
    //正文
    onChanges(e){
        this.props.update_content(e.target.value)
    }
    //标题输入框
    titleOnChange(e){
        this.props.update_title(e.target.value)
    }

    //选择标签
    selectTags(value){
        this.props.update_tags(value)
    }

    //预览
    preView(){
        this.setState({
            modalVisible: true
        })
    }

    //发表
    publishArticle(){
        let articleData = {};
        articleData.title = this.props.title;
        articleData.content = this.props.content;
        articleData.tags = this.props.tags;
        articleData.time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        articleData.isPublish = true;
        this.props.save_article(articleData);
    }

    //保存
    saveArticle(){
        let articleData = {};
        articleData.title = this.props.title;
        articleData.content = this.props.content;
        articleData.tags = this.props.tags;
        articleData.time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        articleData.isPublish = false;
        this.props.save_article(articleData);
    }

    handleOk(){
        this.setState({
            modalVisible: false
        })
    }
}