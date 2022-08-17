import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Gauge from 'r-gauger';
import getSvg from '../../utils/getSvg';
import functions from './../../functions';
export default class BazargahCard extends Component{
    button_layout(){
        let {type = 'free',deliveredDate,canseledDate,onCatch} = this.props;
        let text = {
            'free':'اخذ سفارش',
            'waitToSend':'ارسال سفارش',
            'delivered':`تاریخ تحویل: ${deliveredDate}`,
            'canseled':`تاریخ لغو: ${canseledDate}`
        }[type];
        let className = {
            'free':'button-2',
            'waitToSend':'button-2',
            'delivered':'',
            'canseled':''
        }[type]
        let onClick = {
            'free':()=>onCatch()
        }[type]
        return {
            size:48,align:'v',
            html:<button className={className} style={{height:32,margin:'0 12px'}} onClick={onClick}>{text}</button>
        }
    }
    amount_layout(amount){
        return {
            gap:4,
            row:[
                {html:getSvg('cash'),size:36,align:'vh'},
                {html:'مبلغ سفارش:',className:'size14 color605E5C',align:'v'},
                {html:functions.splitPrice(amount),align:'v',className:'bold color323130 size14'},
                {html:'تومان',align:'v',className:'colorA19F9D size12'}
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
        if(!benefit){return false}
        return {
            gap:4,
            row:[
                {html:getSvg('benefit'),size:36,align:'vh'},
                {html:'سود:',className:'size14 colorF15A29',align:'v'},
                {html:functions.splitPrice(benefit),align:'v',className:'bold colorF15A29 size14'},
                {html:'تومان',align:'v',className:'colorF15A29 size12'}
            ]
        }
    }
    time_layout(totalTime,remainingTime){
        let timeRate = remainingTime / totalTime;
        let timeColor;
        if(timeRate < 0.33){timeColor = 'red'}
        else if(timeRate < 0.66){timeColor = 'orange'}
        else {timeColor = 'green'}
        return {
            size:110,align:'h',
            html:(
                <Gauge
                    style={{width:100,height:120}} rotate={180} direction='clockwise'
                    label={{step:5,style:{offset:46,color:'#d5d5d5'}}}
                    start={0} radius={32} angle={360} end={totalTime} thickness={4}
                    text={[
                        {value:remainingTime,style:{top:-10,fontSize:16,color:timeColor}},
                        {value:'دقیقه',style:{top:10,fontSize:14,color:'#A19F9D',fontFamily:'IranSans_light'}}
                    ]}
                    ranges={[
                        {value:remainingTime,color:timeColor},
                        {value:totalTime,color:'#ddd'}
                    ]}
                />
            )
        }
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
        let {amount,distance,benefit,totalTime,remainingTime,address,items} = this.props;        
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
                                this.time_layout(totalTime,remainingTime),
                                
                            ]
                        },
                        this.items_layout(items),
                        this.button_layout()
                    ]
                }}
            />
        )
    }
}
