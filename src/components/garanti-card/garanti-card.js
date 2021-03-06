import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
export default class GarantiCard extends Component{
    getColor(color){
        if(color === 'آفتابی'){return '#F9E695'}
        if(color === 'مهتابی'){return '#a0def8'}
        if(color === 'یخی'){return '#edf0d8'}
    }
    getStatus(){
        let {StatusCode,StatusText} = this.props;
        let types = {'0':{text:'در حال بررسی',color:'#662D91'},'1':{text:'اعلام به ویزیتور',color:'#005478'}}
        let color = types[StatusCode.toString()].color;
        return <div style={{padding:'2px 12px',borderRadius:24,color,background:color + '30'}} className='size12'>{StatusText}</div>
    }
    render(){
        let {RequestID,CreateTime,_time,Details,isFirst,isLast,type = '1',StatusText} = this.props;
        if(type === '1'){
            return (
                <RVD
                    layout={{
                        className:'box gap-no-color padding-12',
                        style:{
                            borderBottomLeftRadius:!isLast?0:undefined,
                            borderBottomRightRadius:!isLast?0:undefined,
                            borderTopLeftRadius:!isFirst?0:undefined,
                            borderTopRightRadius:!isFirst?0:undefined
                        },
                        column:[
                            {
                                size:48,childsProps:{align:'v'},
                                row:[
                                    {html:'شماره درخواست :',className:'size14 color605E5C bold'},
                                    {html:RequestID,className:'size14 color605E5C bold'},
                                    {flex:1},
                                    {html:_time,className:'size12 colorA19F9D'},
                                    {size:6},
                                    {html:CreateTime,className:'size12 colorA19F9D'}
                                ]
                            },
                            {
                                column:Details.map(({Name,Quantity},i)=>{
                                    let height = 0,top = 0;
                                    if(Details.length < 2){height = 0; top = 0;}
                                    else if(i === 0){height = 18; top = 18;}
                                    else if(i === Details.length - 1){height = 18; top = 0;}
                                    else {height = 36; top = 0;}
                                    return {
                                        size:36,childsProps:{align:'v'},gap:12,
                                        childsAttrs:{className:'size12 color605E5C'},
                                        row:[
                                            {html:<div style={{positon:'relative',width:10,height:10,background:'#0094D4',borderRadius:'100%'}}>
                                                <div style={{
                                                    width:2,
                                                    height,
                                                    top,
                                                    position:'absolute',
                                                    left:'calc(50% - 1px)',
                                                    background:'#0094D4'}}></div>
                                            </div>},
                                            {html:Name},
                                            {html:Quantity + ' عدد'},
                                            
                                        ]
                                    }
                                })
                            }
                        ]
                    }}
                />
            )
        }
        if(type === '2'){
            return (
                <RVD
                    layout={{
                        className:'box gap-no-color padding-12',
                        style:{
                            borderBottomLeftRadius:!isLast?0:undefined,
                            borderBottomRightRadius:!isLast?0:undefined,
                            borderTopLeftRadius:!isFirst?0:undefined,
                            borderTopRightRadius:!isFirst?0:undefined,
                            overflowX:'hidden'
                        },
                        column:[
                            {
                                childsProps:{align:'v'},
                                row:[
                                    {html:'شماره گارانتی :',className:'size14 color323130 bold'},
                                    {html:RequestID,className:'size14 color323130 bold'},
                                    {flex:1},
                                    {html:this.getStatus()}
                                ]
                            },
                            {
                                childsProps:{align:'v'},
                                row:[
                                    {html:'تاریخ ثبت :',className:'size12 color605E5C'},
                                    {html:CreateTime,className:'size12 color605E5C'},
                                ]
                            },
                            {size:12},
                            {
                                scroll:'h',gap:12,
                                row:[
                                    {
                                        gap:6,
                                        row:Details.slice(0,5).map(({src},i)=>{
                                            return {
                                                size:36,gap:12,
                                                html:<img src={src} style={{width:36,height:36,border:'1px solid #ddd',borderRadius:6}}/>
                                            }
                                        })
                                    },
                                    {
                                        show:Details.length > 5,className:'color605E5C size12',align:'v',
                                        html:'+' + (Details.length - 5)
                                    }
                                ]
                                
                            },
                            
                        ]
                    }}
                />
            )
        }
    }
}