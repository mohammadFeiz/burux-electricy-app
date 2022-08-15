import React,{Component} from 'react';
import GarantiCard from './../garanti-card/garanti-card';
import Header from './../../header/header';
import RVD from 'react-virtual-dom';
import appContext from './../../../app-context';
import SearchBox from '../../search-box';
export default class Joziate_Darkhasthaye_Garanti_Popup extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            searchValue:''
        }
    }
    header_layout(){
        let {SetState} = this.context;
        return {html:<Header title='جزيیات درخواست های گارانتی' onClose={()=>SetState({joziate_darkhasthaye_garanti_popup_zIndex:0})}/>}
    }
    render(){
        let {guaranteeItems,theme,joziate_darkhasthaye_garanti_popup_zIndex:zIndex} = this.context;
        let {searchValue} = this.state;
        return (
            <RVD
                layout={{
                    className:'popup main-bg',
                    style:{zIndex},
                    column:[
                        this.header_layout(),
                        {
                            html:<SearchBox placeholder='شماره درخواست گارانتی را جستجو کنید' value={searchValue} onChange={(e)=>{
                                this.setState({searchValue:e.target.value})
                            }}/>,className:'margin-0-12 round-6'
                        },
                        {size:12},
                        {
                            flex:1,scroll:'v',gap:12,
                            column:[
                                {
                                    gap:2,column:guaranteeItems.filter(({RequestID})=>{
                                        if(!searchValue){return true}
                                        if(!RequestID || RequestID === null){return false}
                                        return RequestID.toString().indexOf(searchValue) !== -1;
                                    }).map((o,i)=>{
                                        return {
                                            html:<GarantiCard {...o} isFirst={i === 0} isLast={i === guaranteeItems.length - 1}/>
                                        }
                                    })
                                }
                            ]
                        }
                    ]
                }}
            />
        )
    }
}

