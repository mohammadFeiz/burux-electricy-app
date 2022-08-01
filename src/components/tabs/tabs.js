import React,{Component} from 'react';
import RVD from 'react-virtual-dom';

export default class Tabs extends Component{
    badgeStyle(){
        return {background:'dodgerblue',padding:'0 3px',overflow:'hidden',color:'#fff',borderRadius:12,minWidth:12,height:18,margin:'0 3px',textAlign:'center'}
    }
    tab_layout({size,flex,id,title,badge = 0}){
        let {activeTabId,onChange} = this.props;
        if(typeof badge === 'function'){badge = badge()}
        let active = id === activeTabId;
        return {
            align: 'vh', size, flex, className: 'size12',
            attrs: { onClick: () => onChange(id) },
            style:active?{borderBottom:'2px solid',color:'dodgerblue'}:{},
            row: [
                { html: title, className: 'tab-title', align: 'v' },
                { show: badge !== undefined, html: <div style={this.badgeStyle()}>{badge}</div>, align: 'vh' }
            ]
        }
    }
    render(){
        let {tabs = []} = this.props;
        if(!tabs.length){return null}
        return (
            <RVD layout={{gap: 12,scroll:'v',style:{height:36},className: 'padding-0-24',row: tabs.map((o)=>this.tab_layout({...o}))}}/>
        )
    }
}