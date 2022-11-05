import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import NoSrc from './../../images/no-src.png';
import GeneralSrc from './../../images/general.png';
import GiantSrc from './../../images/giant.png';
import PaneliSrc from './../../images/paneli.png';
import appContext from '../../app-context';
export default class FamilyCard extends Component{
    static contextType = appContext;
    getSrc(title){
        if(title === 'جنرال'){return GeneralSrc}
        if(title === 'جاینت'){return GiantSrc}
        if(title === 'پنلی توکار'){return PaneliSrc}   
    }
    render(){
        let {SetState,kharidApis} = this.context;
        let {src,title,id,style,zIndex = 1} = this.props;
        return (
            <RVD
                layout={{
                    style:{height:180,width:140,borderRadius:12,fontSize:14,...style},
                    className:'bgFFF bold borderDDD theme-1-dark-bg theme-1-border3F4456',
                    attrs:{onClick:async ()=>{
                        SetState({
                            categoryZIndex:zIndex * 10,
                            category:{
                                name:'خانواده ی ' + title,
                                products:await kharidApis({type:'familyProducts',parameter:{id},cache:12 * 60,cacheName:`products-of-family-with-id-${id}`}) 
                            }
                        })
                    }},
                    column:[
                        {size:128,align:'vh',html:<img src={this.getSrc(title) || NoSrc} width={'100%'} style={{width:'100%',height:'100%'}} alt=''/>,style:{padding:6,paddingBottom:0}},
                        {align:'vh',html:title,className:'size12 padding-6-12 color575756 bold theme-1-colorDDD',style:{whiteSpace:'normal'}},
                        {flex:1},
                        {size:12}
                    ]
                }}
            />
        )
    }
}