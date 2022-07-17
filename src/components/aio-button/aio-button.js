import React,{Component} from 'react';
import AIOButton from 'aio-button'; 
export default class AIOButtonInterface extends Component{
    render(){
        let {position} = this.props;
        let props = {rtl:true,...this.props}
        if (position === 'bottom'){
            props.popupAttrs = {className:'bottom-popup',style:{bottom:-160}};
            props.backColor = 'rgba(0,0,0,0.5)';
            props.popupHeader = (
                <div style={{width:'100%',height:24,display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{width:0,height:0,borderBottom:'6px solid #888',borderLeft:'6px solid transparent',borderRight:'6px solid transparent'}}></div>
                </div>
            )
            props.animate = {bottom:0}

        }
        return (
            <AIOButton {...props}/>
        )
    }
}