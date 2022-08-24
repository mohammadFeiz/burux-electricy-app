import React, { Component } from 'react';
import RVD from 'react-virtual-dom';
import getSvg from './../../utils/getSvg';
import appContext from '../../app-context';
import functions from '../../functions';
import GarantiCard from '../../components/garanti/garanti-card/garanti-card';
import BazargahCard from './../../components/bazargah-card/bazargah-card';
import AIOButton from './../../components/aio-button/aio-button';
import './index.css';
import Awards from './../awards/index';
import Header from '../../components/header/header';
import ReactHtmlSlider from './../../components/react-html-slider/react-html-slider';
import SabteGarantiJadid from '../../components/garanti/sabte-garanti-jadid/sabte-garanti-jadid';
import Billboard from '../../components/billboard/billboard';

export default class Home extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = {
            gems: 500,
            showAwards:false,
            searchValue: '',
            preOrders: { waitOfVisitor: 0, waitOfPey: 0 },
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
    billboard_layout(){
        return { html: <Billboard id='home'/> }
    }
    cartAndWallet_layout(){
        let {wallet,cart,SetState} = this.context;
        return {
            style:{overflow:'visible'},
            className:'padding-0-12',
            row: [
                this.cartAndWalletCard_layout(getSvg(29,{width:30,height:30}),'کیف پول',functions.splitPrice(wallet),'ریال'),
                {size:12},
                this.cartAndWalletCard_layout(getSvg(28,{width:30,height:30}),'سبد خرید',Object.keys(cart).length,'کالا',()=>SetState({cartZIndex:10}))
            ]
        }
    }
    cartAndWalletCard_layout(icon,title,value,unit,onClick){
        return {
            flex:1,className:'box',
            attrs:{onClick},
            column:[
                {size:12},
                {html:icon,align:'vh',size:40},
                {html:title,className:'color605E5C size14 bold',align:'h'},
                {
                    align:'h',
                    row:[
                        {html:value,className:'color323130 size16 bold',align:'vh'},
                        {size:4},
                        {html:unit,className:'colorA19F9D size12',align:'vh'}
                    ]
                },
                {size:12}
            ]
        }
    }
    orderCard_layout(icon,title,count,onClick){
        return {
            flex:1,className:'box',
            attrs:{onClick},
            row:[
                {size:60,html:icon,align:'vh'},
                {
                    flex:1,
                    column:[
                        {flex:1},
                        {html:title,className:'color605E5C size14 bold'},
                        {
                            row:[
                                {html:count,className:'color323130 size14 bold'},
                                {size:4},
                                {html:'سفارش',className:'colorA19F9D size12'}
                            ]
                        },
                        {flex:1}
                    ]
                },
            ]
        }
    }
    
