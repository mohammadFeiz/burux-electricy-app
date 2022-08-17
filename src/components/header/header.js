import React,{Component} from 'react';
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import getSvg from "../../utils/getSvg";
import Gems_SVG from './../../utils/svgs/gems-svg';
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
        let {SetState,buruxlogod} = this.context;
        let {title,buttons = {},onClose,zIndex = 1} = this.props;
        return (
            <RVD
                layout={{
                    style:{height:60,overflow:'visible',marginBottom:12},
                    className:'box-shadow bgFFF theme-1-light-bg',
                    row:[
                        {show:buttons.gap === true,size:12},
                        {show:buttons.sidemenu === true,size: 60,html: getSvg(22),attrs: { onClick: () => SetState({ sidemenuOpen: true }) },align:'vh'},
                        {show:!!onClose,size:60,html:getSvg("chevronLeft", { flip: true }),align:'vh',attrs:{onClick:onClose}},
                        {show:buttons.logo === true,html:getSvg(23, { d: buruxlogod }),align:'vh',attrs:{onClick:()=>onClose()}},
                        {html: title,className: "size16 color605E5C",align:'v',show:!!title},
                        {flex:1},
                        {
                            size:60,show:buttons.cart === true,align:'vh',
                            html: ()=>(
                              <AIOButton
                                type="button" style={{ background: "none" }} text={getSvg(45)} badge={this.getCartBadge()}
                                badgeAttrs={{ className: "badge-1" }} onClick={() => SetState({cartZIndex:zIndex * 10})}
                              />
                            ),
                        },
                        {
                            show:buttons.gems === true,align:'vh',
                            html:(
                                <div style={{height: 32,border: '1px solid',borderRadius: 32,background:'#00B5A510',display: 'flex',fontSize:12,alignItems: 'center',padding: '0 8px',color: '#00B5A5',margin:'0 6px'}}>
                                    بزودی
                                    <div style={{width:3}}></div>
                                    {Gems_SVG()}
                                </div>
                            )
                        },
                        { 
                            show:buttons.profile === true,
                            html: (
                                <AIOButton
                                    type='select'
                                    caret={false}
                                    animate={true}
                                    style={{background:'none',margin:'0 6px',padding:0}}
                                    text={<div className='home-circle'></div>}
                                    options={[
                                        {text:'خروج از حساب',value:'exit'}
                                    ]}
                                    onChange={(value)=>{
                                        if(value === 'exit'){this.context.logout()}
                                    }}
                                />
                            ), 
                            align: 'vh' 
                        },
                        {size:6}

                    ]
                }}
            />
        )
    }
}