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

