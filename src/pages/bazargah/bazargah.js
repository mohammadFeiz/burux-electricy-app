import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import BazargahSVG from './../../utils/svgs/bazargah-svg';
import bazargahNoItemSrc from './../../images/bazargah-no-items.png';
import appContext from '../../app-context';
import bulbSrc from './../../images/10w-bulb.png';
import Header from '../../components/header/header';
import Tabs from '../../components/tabs/tabs';
import getSvg from '../../utils/getSvg';
import AIOButton from '../../components/aio-button/aio-button';
import ReactHtmlSlider from './../../components/react-html-slider/react-html-slider';
import Popup from '../../components/popup/popup';
//import functions from '../../../functions';
import functions from '../../functions';
import TimerGauge from '../../components/timer-gauge/timer-gauge';

export default class Bazargah extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            activeTabId:0,
            notifType:0,
            notifTypes:[
                {text:'پیامک و اعلان اپ',value:0},
                {text:'سایر موارد',value:1}
            ],
            showDetails:false
        }
    }
    wait_to_get_layout(){
        let {services,SetState} = this.context;
        let {activeTabId} = this.state;
        if(activeTabId !== 0){return false}
        let {bazargah} = this.context;
        if(!bazargah.wait_to_get){
            return {
                size:400,html:'در حال بارگزاری',className:'size12 color605E5C',align:'vh'
            }
        }
        if(bazargah.wait_to_get.length === 0){
            return {
                size:400,html:<img src={bazargahNoItemSrc}/>,align:'vh'
            }
        }
        return {
            gap:12,flex:1,scroll:'v',
            column:bazargah.wait_to_get.map((o,i)=>{
                return {
                    style:{overflow:'visible'},
                    html:(
                        <BazargahCard {...o} 
                            onExpired={()=>{
                                bazargah.wait_to_get = bazargah.wait_to_get.filter((o,index)=>index !== i)
                                SetState({bazargah})
                            }}
                            onShowDetails={()=>{
                                this.setState({showDetails:o})
                            }}
                        />
                    )
                }
            })
        }
    }
    wait_to_send_layout(){
        let {activeTabId} = this.state;
        if(activeTabId !== 1){return false}
        let {bazargah} = this.context;
        let {wait_to_send} = bazargah;
        if(!wait_to_send){return {size:96,align:'vh',html:'در حال بارگزاری'}}
        if(wait_to_send.length === 0){return {size:96,align:'vh',html:'موردی وجود ندارد'}}
        return {
            gap:12,flex:1,scroll:'v',
            column:wait_to_send.map((o)=>{
                return {style:{overflow:'visible'},html:<BazargahCard {...o}/>}
            })
        }
    }
    notifType_layout(){
        let {activeTabId,notifTypes,notifType} = this.state;
        if(activeTabId !== 0){return false}
        return {
            size:48,className:'bgFFF box-shadow',
            row:[
                {size:36,html:getSvg(25),align:'vh'},
                {html:'نحوه اعلان سفارشات جدید',align:'v',className:'size14 color605E5C',flex:1},
                {html:(<AIOButton type='select' value={notifType} options={notifTypes} style={{background:'none'}}/>)}
            ]
        }
    }
    tabs_layout(){
        let {activeTabId} = this.state;
        return {
            html:(
                <Tabs 
                    tabs={[{title:'اطراف من',flex:1,id:0},{title:'اخذ شده',flex:1,id:1}]}
                    activeTabId={activeTabId}
                    onChange={(activeTabId)=>this.setState({activeTabId})}
                />
            )
        }
    }
    renderInHome(){
        let {bazargah,SetState,services} = this.context;
        if(!bazargah.active || !bazargah.wait_to_get){return false}
        return (
            <RVD
                layout={{
                    style:{flex:'none',width:'100%'},
                    column:[
                        {
                            size:48,className:'padding-0-12',
                            row:[
                                {flex:1,html: "بازارگاه",className: "size14 color323130 bold padding-0-12",size: 48,align: "v"},
                                {html:'مشاهده همه',align:'v',className:'color0094D4 size12 bold',show:!!bazargah.wait_to_get.length,attrs:{onClick:()=>SetState({activeBottomMenu:'c'})}}
                            ]
                        },
                        {
                            size:48,show:bazargah.wait_to_get.length === 0,className:'box margin-0-12 padding-0-12 size14 color605E5C',align:'v',style:{marginBottom:12},
                            html:'سفارشی در نزدیکی شما ثبت نشده است' 
                        },
                        {
                            show:!!bazargah.wait_to_get.length, 
                            html:(
                                <ReactHtmlSlider
                                    autoSlide={5000} arrow={false}
                                    items={bazargah.wait_to_get.map((o,i)=>{
                                        return (
                                            <BazargahCard 
                                                {...o} items={false} address={false} 
                                                onExpired={()=>{
                                                    bazargah.wait_to_get = bazargah.wait_to_get.filter((o,index)=>index !== i)
                                                    SetState({bazargah})
                                                }}
                                                onShowDetails={()=>{
                                                    this.setState({showDetails:o})
                                                }}
                                            />
                                        )
                                    })}
                                />
                            )
                        }
                    ]
                }}
            />
        )
    }
    render(){
        let {showDetails} = this.state;
        if(showDetails){
            return (
                <Popup>
          <JoziateSefaresheBazargah
            {...showDetails}
            onClose={()=>this.setState({showDetails:false})}
          />
        </Popup>
            )
        }
        if(this.props.renderInHome){return this.renderInHome()}
        
        return (
            <RVD
                layout={{
                    className:'main-bg',style:{width:'100%'},
                    column:[
                        {html:<Header title='بازارگاه' buttons={{sidemenu:true}}/>},
                        this.tabs_layout(),
                        this.notifType_layout(),
                        {size:12},
                        this.wait_to_get_layout(),
                        this.wait_to_send_layout(),
                        {size:12},
                        // {flex:1},
                        // {html:BazargahSVG,align:'vh'},
                        // {html:'بازارگاه',className:'color323130 size20 bold',align:'h'},
                        // {html:'محلی برای اخذ و ارسال سفارش های مردمی',className:'color605E5C size16',align:'h'},
                        // {size:12},
                        // {html:'بزودی',className:'colorA19F9D size18',align:'h'},
                        // {flex:1}
                    ]
                }}
            />
        )
    }
}




