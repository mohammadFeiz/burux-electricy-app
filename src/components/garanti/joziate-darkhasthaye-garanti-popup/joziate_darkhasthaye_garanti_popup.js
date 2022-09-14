import React,{Component,createRef} from 'react';
import GarantiCard from './../garanti-card/garanti-card';
import Header from './../../header/header';
import RVD from 'react-virtual-dom';
import appContext from './../../../app-context';
import SearchBox from '../../search-box';
import $ from 'jquery';
import AIOButton from '../../aio-button/aio-button';
import {Icon} from '@mdi/react';
import noItemSrc from './../../../images/not-found.png';
import {mdiSort,mdiArrowDown,mdiArrowUp} from '@mdi/js'
export default class Joziate_Darkhasthaye_Garanti_Popup extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.dom = createRef();
        this.state = {
            searchValue:'',
            sorts:[
                {text:'مرتب سازی بر اساس تاریخ افزایشی',value:'0',before:(<Icon path={mdiArrowUp} size={0.8}/>)},
                {text:'مرتب سازی بر اساس تاریخ کاهشی',value:'1',before:(<Icon path={mdiArrowDown} size={0.8}/>)},
                {text:'مرتب سازی بر حسب تعداد اقلام افزایشی',value:'2',before:(<Icon path={mdiArrowUp} size={0.8}/>)},
                {text:'مرتب سازی بر حسب تعداد اقلام کاهشی',value:'3',before:(<Icon path={mdiArrowDown} size={0.8}/>)},
            ]
        }
    }
    onClose(){
        let {SetState} = this.context;
        $(this.dom.current).animate({
            height: '0%',
            width: '0%',
            left:'50%',
            top:'100%',
            opacity:0
        }, 300,()=>SetState({joziate_darkhasthaye_garanti_popup_zIndex:0}));
    }
    header_layout(){
        return {html:<Header title='جزيیات درخواست های گارانتی' onClose={()=>this.onClose()}/>}
    }
    componentDidMount(){
        $(this.dom.current).animate({
            height: '100%',
            width: '100%',
            left:'0%',
            top:'0%',
            opacity:1
        }, 300);
    }
    sort(value){
        let {guaranteeItems,SetState} = this.context;
        let res;
        if(value === '0'){
            res = this.Sort(guaranteeItems,[
                {dir:'inc',active:true,field:(o)=>{
                    let date = o.CreateTime.split('/');
                    if(date[1].length === 1){date[1] = '0' + date[1]}
                    if(date[2].length === 1){date[2] = '0' + date[2]}
                    let time = o._time.split(':');
                    if(time[0].length === 1){time[0] = '0' + time[0]}
                    if(time[1].length === 1){time[1] = '0' + time[1]}
                    if(time[2].length === 1){time[2] = '0' + time[2]}
                    let num = date.join('') + time.join('');
                    return +num
                }}
            ])
        }
        else if(value === '1'){
            res = this.Sort(guaranteeItems,[
                {dir:'dec',active:true,field:(o)=>{
                    let date = o.CreateTime.split('/');
                    if(date[1].length === 1){date[1] = '0' + date[1]}
                    if(date[2].length === 1){date[2] = '0' + date[2]}
                    let time = o._time.split(':');
                    if(time[0].length === 1){time[0] = '0' + time[0]}
                    if(time[1].length === 1){time[1] = '0' + time[1]}
                    if(time[2].length === 1){time[2] = '0' + time[2]}
                    let num = date.join('') + time.join('');
                    return +num
                }}
            ])
        }
        else if(value === '2'){
            res = this.Sort(guaranteeItems,[
                {dir:'inc',active:true,field:(o)=>{
                    let {Details = []} = o;
                    return Details.length;
                }}
            ])
        }
        else if(value === '3'){
            res = this.Sort(guaranteeItems,[
                {dir:'dec',active:true,field:(o)=>{
                    let {Details = []} = o;
                    return Details.length;
                }}
            ])
        }
        SetState({guaranteeItems:res})
    }
    Sort(model,sorts){
        return model.sort((a,b)=>{
          for (let i = 0; i < sorts.length; i++){
            let {field,dir,active} = sorts[i];
            if(!active){continue}
            let aValue = field(a),bValue = field(b);
            if ( aValue < bValue ){return -1 * (dir === 'dec'?-1:1);}
            if ( aValue > bValue ){return 1 * (dir === 'dec'?-1:1);}
            if(i === sorts.length - 1){return 0;}
          }
          return 0;
        });
    }
    render(){
        let {guaranteeItems,theme,joziate_darkhasthaye_garanti_popup_zIndex:zIndex} = this.context;
        let {searchValue,sorts} = this.state;
        return (
            <RVD
                layout={{
                    className:'fixed main-bg',
                    style:{zIndex,left:'50%',top:'100%',height:'0%',width:'0%',opacity:0},
                    attrs:{ref:this.dom},
                    column:[
                        this.header_layout(),
                        {
                            show:guaranteeItems.length !== 0,
                            row:[
                                {
                                    flex:1,html:<SearchBox placeholder='شماره درخواست گارانتی را جستجو کنید' value={searchValue} onChange={(searchValue)=>{
                                        this.setState({searchValue})
                                    }}/>,className:'margin-0-12 round-6'
                                },
                                {
                                    size:48,
                                    html:(
                                        <AIOButton
                                            text={<Icon path={mdiSort} size={0.8}/>}
                                            type={'select'} caret={false}
                                            style={{background:'#fff'}}
                                            options={sorts}
                                            optionClassName='"size12 color605E5C bold"'
                                            onChange={(value)=>this.sort(value)}
                                        />
                                    )
                                }                            ]
                        },
                        {size:12},
                        {
                            flex:1,scroll:'v',gap:12,show:guaranteeItems.length !== 0,
                            column:[
                                {
                                    gap:2,column:guaranteeItems.filter(({Details})=>{
                                        if(!searchValue){return true}
                                        for(let i = 0; i < Details.length; i++){
                                            let {Name} = Details[i];
                                            if(Name.indexOf(searchValue) !== -1){return true}
                                        }
                                        return false;
                                    }).map((o,i)=>{
                                        return {
                                            html:<GarantiCard {...o} isFirst={i === 0} isLast={i === guaranteeItems.length - 1}/>
                                        }
                                    })
                                }
                            ]
                        },
                        {
                            show:guaranteeItems.length === 0,
                            style:{background:'#eee',opacity:0.5},
                            flex:1,scroll:'v',gap:1,align:'vh',
                            column:[
                                {html:<img src={noItemSrc} alt='' width='128' height='128'/>},
                                {html:'سابقه ای موجود نیست',style:{color:'#858a95'}},
                                {size:60}
                            ]
                        }
                    ]
                }}
            />
        )
    }
}

