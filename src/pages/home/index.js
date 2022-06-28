import React, { Component, createRef } from 'react';
import RVD from 'react-virtual-dom';
import getSvg from './../../utils/getSvg';
import SliderDots from '../../coponents/slider-dots';
import appContext from '../../app-context';
import AIOButton from './../../coponents/aio-button/aio-button';
import functions from '../../functions';
import ContentSlider from '../../coponents/content-slider';
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
    getContent() {
        let { gems, searchValue, sliderItems, myNearItems, wallet } = this.state;
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
                                {
                                    flex:1,
                                    className:'box',
                                    column: [
                                        {size:12},
                                        {
                                            align:'h',
                                            attrs:{
                                                onClick:()=>{
                                                    this.context.SetState({
                                                        activeBottomMenu:'b',
                                                        buy_view:{type:'cart',onBack:()=>{
                                                            this.context.SetState({activeBottomMenu:'a'})
                                                        }}
                                                    })
                                                }
                                            },
                                            row: [
                                                { size: 36, align: 'vh', html: getSvg(28) },
                                                { html: 'سبد خرید', align: 'vh', className: 'color605E5C bold size14' },
                                            ]
                                        },
                                        { size: 12 },
                                        { html: Object.keys(cart).length, align: 'vh',className: 'color605E5C bold size14' },
                                        {size:12}
                                        
                                    ]
                                },
                                {size:4},
                                {
                                    flex:1,
                                    className:'box',
                                    column: [
                                        {size:12},
                                        {
                                            align:'h',row: [
                                                { size: 36, align: 'vh', html: getSvg(29) },
                                                { html: 'کیف پول', align: 'vh',className: 'color605E5C bold size14' },
                                            ]
                                        },
                                        { size: 12 },
                                        { html: functions.splitPrice(wallet) + ' ریال', className: 'color605E5C bold size14',align:'h' },
                                        {size:12}
                                    ]
                                }
                            ]
                        },
                        { size: 16 },
                        {style:{overflow:'visible'},html: <MyNear items={myNearItems} />},
                        {size:16},
                        {
                            className:'box',
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
                        },
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
        let {services} = this.context;
        let wallet = await services({type:'wallet'})
        this.setState({wallet})
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