class JoziateSefaresheBazargah extends Component{
    static contextType=appContext;
    header_layout(){
        return {
            html:(
                <Header title='جزییات سفارش' onClose={()=>this.props.onClose()}/>
            )
        }
    }
    detailRow_layout(label,value){
        return {
            size:28,className:'padding-0-24',
            row:[
                {html:label,className:'colorA19F9D size12',align:'v'},
                {flex:1},
                {html:value,className:'color323130 size12 bold',align:'v'}
            ]
        }
    }
    details_layout(){
        let {orderId,createdDate,receiverName,receiverNumber,shippingAddress,amount,benefit} = this.props;
        return {
            column:[
                {
                    column:[
                        this.detailRow_layout('کد سفارش',orderId),
                        this.detailRow_layout('تاریخ ثبت',createdDate),
                        {size:12}
                    ],
                    style:{borderBottom:'2px solid #ddd'}
                },
                {size:16},
                this.detailRow_layout('تحویل گیرنده',receiverName),
                this.detailRow_layout('موبایل',receiverNumber),
                {
                    column:[
                        {html:'آدرس',className:'colorA19F9D size12 padding-0-24'},
                        {html:shippingAddress,className:'color323130 size12 bold padding-0-24'}
                    ]
                },
                {size:16},
                {
                    style:{borderTop:'5px solid #ddd',borderBottom:'5px solid #ddd'},
                    column:[
                        {size:12},
                        this.detailRow_layout('مبلغ پرداختی کل: ',functions.splitPrice(amount) + ' ریال'),
                        this.detailRow_layout('سود شما از فروش:',functions.splitPrice(benefit) + ' ریال'),
                        {size:12}
                    ]
                }
            ]
        }
    }
    time_layout(){
        let {totalTime,orderDate} = this.props;
        return {
            row:[
                {flex:1},
                {size:110,html:<TimerGauge key={this.props.id} {...{totalTime,startTime:orderDate}}/>,align:'vh'},
                {align:'v',html:'مانده تا انقضای سفارش',className:'color605E5C size14'},
                {flex:1}
            ]
        }
    }
    hintItem_layout(color,text,number){
        let style = {width:24,height:24,background:color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,borderRadius:'100%'};
        return {
            row:[
                {size:48,align:'vh',html:<div style={style}>{number}</div>},
                {html:text,className:'color605E5C size12 bold',align:'v'}
            ]
        }
    }
    hint_layout(){
        return {
            className:'margin-0-12 padding-12-0 round-8',
            style:{border:'2px dotted #2BA4D8'},
            gap:12,
            column:[
                this.hintItem_layout('#FDB913','سفارش را اخذ کنید',1),
                this.hintItem_layout('#F15A29','کالاهای سفارش را بسته بندی کنید',2),
                this.hintItem_layout('#662D91','به نشانی تحویل ارسال کنید',3),
                this.hintItem_layout('#00B5A5','مبلغ سفارش به کیف پول شما واریز میشود',4),
            ]
        }
    }
    items_layout(){
        let {items} = this.props;
        if(!items){return false}
        return {
            flex:1,className:'margin-0-12',gap:1,style:{boxSizing:'border-box',width:'calc(100% - 24px)'},
            column:items.map((o,i)=>{
                return {html:this.item_layout({...o,isFirst:i === 0,isLast:i === items.length - 1})}
            })
        }
    }
    item_layout({src,name,detail,isFirst,isLast}){
        let borderRadius;
        if(isFirst && isLast){borderRadius = 8} 
        else if(isFirst){borderRadius = '8px 8px 0 0'}
        else if(isLast){borderRadius = '0 0 8px 8px'}
        else{borderRadius = 0}
        return (
            <RVD
                layout={{
                    style:{width:'100%',height:90,borderRadius,overflow:'hidden'},
                    className:'box',
                    row:[
                        {size:90,html:<img src={src} width='100%'/>,className:'padding-3'},
                        {
                            column:[
                                {flex:1},
                                {html:name,className:'color605E5C size12 bold'},
                                {html:detail,className:'color605E5C size12'},
                                {flex:1}
                            ]
                        }
                    ]
                }}
            />
        )
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{width:'100%',height:'100%'},
                    className:'main-bg',
                    column:[
                        this.header_layout(),
                        {
                            flex:1,scroll:'v',
                            column:[
                                this.details_layout(),
                                this.time_layout(),
                                this.hint_layout(),
                                {size:12},
                                this.items_layout()
                            ]
                        },
                        {
                            className:'padding-0-12',align:'v',
                            size:60,html:<button className='button-2' onClick={async ()=>{
                                let {services} = this.context;
                                let {orderId} = this.props;
                                let res = await services({type:'akhze_sefareshe_bazargah',parameter:{orderId}})
                                let {showMessage} = this.context;
                                if(res){
                                    showMessage('سفارش با موفقیت اخذ شد')
                                }
                                else{
                                    showMessage('اخذ سفارش با خطا روبرو شد')
                                }
                            }}>اخذ سفارش</button>
                        }
                    ]
                }}
            />
        )
    }
}

