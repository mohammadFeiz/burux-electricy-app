import React ,{Component} from 'react';
import ReactHtmlSlider from './../../components/react-html-slider/react-html-slider';
import HomeSlide1 from './../../images/home-slide-1.png';
import HomeSlide2 from './../../images/home-slide-2.png';
import HomeSlide3 from './../../images/home-slide-3.png';
import appContext from '../../app-context';
export default class Billboard extends Component{
    static contextType = appContext;
    render(){
        let {campaigns,services,SetState} = this.context;
        let {id} = this.props;
        let size= 160;
        let items = campaigns.map((campaign)=>{
            let {name,id} = campaign;
            let src = {'10181':HomeSlide1}[id];
            return (
                <img src={src} style={{height:size}} width='100%' onClick={async ()=>{
                    let products = await services({type:'getCampaignProducts',parameter:{campaign},cache:120,cacheName:'campaign' + id});
                    SetState({categoryZIndex:10,category:{products,name,src}})
                }}/>
            )
        })
        if(id === 'home'){
            items.push(<img src={HomeSlide2} alt="" width='100%' style={{height:size}}/>)
        }
        return <ReactHtmlSlider items={items} />
    }
}