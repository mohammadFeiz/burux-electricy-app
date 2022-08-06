import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import BazargahSVG from './../../utils/svgs/bazargah-svg';
import appContext from '../../app-context';
import Header from '../../components/header/header';
export default class Bazargah extends Component{
    static contextType = appContext;
    render(){
        return (
            <RVD
                layout={{
                    className:'main-bg',style:{width:'100%'},
                    column:[
                        {html:<Header buttons={{sidemenu:true,logo:true,gems:true}}/>},
                        {flex:1},
                        {html:BazargahSVG,align:'vh'},
                        {html:'بازارگاه',className:'color323130 size20 bold',align:'h'},
                        {html:'محلی برای اخذ و ارسال سفارش های مردمی',className:'color605E5C size16',align:'h'},
                        {size:12},
                        {html:'بزودی',className:'colorA19F9D size18',align:'h'},
                        {flex:1}
                    ]
                }}
            />
        )
    }
}