class BazargahCard extends Component{
    button_layout(){
        let {type = 'wait_to_get',deliveredDate,canseledDate,onSend,onShowDetails = ()=>{}} = this.props;
        let text = {
            'wait_to_get':'اخذ سفارش',
            'wait_to_send':'ارسال سفارش',
            'delivered':`تاریخ تحویل: ${deliveredDate}`,
            'canseled':`تاریخ لغو: ${canseledDate}`
        }[type];
        let onClick = {
            'wait_to_get':()=>onShowDetails(),
            'wait_to_send':()=>onSend()
        }[type]
        return {
            size:48,align:'v',
            row:[
                {flex:1,html:<button className='button-2' style={{height:32,margin:'0 12px'}} onClick={onClick}>{text}</button>}
            ]
        }
    }
    amount_layout(amount){
        return {
            gap:4,
            row:[
                {html:getSvg('cash'),size:36,align:'vh'},
                {html:'مبلغ سفارش:',className:'size14 color605E5C',align:'v'},
                {html:functions.splitPrice(amount),align:'v',className:'bold color323130 size14'},
                {html:'ریال',align:'v',className:'colorA19F9D size12'}
            ]
        }
    }
    distance_layout(distance){
        let distanceValue,distanceUnit;
        if(distance > 999){
            distanceValue = distance / 1000;
            distanceUnit = 'کیلومتر'
        }
        else{
            distanceValue = distance;
            distanceUnit = 'متر'
        }
        return {
            gap:4,
            row:[
                {html:getSvg('location'),size:36,align:'vh'},
                {html:'فاصله:',className:'size14 color605E5C',align:'v'},
                {html:distanceValue,align:'v',className:'bold color323130 size14'},
                {html:distanceUnit,align:'v',className:'colorA19F9D size12'}
            ]
        }
    }
    address_layout(address){
        if(!address){return false}
        return {
            gap:4,
            row:[
                {html:getSvg('address'),size:36,align:'vh'},
                {html:'آدرس:',className:'size14 color605E5C',align:'v'},
                {html:address,align:'v',className:'colorA19F9D size12'}
            ]
        }
    }
    benefit_layout(benefit){
        return false;
        if(!benefit){return false}
        return {
            gap:4,
            row:[
                {html:getSvg('benefit'),size:36,align:'vh'},
                {html:'سود:',className:'size14 colorF15A29',align:'v'},
                {html:functions.splitPrice(benefit),align:'v',className:'bold colorF15A29 size14'},
                {html:'ریال',align:'v',className:'colorF15A29 size12'}
            ]
        }
    }
    time_layout(totalTime,orderDate){
        let {onExpired,id} = this.props;
        return {size:110,align:'h',html:(<TimerGauge key={id} onExpired={()=>onExpired()} totalTime={totalTime} startTime={orderDate}/>)}
    }
    items_layout(items){
        if(!items){return false}
        return {
            flex:1,scroll:'h',gap:12,className:'margin-0-12',style:{boxSizing:'border-box',width:'calc(100% - 24px)'},
            row:items.map((o)=>{
                return {html:this.item_layout(o)}
            })
        }
    }
    item_layout({src,name,detail}){
        return (
            <RVD
                layout={{
                    style:{width:240,height:60,border:'1px solid #ddd',borderRadius:6,overflow:'hidden'},
                    row:[
                        {size:60,html:<img src={src} width='100%'/>,className:'padding-3'},
                        {
                            column:[
                                {flex:1},
                                {html:name,className:'color605E5C size12 bold'},
                                {html:detail,className:'color605E5C size12'},
                                {flex:1}
                            ]
                        }
                    ]
                }}
            />
        )
    }
    render(){
        let {amount,distance,benefit,totalTime,orderDate,address,items} = this.props;        
        return (
            <RVD
                layout={{
                    className:'box gap-no-color margin-0-12',
                    style:{direction:'rtl',overflow:'hidden'},
                    column:[
                        {
                            row:[
                                {
                                    flex:1,gap:6,
                                    column:[
                                        {size:12},
                                        this.amount_layout(amount),
                                        this.distance_layout(distance),
                                        this.benefit_layout(benefit),
                                        this.address_layout(address),
                                        {size:12}
                                    ]
                                },
                                this.time_layout(totalTime,orderDate),
                                
                            ]
                        },
                        this.items_layout(items),
                        {size:12},
                        this.button_layout()
                    ]
                }}
            />
        )
    }
}
