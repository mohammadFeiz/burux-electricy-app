import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import functions from '../../../functions';
import Header from '../../header/header';
import TimerGauge from '../../timer-gauge/timer-gauge';
export default class JoziateSefaresheBazargah extends Component{
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
                        this.detailRow_layout('مبلغ پرداختی کل: ',functions.splitPrice(amount) + ' تومان'),
                        this.detailRow_layout('سود شما از فروش:',functions.splitPrice(benefit) + ' تومان'),
                        {size:12}
                    ]
                }
            ]
        }
    }
    time_layout(){
        let {totalTime,remainingTime} = this.props;
        return {
            row:[
                {flex:1},
                {size:110,html:<TimerGauge {...{totalTime,remainingTime}}/>,align:'vh'},
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
                            size:60,html:<button className='button-2'>اخذ سفارش</button>
                        }
                    ]
                }}
            />
        )
    }
}
