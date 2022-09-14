import React, { Component } from 'react';
import RVD from 'react-virtual-dom';
import getSvg from '../../utils/getSvg';
import appContext from './../../app-context';
import $ from 'jquery';
import './index.css';
export default class SideMenu extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = {
            items: [
                { text: 'درخواست گارانتی', icon: 32, onClick: () => this.context.SetState({ guaranteePopupZIndex: 10 }) },
                { text: 'جایزه ها', icon: 15 },
                //{ text: 'کیف پول', icon: 33 },
                { text: 'باشگاه مشتریان', icon: 21 },
                { text: 'پیگیری سفارش خرید', icon: 13,onClick:()=>this.context.SetState({ordersHistoryZIndex:10})},
                //{ text: 'تاریخچه سفارشات', icon: 34 },
                { text: 'بازارگاه', icon: 35 },
                { text: 'چت با ویزیتور', icon: 36 },
                { text: 'تماس با ویزیتور', icon: 37 },
                { text: 'تماس با پشتیبانی', icon: 38 },
            ]
        }
    }
    render() {
        let { items } = this.state;
        let { onClose, open } = this.props;
        let {buruxlogod} = this.context;
        return (
            <>
                <RVD
                    layout={{
                        className: 'sidemenu' + (open ? ' open' : ''),
                        column: [
                            { size: 60, html: getSvg(23,{d:buruxlogod}),className: 'sidemenu-header', align: 'v' },
                            {
                                column: items.map(({ icon, text, onClick = () => { },style }) => {
                                    return {
                                        attrs: { onClick: () => { onClick(); onClose() } },
                                        style,
                                        size: 48, row: [
                                            { size: 48, html: getSvg(icon, { fill: '#A19F9D' }), align: 'vh' },
                                            { flex: 1, html: text, align: 'v' }
                                        ]
                                    }
                                })
                            },
                            {flex:1},
                            {
                                align:'h',
                                html:(
                                    <button 
                                        className='button-2 margin-0-12' 
                                        style={{background:'red',border:'1px solid red',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}
                                        onClick={()=>this.context.logout()}
                                    >
                                        {getSvg(17,{fill:'#fff'})}
                                        <div style={{width:6}}></div>
                                        خروج از حساب کاربری
                                    </button>
                                )
                            },
                            {size:12}
                        ]
                    }}
                />
                {
                    open === true &&
                    <div className='sidemenu-backdrop' onClick={()=>onClose()}></div>
                }
            </>
        )
    }
}