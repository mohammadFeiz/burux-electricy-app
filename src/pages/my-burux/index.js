import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import myBuruxHeaderSrc from './../../utils/burux-header.jpg';
import getSvg from './../../utils/getSvg';
import appContext from '../../app-context';
import functions from '../../functions';
import './index.css';
import services from '../../services';
export default class MyBurux extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            user:'محمد شریف فیض',
            customerCode:'c19428',shopName:'فروشگاه الکتریکی تهران',visitorName:'علی محمدی',nationalCode:'0386481784',
            wallet:123456789,
            popup:{},
            parts:[
                {text:'پیگیری سفارش خرید',icon:13,onClick:()=>{
                    let {SetState} = this.context;
                    SetState({popup:{mode:'peygiriye-sefareshe-kharid'}})
                }},
                {text:'جایزه ها',icon:15,onClick:()=>{}},
                {text:'حساب ها',icon:14,onClick:()=>{}},
                {text:'جزییات درخواست های گارانتی',icon:14,onClick:async ()=>{
                    let {SetState} = this.context;
                    let guaranteeItems = await services('kalahaye_garanti_shode');
                    SetState({guaranteeItems}) 
                    this.setState({popup:{mode:'joziate-darkhasthaye-garanti'}})
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
    getContent(){
        let {user = '',customerCode,shopName,visitorName,nationalCode,wallet,parts} = this.state;
        let {guaranteeItems,SetState} = this.context;
        return {
            scroll:'v',flex:1,className:'my-burux-page main-bg',
            column:[
                {
                    className:'my-burux-header',size:151,
                    html:(<img src={myBuruxHeaderSrc} alt='' style={{backgroundSize:'cover'}}/>)
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
                        {className:'color323130 size20 bold',html:user,align:'vh'},
                        {size:36,html:getSvg(12),align:'vh'},
                        {flex:1}
                    ]
                },
                {size:6},
                {
                    className:'box',gap:1,
                    column:[
                        {
                            gap:1,
                            row:[
                                this.getPanel({text1:'کد مشتری',text2:customerCode}),
                                this.getPanel({text1:'نام فروشگاه',text2:shopName})
                            ]
                        },
                        {
                            gap:1,
                            row:[
                                this.getPanel({text1:'ویزیتور',text2:visitorName}),
                                this.getPanel({text1:'کد ملی',text2:nationalCode})
                            ]
                        },
                        this.getPanel({text3:'مشاهده کامل اطلاعات کاربری'})
                    ]
                },
                {size:16},
                {
                    style:{overflow:'visible'},
                    row:[
                        this.getPanel({
                            text1:'کیف پول',text2:functions.splitPrice(wallet) + ' ریال',text3:'افزایش موجودی',
                            className:'box'
                        }),
                        this.getPanel({
                            text1:'کالا های گارانتی شده',text2:guaranteeItems.length + ' عدد',text3:'درخواست گارانتی جدید',
                            className:'box',
                            onClick:()=>SetState({popup:{mode:'guarantee-popup'}})
                        })
                    ]
                },
                {size:16},
                {
                    className:'box',gap:1,
                    column:parts.map(({text,icon,color,onClick})=>{
                        return {
                            attrs:{onClick:()=>onClick()},
                            size:60,
                            row:[
                                {size:60,html:getSvg(icon),align:'vh'},
                                {flex:1,html:text,align:'v',className:'color605E5C size14 bold',style:{color}},
                                {size:40,html:getSvg('chevronLeft'),align:'vh',style:{color}}
                            ]
                        }
                    })
                },
                {
                    size:96,html:getSvg(18),align:'vh'
                }
            ]
        }
    }
    render(){
        let {popup} = this.state;
        return (
            <>
                <RVD layout={this.getContent()}/>
                {
                    popup.mode === 'joziate-darkhasthaye-garanti' &&
                    <JoziateDarkhasthayeGaranti onClose={()=>this.setState({popup:{}})}/>
                }
            </>
        )
    }
}
class JoziateDarkhasthayeGaranti extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            searchValue:''
        }
    }
    render(){
        let {getHeaderLayout,guaranteeItems} = this.context;
        let {searchValue} = this.state;
        let {onClose} = this.props;
        return (
            <div className='popup-container'>
                <RVD
                    layout={{
                        className:'popup main-bg',
                        column:[
                            getHeaderLayout('جزيیات کالا های گارانتی',()=>onClose()),
                            {size:12},
                            {
                                html:<input type='text' placeholder='شماره درخواست گارانتی را جستجو کنید' value={searchValue} onChange={(e)=>{
                                    this.setState({searchValue:e.target.value})
                                }}
                                style={{
                                    height: 40,
                                    background: 'rgb(241, 241, 241)',
                                    border: 'none',
                                    borderRadius: 4,
                                    width: '100%',
                                    margin: '0 12px',
                                    padding: '0 12px',
                                    outline:'none',
                                    marginBottom: 12,
                                    fontFamily: 'inherit'
                                }}
                                />
                            },
                            {
                                flex:1,scroll:'v',gap:12,
                                column:[
                                    {
                                        gap:2,column:guaranteeItems.filter(({RequestID})=>{
                                            if(!searchValue){return true}
                                            if(!RequestID || RequestID === null){return false}
                                            return RequestID.toString().indexOf(searchValue) !== -1;
                                        }).map((o,i)=>{
                                            return {
                                                html:<GarantiCard {...o} isFirst={i === 0} isLast={i === guaranteeItems.length - 1}/>
                                            }
                                        })
                                    }
                                ]
                            }
                        ]
                    }}
                />
            </div>
        )
    }
}

