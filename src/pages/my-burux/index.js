import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import myBuruxHeaderSrc from './../../utils/burux-header.jpg';
import bill from './../../images/home-slide-4.jpg';
import getSvg from './../../utils/getSvg';
import appContext from '../../app-context';
import functions from '../../functions';
import AIOButton from './../../components/aio-button/aio-button';
import './index.css';
import SabteGarantiJadid from '../../components/garanti/sabte-garanti-jadid/sabte-garanti-jadid';
export default class MyBurux extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            user:'محمد شریف فیض',
            customerCode:'c19428',shopName:'فروشگاه الکتریکی تهران',visitorName:'علی محمدی',nationalCode:'0386481784',
            parts:[
                {text:'پیگیری سفارش خرید',icon:13,onClick:()=>{
                    let {SetState} = this.context;
                    SetState({ordersHistoryZIndex:10})
                }},
                {text:'جایزه ها',icon:15,onClick:()=>{}},
                {text:'حساب ها',icon:14,onClick:()=>{}},
                {text:'جزییات درخواست های گارانتی',icon:14,onClick:async ()=>{
                    let {SetState,services} = this.context;
                    let guaranteeItems = await services({type:'kalahaye_garanti_shode'});
                    SetState({guaranteeItems,joziate_darkhasthaye_garanti_popup_zIndex:10}) 
                }},
                {text:'قوانین و مقررات',icon:16,onClick:()=>{}},
                {text:'خروج از حساب کاربری',icon:17,onClick:()=>this.context.logout(),color:'#A4262C'},
            ]
        }
    }
    getPanel({text1,text2,text3,className,onClick}){
        let size = 24;
        let space = 10;
        let column = [{size:space}];
        if(text1){
            column.push({size,align:'vh',html:text1,className:'colorA19F9D size12'})
        }
        if(text2){
            column.push({size,align:'vh',html:text2,className:'color605E5C size14 bold'})
        }
        if(text3){
            column.push({size,align:'vh',html:text3,className:'color0094D4 size14 bold'})
        }
        column.push({size:space})
        return {flex:1,className,attrs:{onClick},column}
    }
    parts_layout(){
        let {theme} = this.context;
        let {parts} = this.state;
        return {
            className:'margin-0-12' + (theme === false?' box':''),gap:theme === false?1:6,
            column:parts.map(({text,icon,color,onClick})=>{return {html:<Part {...{text,icon,color,onClick}}/>}})
        }
    }
    getContent(){
        let {user = '',customerCode,shopName,visitorName,nationalCode,parts} = this.state;
        let {guaranteeItems,wallet,userInfo} = this.context;
        return {
            scroll:'v',flex:1,className:'my-burux-page main-bg',
            column:[
                {
                    className:'my-burux-header',size:151,
                    html:(<img src={myBuruxHeaderSrc} alt='' style={{backgroundSize:'cover',width:'100%'}}/>)
                },
                {
                    size:100,style:{overflow:'visible'},
                    html:(
                        <div style={{background:'#aaa',width:132,height:132,left:'calc(50% - 66px)',position:'absolute',top:-32,borderRadius:'100%'}}></div>
                    )
                },
                {
                    size:36,
                    row:[
                        {flex:1},
                        {className:'color323130 size20 bold',html:userInfo.cardName,align:'vh'},
                        {flex:1}
                    ]
                },
                {size:6},
                {
                    className:'box margin-0-12',gap:1,
                    column:[
                        {
                            gap:1,
                            row:[
                                this.getPanel({text1:'کد مشتری',text2:userInfo.cardCode}),
                                this.getPanel({text1:'نام فروشگاه',text2:shopName})
                            ]
                        },
                        {
                            gap:1,
                            row:[
                                this.getPanel({text1:'ویزیتور',text2:userInfo.slpname}),
                                this.getPanel({text1:'کد ملی',text2:userInfo.idNumber})
                            ]
                        },
                        this.getPanel({text3:'مشاهده کامل اطلاعات کاربری'})
                    ]
                },
                {size:16},
                {
                    style:{overflow:'visible'},
                    className:'margin-0-12',
                    row:[
                        this.getPanel({
                            text1:'کیف پول',text2:functions.splitPrice(wallet) + ' ریال',text3:'افزایش موجودی',
                            className:'box'
                        }),
                        {size:12},
                        this.getPanel({
                            text1:'کالا های گارانتی شده',text2:guaranteeItems.length + ' عدد',
                            text3:(
                                <AIOButton 
                                    type='button'
                                    caret={false}
                                    style={{background:'none',color:'inherit',fontWeight:'inherit',fontSize:'inherit'}}
                                    position='bottom'
                                    text='درخواست گارانتی جدید'
                                    popOver={()=><SabteGarantiJadid close={false}/>}
                                />
                            ),
                            className:'box',
                        })
                    ]
                },
                {size:16},
                this.parts_layout(),
                {
                    size:96,html:getSvg(18),align:'vh'
                }
            ]
        }
    }
    render(){
        return (<RVD layout={this.getContent()}/>)
    }
}
class Part extends Component{
    static contextType = appContext;
    getStyle(){
        let {theme} = this.context;
        let style = {height:60}
        if(theme === 'theme-1'){
            style.borderRadius = 48;
            style.height = 48;
            style.margin = '0 6px';
        }
        return style;
    }
    render(){
        let {theme} = this.context;
        let {text,icon,color,onClick} = this.props;
        return (
            <RVD
                layout={{
                    attrs:{onClick:()=>onClick()},
                    style:this.getStyle(),
                    className:theme === 'theme-1'?'theme-1-light-bg':'',
                    row:[
                        {size:60,html:getSvg(icon),align:'vh'},
                        {flex:1,html:text,align:'v',className:'color605E5C size14 bold',style:{color}},
                        {size:40,html:getSvg('chevronLeft'),align:'vh',style:{color}}
                    ]
                }}
            />
        )
    }
}
