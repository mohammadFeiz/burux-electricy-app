import React,{Component} from 'react';
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import getSvg from "../../utils/getSvg";
import AIOButton from "../aio-button/aio-button";
//props
//1 - title ''
//2 - buttons {cart:boolean}
export default class Header extends Component{
    static contextType = appContext;
    getCartBadge(){
        let {cart} = this.context;
        let length = Object.keys(cart).length;
        return length > 0?length:undefined;
    }
    render(){
        let {SetState} = this.context;
        let {title,buttons = {},onClose,zIndex = 1} = this.props;
        return (
            <RVD
                layout={{
                    style:{height:60,overflow:'visible'},
                    className:'box-shadow bgFFF theme-1-light-bg',
                    row:[
                        {show:buttons.sidemenu === true,size: 60,html: getSvg(22),attrs: { onClick: () => SetState({ sidemenuOpen: true }) },align:'vh'},
                        {show:!!onClose,size:60,html:getSvg("chevronLeft", { flip: true }),align:'vh',attrs:{onClick:()=>onClose()}},
                        {flex:1,html: title,className: "size16 color605E5C",align:'v'},
                        {
                            size:60,show:buttons.cart === true,align:'vh',
                            html: ()=>(
                              <AIOButton
                                type="button" style={{ background: "none" }} text={getSvg(45)} badge={this.getCartBadge()}
                                badgeAttrs={{ className: "badge-1" }} onClick={() => SetState({cartZIndex:zIndex * 10})}
                              />
                            ),
                          }
                    ]
                }}
            />
        )
    }
}