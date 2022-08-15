import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import BazargahSVG from './../../utils/svgs/bazargah-svg';
import appContext from '../../app-context';
import Header from '../../components/header/header';
import Tabs from '../../components/tabs/tabs';
import getSvg from '../../utils/getSvg';
import AIOButton from '../../components/aio-button/aio-button';
import BazargahCard from '../../components/bazargah-card/bazargah-card';
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
            ]
        }
    }
    render(){
        let {bazargahItems} = this.context;
        let {activeTabId,notifTypes,notifType} = this.state;
        return (
            <RVD
                layout={{
                    className:'main-bg',style:{width:'100%'},
                    column:[
                        {html:<Header title='بازارگاه' buttons={{sidemenu:true}}/>},
                        {
                            html:(
                                <Tabs 
                                    tabs={[{title:'اطراف من',flex:1,id:0},{title:'اخذ شده',flex:1,id:1}]}
                                    activeTabId={activeTabId}
                                    onChange={(activeTabId)=>this.setState({activeTabId})}
                                />
                            )
                        },
                        {
                            size:48,className:'bgFFF box-shadow',
                            row:[
                                {size:36,html:getSvg(25),align:'vh'},
                                {html:'نحوه اعلان سفارشات جدید',align:'v',className:'size14 color605E5C',flex:1},
                                {
                                    html:(
                                        <AIOButton
                                            type='select'
                                            value={notifType}
                                            options={notifTypes}
                                            style={{background:'none'}}

                                        />
                                    )
                                }
                            ]
                        },
                        {size:12},
                        {
                            gap:12,flex:1,scroll:'v',
                            column:bazargahItems.map((o)=>{
                                return {
                                    html:<BazargahCard {...o} address={false}/>
                                }
                            })
                        },
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