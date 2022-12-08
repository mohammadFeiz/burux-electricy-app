import React,{Component} from "react";
import AIOService from './../../npm/aio-service/aio-service';
export default class AIOService_Interface extends Component{
    render(){
        return <AIOService {...this.props}/>
    }
}