import React,{Component} from 'react';
import appContext from '../../app-context';
import './index.css';
export default class Popup extends Component{
    static contextType = appContext;
    render(){
        let {theme} = this.context;
        let {style} = this.props;
        return (
            <div className={"popup-container" + (theme?' ' + theme:'')} style={style}>
                {this.props.children}
            </div>
        )
    }
} 