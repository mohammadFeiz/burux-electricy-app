import React,{Component} from "react";
import AIOFormReact from './index';
export default class Form extends Component{
    render(){
        return <AIOFormReact {...this.props}/>
    }
}