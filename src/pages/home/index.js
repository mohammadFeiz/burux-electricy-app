import React, { Component, createRef } from 'react';
import RVD from 'react-virtual-dom';
import getSvg from './../../utils/getSvg';
import SliderDots from '../../components/slider-dots';
import appContext from '../../app-context';
import AIOButton from './../../components/aio-button/aio-button';
import functions from '../../functions';
import ContentSlider from '../../components/content-slider';
import bulb10w from './../../images/10w-bulb.png';
import './index.css';
import Awards from './../awards/index';

export default class Home extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = {
            gems: 500,
            showAwards:false,
            searchValue: '',
            preOrders: { waitOfVisitor: 0, waitOfPey: 0 },
            sliderItems: [
                {
                    icon: getSvg(27),
                    background: '#662D91',
                    color: '#fff',
                    title: 'باز طراحی اپ الکتریکی',
                    subtitle: 'طراحی راحت تر وجدید با کلی قابلیت جدید!'
                },
                {
                    icon: <img src={bulb10w} alt='' height='100%'/>,
                    title: 'طرح فروش ویژه 10 وات',
                    background: "#FDB913",color: "#173796"
                }
            ],
            wallet: 0,
            myNearItems: [
                { price: 600000, distance: 1.2 },
                { price: 100000, distance: 24.0 },
                { price: 200000, distance: 14.1 },
                { price: 300000, distance: 28.5 },
            ]
        }
    }
    async getPreOrders() {
        let {services} = this.context;
        let preOrders = await services({type:"preOrders"});
        this.setState({ preOrders });
    }
    async getWallet(){
        let {services} = this.context;
        let wallet = await services({type:'wallet'})
        this.setState({wallet})
    }
    box_layout(icon,title,value,color){
        let {theme} = this.context;
        if(theme === 'theme-1'){return this.box_layout_theme1(icon,title,value,color)}
        return {
            flex:1,
            className:'box',
            column: [
                {size:12},
                {
                    align:'h',row: [
                        { size: 36, align: 'vh', html: getSvg(icon) ,show:!!icon},
                        { html: title, align: 'vh',className: 'color605E5C bold size14' },
                    ]
                },
                { size: 12 },
                { html: value, className: 'color605E5C bold size14',align:'h' },
                {size:12}
            ]
        }
    }
    box_layout_theme1(icon,title,value,color){
        return {
            flex:1,
            className:'box',
            row:[
                {size:60,html:getSvg(icon,{width:24,height:24,fill:'#fff'}),align:'vh',style:{background:color,borderRadius:'0 12px 12px 0'}},
                {size:12},
                {
                    column: [
                        {size:12},
                        {html: title, align: 'v',className: 'color605E5C bold size12'},
                        { size: 1 },
                        { html: value, className: 'color605E5C bold size12',align:'v' },
                        {size:12}
                    ]
                }   
            ]
        }
    }
    score_layout(){
        let {theme} = this.context;
        return {
            className:'box',
            style:{background:theme === 'theme-1'?'#e1780d':undefined},
            row: [
                { size: 12 },
                {
                    flex: 1,
                    column: [
                        {size:12},
                        { align:'v',row: [{ html: '5',className: 'color0094D4 size28 bold', align: 'v' }, { size: 6 }, { html: 'الماس', align: 'v',className: 'color323130 size18 bold'}]},
                        { html: 'به ازای اخذ هر سفارش از بازارگاه',className: 'color605E5C bold size14',align:'v' },
                        {size:12},
                        
                    ]
                },
                { html: getSvg(6, { width: 70, height: 70 }),align:'vh' },
                { size: 6 }
            ]
        }
    }
    getContent() {
        let { gems, preOrders, sliderItems, myNearItems, wallet } = this.state;
        let {SetState,testedChance,cart,changeTheme} = this.context;
        return {
            flex: 1,
            className:'home-page main-bg',style:{width:'100%'},
            column: [
                {
                    className: 'header', size: 60,
                    row: [
                        { size: 60, html: getSvg(22), align: 'vh',attrs:{onClick:()=>SetState({sidemenuOpen:true})} },
                        { html: getSvg(23), align: 'vh' },
                        { flex: 1 },
                        { html: getSvg('darkmode'), align: 'vh',attrs:{onClick:()=>changeTheme()} },
                        { size: 16 },
                        { html: gems,className: 'size14 color006F9E', align: 'vh' },
                        { html: getSvg(24), align: 'vh' },
                        { size: 16 },
                        { html: getSvg(25), align: 'vh' },
                        { size: 16 },
                        { html: (
                            <AIOButton
                                type='select'
                                caret={false}
                                style={{background:'none'}}
                                text={<div className='home-circle'></div>}
                                options={[
                                    {text:'خروج از حساب',value:'exit'}
                                ]}
                                onChange={(value)=>{
                                    if(value === 'exit'){this.context.logout()}
                                }}
                            />
                        ), align: 'vh' },
                        { size: 16 }

                    ]
                },
                {
                    flex:1,scroll:'v',
                    column: [
                        this.context.layout('search',{onClick:()=>SetState({popup:{mode:'search'}})}),
                        { html: <ContentSlider items={sliderItems} /> },
                        { size: 24 },
                        {
                            style:{overflow:'visible'},
                            row: [
                                this.box_layout(28,'سبد خرید',Object.keys(cart).length,'#2d3e91'),
                                {size:4},
                                this.box_layout(29,'کیف پول',functions.splitPrice(wallet) + ' ریال','#61912d')
                            ]
                        },
                        { size: 16 },
                        {html: "پیش سفارشات",className: "size14 color323130 bold padding-0-12",size: 36,align: "v"},
                        {
                            style:{overflow:'visible'},
                            row: [
                                this.box_layout(undefined,'در انتظار تایید ویزیتور',preOrders.waitOfVisitor,'#2d3e91'),
                                {size:4},
                                this.box_layout(undefined,'در انتظار پرداخت',preOrders.waitOfPey,'#61912d')
                            ]
                        },
                        { size: 16 },
                        {style:{overflow:'visible'},html: <MyNear items={myNearItems} />},
                        {size:16},
                        this.score_layout(),
                        { 
                            size: 72, 
                            row: [
                                { size: 12 },
                                {
                                    show:testedChance === false,align:'v',column:[
                                        {
                                            className:'go-to-awards',
                                            attrs:{
                                                onClick:()=>{
                                                    this.setState({showAwards:true})
                                                }
                                            },
                                            size:36,row:[
                                                {html:'جایزه روز',style:{fontSize:24},align:'v'},
                                                {html:'شانست رو امتحان کن',style:{fontSize:11},align:'v'}
                                            ]
                                        }
                                    ]
                                    
                                },
                                { flex: 1 }, 
                                { html: getSvg(31), align: 'vh' }, 
                                { size: 12 }
                            ] 
                        }
                    ]
                }

            ]
        }
    }
    async componentDidMount(){
        this.getPreOrders();
        this.getWallet()
    }
    render() {
        let {showAwards} = this.state;
        return (
            <>
                <RVD layout={this.getContent()} />
                {
                    showAwards &&
                    <Awards onClose={()=>this.setState({showAwards:false})}/>
                }
            </>
            
        )
    }
}


