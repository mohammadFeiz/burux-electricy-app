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
                { text: 'بازارگاه', icon: 35 },
                { text: 'پیگیری سفارش خرید', icon: 13,onClick:()=>this.context.SetState({ordersHistoryZIndex:10})},
                { text: 'درخواست گارانتی', icon: 32, onClick: () => this.context.SetState({ guaranteePopupZIndex: 10 }) },
                { text: 'جایزه ها', icon: 15 },
                //{ text: 'کیف پول', icon: 33 },
                //{ text: 'تاریخچه سفارشات', icon: 34 },
                { text: 'تماس با پشتیبانی', icon: 38 },
                { text: 'خروج از حساب کاربری', icon: 17,className:'colorA4262C',fill:'#A4262c',onClick:()=>this.context.logout() },
            ]
        }
    }
    render() {
        let { items } = this.state;
        let { onClose, open } = this.props;
        return (
            <>
                <RVD
                    layout={{
                        className: 'sidemenu' + (open ? ' open' : ''),
                        column: [
                            { size: 60, html: getSvg('mybrxlogo'),className: 'sidemenu-header', align: 'v' },
                            {
                                column: items.map(({ icon, text, onClick = () => { },style,className,fill = '#A19F9D' }) => {
                                    return {
                                        attrs: { onClick: () => { onClick(); onClose() } },
                                        style,
                                        className,
                                        size: 48, row: [
                                            { size: 48, html: getSvg(icon, { fill }), align: 'vh' },
                                            { flex: 1, html: text, align: 'v' }
                                        ]
                                    }
                                })
                            },
                            {flex:1}
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