    preOrders_layout(){
        let {SetState} = this.context;
        let {preOrders} = this.state;
        return {
            className:'padding-0-12',
            column:[
                {html: "پیش سفارشات",className: "size14 color323130 bold padding-0-12",size: 48,align: "v"},
                {
                    size:72,
                    style:{overflow:'visible'},
                    row: [
                        this.orderCard_layout(getSvg('paperRocket'),'در حال بررسی',preOrders.waitOfVisitor,()=>SetState({ordersHistoryZIndex:10})),
                        {size:12},
                        this.orderCard_layout(getSvg('pending'),'در انتظار پرداخت',preOrders.waitOfPey,()=>SetState({ordersHistoryZIndex:10}))
                    ]
                },
            ]
        }
    }
    garanti_layout(){
        let {guaranteeItems,SetState} = this.context;
        return {
            className:'padding-0-12',
            column:[
                {
                    className:'padding-0-12 box gap-no-color',size:48,style:{borderRadius:'14px 14px 0 0'},
                    row:[
                        {html: "گارانتی",className: "size16 color323130 bold",align: "v"},
                        {flex:1},
                        {
                            html:(
                                <AIOButton
                                    text='ثبت گارانتی جدید'
                                    caret={false}
                                    className='color0094D4 size12 bold'
                                    before={getSvg('plusBox')}
                                    type='button'
                                    style={{background:'none'}}
                                    position='bottom'
                                    popOver={()=><SabteGarantiJadid close={false}/>}
                                />
                            )
                        }
                    ]
                },
                {
                    gap:1,column:guaranteeItems.slice(0,2).map((o,i)=>{
                        return {
                            html:<GarantiCard {...o} type='2'/>
                        }
                    })
                },
                {size:1},
                {
                    attrs:{onClick:()=>SetState({joziate_darkhasthaye_garanti_popup_zIndex:10})},
                    size:48,html:'مشاهده جزییات درخواست های گارانتی ها',className:'box color0094D4 size12 bold',align:'vh',style:{borderRadius:'0 0 14px 14px'}
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
    bazargah_layout(){
        let {bazargahItems = [],SetState,services} = this.context;
        bazargahItems = []
        return {
            column:[
                {
                    size:48,className:'padding-0-12',
                    row:[
                        {flex:1,html: "بازارگاه",className: "size14 color323130 bold padding-0-12",size: 48,align: "v"},
                        {html:'مشاهده همه',align:'v',className:'color0094D4 size12 bold',show:bazargahItems.length !== 0}
                    ]
                },
                {
                    size:48,show:bazargahItems.length === 0,className:'box margin-0-12 padding-0-12 size14 color605E5C',align:'v',style:{marginBottom:12},
                    html:'سفارشی در نزدیکی شما ثبت نشده است' 
                },
                {
                    show:bazargahItems.length !== 0, 
                    html:(
                        <ReactHtmlSlider
                            autoSlide={5000} arrow={false}
                            items={bazargahItems.map((o,i)=><BazargahCard {...o} items={false} address={false} onCatch={async()=>{
                                let res = await services({type:'bazargahCatch',parameter:{orderId:o.orderId}})
                                if(res){
                                    SetState({bazargahItems:this.context.bazargahItems.filter((o,index)=>{
                                        return index !== i
                                    })})
                                    
                                }
                            }}/>)}
                        />
                    )
                }
            ]
        }
    }
    hint_layout(){
        return {
            className:'padding-0-12',
            row:[
                {flex:1},
                {
                    size:48,
                    html:(
                        <AIOButton 
                            text={getSvg('hint')}
                            style={{padding:0,background:'none'}}
                            type='button'
                            position='bottom'
                            popOver={()=>{
                                return (
                                    <RVD
                                        layout={{
                                            className:'padding-0-12',
                                            column:[
                                                {size:60,html:'راهنما',className:'size18 bold',align:'vh'},
                                                {size:48,html:'درحال بررسی',className:'color323130 size16 bold',align:'v'},
                                                {html:'سفارش هایی هستند که شما ثبت کرده اید و ویزیتور شما درحال بررسی کالاهای سفارش شما هست.',className:'color605E5C size14'},
                                                {size:12},
                                                {size:48,html:'در انتظار تایید',className:'color323130 size16 bold',align:'v'},
                                                {html:'سفارش هایی هستند که بعد از بررسی ویزیتور برای تایید و پرداخت به سمت شما برگشته است. سفارش هایی که ویزیتور مستقیما برای شما ثبت میکند نیز در این قسمت نمایش داده میشود',className:'color605E5C size14'},
                                                {size:24}
                                            ]
                                        }}
                                    />
                                )
                            }}
                        />
                    )
                }
            ]
        }
    }
    getContent() {
        return {
            flex: 1,
            className:'home-page main-bg',style:{width:'100%'},
            column: [
                {
                    html:<Header buttons={{sidemenu:true,profile:true,gems:true,logo:true}}/>
                },
                {
                    flex:1,scroll:'v',
                    column: [
                        this.billboard_layout(),
                        this.cartAndWallet_layout(),
                        { size: 12 },
                        this.preOrders_layout(),
                        { size: 12 },
                        this.bazargah_layout(),
                        this.garanti_layout(),
                        { size: 12 },
                        this.hint_layout(),
                        { size: 12 },
                        //this.score_layout(),
                        // { 
                        //     size: 72, 
                        //     row: [
                        //         { size: 12 },
                        //         {
                        //             show:testedChance === false,align:'v',column:[
                        //                 {
                        //                     className:'go-to-awards',
                        //                     attrs:{
                        //                         onClick:()=>{
                        //                             this.setState({showAwards:true})
                        //                         }
                        //                     },
                        //                     size:36,row:[
                        //                         {html:'جایزه روز',style:{fontSize:24},align:'v'},
                        //                         {html:'شانست رو امتحان کن',style:{fontSize:11},align:'v'}
                        //                     ]
                        //                 }
                        //             ]
                                    
                        //         },
                        //         { flex: 1 }, 
                        //         { html: getSvg(31), align: 'vh' }, 
                        //         { size: 12 }
                        //     ] 
                        // }
                    ]
                }

            ]
        }
    }
    async componentDidMount(){
        this.getPreOrders();
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
