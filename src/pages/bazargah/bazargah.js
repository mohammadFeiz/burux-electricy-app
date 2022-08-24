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
import BazargahCard from '../../components/bazargah-card/bazargah-card';
import Popup from '../../components/popup/popup';
import JoziateSefaresheBazargah from '../../components/bazargah/joziate-sefaresh/joziate-sefaresh';
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
    async getWaitToSend(){
        // let waitToSend = [
        //     {
        //       amount:1025340,distance:3500,benefit:200000,totalTime:30,remainingTime:10,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     },
        //     {
        //       amount:2120340,distance:700,benefit:120000,totalTime:30,remainingTime:2,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     },
        //     {
        //       amount:4423340,distance:900,benefit:300000,totalTime:30,remainingTime:26,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     },
        //     {
        //       amount:1623340,distance:1100,benefit:450000,totalTime:30,remainingTime:12,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     },
        //     {
        //       amount:2524340,distance:1600,benefit:100000,totalTime:30,remainingTime:20,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     },
        //     {
        //       amount:1324340,distance:500,benefit:50000,totalTime:30,remainingTime:5,address:'صیاد شیرازی، خیابان علامه امینی، بعد از باغ غدیر ...',
        //       items:[{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},{name:'لامپ LED جنرال 7 وات بروکس',detail:'آفتابی - 2 عدد',src:bulbSrc},],
        //       type:'waitToSend'
        //     }
        // ]
        let {services} = this.context;
        let waitToSend = await services({type:'bazargahCatched'})
        debugger;
        this.setState({waitToSend})
    }
    async componentDidMount(){
        this.getWaitToSend()
    }
    items_layout(){
        let {services,SetState} = this.context;
        let {activeTabId} = this.state;
        if(activeTabId !== 0){return false}
        let {bazargahItems} = this.context;
        if(bazargahItems.length === 0){
            return {
                size:400,html:<img src={bazargahNoItemSrc}/>,align:'vh'
            }
        }
        return {
            gap:12,flex:1,scroll:'v',
            column:bazargahItems.map((o,i)=>{
                return {
                    style:{overflow:'visible'},
                    html:(
                        <BazargahCard {...o} 
                            onCatch={async()=>{
                                let res = await services({type:'bazargahCatch',parameter:{orderId:o.orderId}})
                                if(res){
                                    SetState({bazargahItems:this.context.bazargahItems.filter((o,index)=>{
                                        return index !== i
                                    })})
                                    
                                }
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
    waitToSend_layout(){
        let {waitToSend,activeTabId} = this.state;
        if(activeTabId !== 1){return false}
        if(!waitToSend){return {size:96,align:'vh',html:'در حال بارگزاری'}}
        if(waitToSend.length === 0){return {size:96,align:'vh',html:'موردی وجود ندارد'}}
        return {
            gap:12,flex:1,scroll:'v',
            column:waitToSend.map((o)=>{
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
        return (
            <RVD
                layout={{
                    className:'main-bg',style:{width:'100%'},
                    column:[
                        {html:<Header title='بازارگاه' buttons={{sidemenu:true}}/>},
                        this.tabs_layout(),
                        this.notifType_layout(),
                        {size:12},
                        this.items_layout(),
                        this.waitToSend_layout(),
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