class MyNear extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        let { items, index = 0 } = this.props;
        this.state = { items, index }
    }
    changeIndex(dir) {
        let { index, items } = this.state;
        index += dir;
        if (index < 0) { index = items.length - 1 }
        if (index > items.length - 1) { index = 0 }
        this.setState({ index })
    }
    render() {
        let { items, index } = this.state;
        let item = items[index];
        return (
            <RVD
                layout={{
                    className: 'my-near box',
                    column: [
                        {
                            size: 36, row: [
                                { size: 36, html: getSvg(30), align: 'vh' },
                                { html: 'اطراف من',className: 'color605E5C bold size14', align: 'v' },
                                { flex: 1 },
                                { html: 'مشاهده همه',className: 'size12 color0094D4', align: 'v' },
                                { size: 24 }

                            ]
                        },
                        {
                            row: [
                                { size: 48, html: getSvg('chevronLeft', { flip: true }), align: 'vh', attrs: { onClick: () => this.changeIndex(-1) } },
                                {
                                    flex: 1,
                                    column: [
                                        { size: 36, html: 'سفارش به مبلغ ' + functions.splitPrice(item.price) + ' تومان', align: 'vh',className: 'color605E5C bold size14' },
                                        {
                                            size: 36, childsProps: { align: 'v' },
                                            row: [
                                                { flex: 1 },
                                                { html: 'فاصله از شما:',className: 'color605E5C bold size14' },
                                                { size: 6 },
                                                { html: item.distance,className: 'color605E5C bold size14' },
                                                { size: 6 },
                                                { html: 'کیلومتر',className: 'size10 colorA19F9D' },
                                                { flex: 1 }
                                            ]
                                        },
                                        {
                                            size: 60, html: <button>اخذ</button>, align: 'v'
                                        }
                                    ]
                                },
                                { size: 48, html: getSvg('chevronLeft'), align: 'vh', attrs: { onClick: () => this.changeIndex(1) } }
                            ]
                        },
                        { html: <SliderDots length={items.length} index={index} /> }
                    ]
                }}
            />
        )
    }
}