class GarantiCard extends Component{
    getColor(color){
        if(color === 'آفتابی'){return '#F9E695'}
        if(color === 'مهتابی'){return '#a0def8'}
        if(color === 'یخی'){return '#edf0d8'}
    }
    render(){
        let {RequestID,CreateTime,_time,Details,isFirst,isLast} = this.props;
        return (
            <RVD
                layout={{
                    className:'box gap-no-color padding-12',
                    style:{
                        borderBottomLeftRadius:!isLast?0:undefined,
                        borderBottomRightRadius:!isLast?0:undefined,
                        borderTopLeftRadius:!isFirst?0:undefined,
                        borderTopRightRadius:!isFirst?0:undefined
                    },
                    column:[
                        {
                            size:48,childsProps:{align:'v'},
                            row:[
                                {html:'شماره درخواست :',className:'size14 color605E5C bold'},
                                {html:RequestID,className:'size14 color605E5C bold'},
                                {flex:1},
                                {html:_time,className:'size12 colorA19F9D'},
                                {size:6},
                                {html:CreateTime,className:'size12 colorA19F9D'}
                            ]
                        },
                        {
                            column:Details.map(({Name,Quantity},i)=>{
                                let height = 0,top = 0;
                                if(Details.length < 2){height = 0; top = 0;}
                                else if(i === 0){height = 18; top = 18;}
                                else if(i === Details.length - 1){height = 18; top = 0;}
                                else {height = 36; top = 0;}
                                return {
                                    size:36,childsProps:{align:'v'},gap:12,
                                    childsAttrs:{className:'size12 color605E5C'},
                                    row:[
                                        {html:<div style={{positon:'relative',width:10,height:10,background:'#0094D4',borderRadius:'100%'}}>
                                            <div style={{
                                                width:2,
                                                height,
                                                top,
                                                position:'absolute',
                                                left:'calc(50% - 1px)',
                                                background:'#0094D4'}}></div>
                                        </div>},
                                        {html:Name},
                                        {html:Quantity + ' عدد'},
                                        
                                    ]
                                }
                            })
                        }
                    ]
                }}
            />
        )
    }
}