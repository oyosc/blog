import React, {Component} from 'react'
import NotFoundImg from './404.png'
import pageStyle from './style.css'
import style from '../../lib/animate.css'

export default class NotFound extends Component{
    constructor(props){
        super(props);
        this.state = {
            animationType: 'swing'
        };
        this.enter = this.enter.bind(this);
    }

    enter(){
        this.setState({
            animationType: 'hinge'
        })

        setTimeout(() => {

        }, 5000)
    }

    render(){
        console.log("~~~~~~~~~~");
        return (
            <div className={pageStyle.container}>
                <img src={NotFoundImg} className={`${style.animated} ${style[this.state.animationType]}`} onMouseEnter={this.enter} />
            </div>
        )
    }
}