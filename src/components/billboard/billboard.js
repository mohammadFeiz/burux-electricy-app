import React ,{Component} from 'react';
import ReactHtmlSlider from './../../components/react-html-slider/react-html-slider';
import HomeSlide1 from './../../images/home-slide-1.png';
import HomeSlide2 from './../../images/home-slide-2.png';
import HomeSlide3 from './../../images/home-slide-3.png';
import Sookhte from './../../images/banner1111.png';
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
        return <div style={{width:'100%',maxWidth:600}}><ReactHtmlSlider items={items}/></div>
    }
}