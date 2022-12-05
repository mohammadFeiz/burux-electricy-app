import React ,{Component} from 'react';
import ACS from './../../npm/aio-content-slider/aio-content-slider';
import HomeSlide2 from './../../images/home-slide-2.png';
import Sookhte from './../../images/banner1111.png';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import harajestan_svg from './../../svgs/harajestan';
import cheraghe_khatti_svg from './../../svgs/cheraghe-khatti';
import burux_dey_svg from './../../svgs/burux-dey';
import appContext from '../../app-context';
export default class Billboard extends Component{
    static contextType = appContext;
    render(){
        let {campaigns,kharidApis,SetState} = this.context;
        let {id} = this.props;
        let size= 160;
        let items = campaigns.map((campaign)=>{
            let {name,id,src} = campaign;
            return (
                <img src={src} width='100%' onClick={async ()=>{
                    let products = await kharidApis({type:'getCampaignProducts',parameter:campaign,cacheName:'campaign' + id});
                    SetState({categoryZIndex:10,category:{products,name,src}})
                }}/>
            )
        })
        //let items = [];
        if(id === 'home'){
            items.push(<img src={HomeSlide2} alt="" width='100%'/>)
            items.push(<img src={Sookhte} alt="" width='100%'/>)
        }
        return (
            <RVD
                layout={{
                    style:{width:'100%',maxWidth:600},
                    column:[
                        {html:<ACS items={items}/>},
                        {
                            show:id === 'buy',column:[
                                {html:'جشنواره ها',className:'size14 bold padding-0-24',size:36,align:'v'},
                                {
                                    row:campaigns.map((campaign,i)=>{
                                        let {name,id,src} = campaign;
                                        return {
                                            flex:1,align:'h',
                                            attrs:{onClick:async ()=>{
                                                let products = await kharidApis({type:'getCampaignProducts',parameter:campaign,cacheName:'campaign' + id});
                                                SetState({categoryZIndex:10,category:{products,name,src}})
                                            }},
                                            column:[
                                                {
                                                    html:()=>{
                                                        if(i === 0){return harajestan_svg()}
                                                        if(i === 1){return cheraghe_khatti_svg()}
                                                        if(i === 2){return burux_dey_svg()}
                                                    }
                                                },
                                                {size:3},
                                                {html:campaign.name,className:'size12 bold'}
                                            ]
                                        }
                                    })
                                },
                                {size:12}
                            ]
                        }

                    ]
                }}
            />
        )
    }
}