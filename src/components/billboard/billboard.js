import React ,{Component} from 'react';
import ReactHtmlSlider from './../../components/react-html-slider/react-html-slider';
import HomeSlide1 from './../../images/home-slide-1.png';
import HomeSlide2 from './../../images/home-slide-2.png';
import appContext from '../../app-context';
export default class Billboard extends Component{
    static contextType = appContext;
    render(){
        let {campaigns,services,SetState} = this.context;
        let items = campaigns.map((campaign)=>{
            let {name,id} = campaign;
            let src = {'10181':HomeSlide1}[id];
            return (
                <img src={src} width='100%' onClick={async ()=>{
                    let products = await services({type:'getCampaignProducts',parameter:{campaign},cache:120,cacheName:'campaign' + id});
                    SetState({categoryZIndex:10,category:{products,name,src}})
                }}/>
            )
        })
        items.push(<img src={HomeSlide2} alt="" width='100%'/>)
        return <ReactHtmlSlider items={items} />
    }
}