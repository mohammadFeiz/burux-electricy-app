import React,{Component} from React;
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import getSvg from "../../utils/getSvg";
import AIOButton from "../aio-button/aio-button";
//props
//1 - title ''
//2 - buttons {cart:boolean}
export default class PageHeader extends Component{
    static contextType = appContext;
    getCartBadge(){
        let {cart} = this.context;
        let length = Object.keys(cart).length;
        return length > 0?length:undefined;
    }
    render(){
        let {SetState} = this.context;
        let {title,buttons = {}} = this.props;
        return (
            <RVD
                layout={{
                    style:{height:60},
                    row:[
                        {size: 60,html: getSvg(22),attrs: { onClick: () => SetState({ sidemenuOpen: true }) },align:'vh'},
                        {flex:1,html: title,className: "size16 color605E5C",align:'v'},
                        {
                            show:buttons.cart === true,align:'vh',
                            html: ()=>(
                              <AIOButton
                                type="button" style={{ background: "none" }} text={getSvg(45)} badge={this.getCartBadge()}
                                badgeAttrs={{ className: "badge-1" }} onClick={() => SetState({cartZIndex:10})}
                              />
                            ),
                          }
                    ]
                }}
            />
        )
    }
}