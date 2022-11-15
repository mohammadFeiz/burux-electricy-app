import React,{Component,createRef} from 'react';
import RVD from 'react-virtual-dom';
import storeSvg from '../../utils/svgs/store-svg';
import Header from '../header/header';
import Form from '../form/form';
import Axios from 'axios';
import mapSrc from './../../images/map.png';
import Map from './../map/map';
import getSvg from '../../utils/getSvg';
import NeshanMap from '../neshan-map/neshan-map';
import $ from 'jquery';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.dom = createRef()
        let model = {
            "latitude": 35.699739,
            "longitude": 51.338097,
            "firstName": "",
            "lastName": "",
            "mobile": '',
            "storeName": "",
            "address": "",
            "province": "",
            "city": "",
            "landlineNumber": '',
            "email":""
        };
        model = {...model,...props.model}
        this.state = {
            model,
            showMap:false
        }
    }
    onClose(){
        let {onClose} = this.props;
        $(this.dom.current).animate({
            height: '0%',
            width: '0%',
            left:'50%',
            top:'100%',
            opacity:0
        }, 300,()=>onClose());
    }
    header_layout(){
        let {onClose,mode} = this.props;
        return {
            className:'box-shadow',size:60,style:{overflow:'visible',marginBottom:12,background:'#fff'},
            row:[
                {size:60,html:getSvg("chevronLeft", { flip: true }),align:'vh',attrs:{onClick:()=>this.onClose()}},
                {flex:1,html:mode === 'edit'?'ویرایش اطلاعات کاربری':'ثبت نام',className:'size16 color605E5C',align:'v'}
            ]
        }
    }
    logo_layout(){return {html:storeSvg,align:'vh'}}
    text_layout(){
        let {mode} = this.props;
        if(mode === 'edit'){return false}
        return {html:'به خانواده بزرگ بروکس بپیوندید',align:'h',className:'size20 color323130 bold'}
    }
    subtext_layout(){
        let {mode} = this.props;
        if(mode === 'edit'){return false}
        return {html:'بیش از 8000 فروشگاه در سطح کشور عضو این خانواده هستند',align:'vh',className:'size14 color605E5C'}
    }
    async register(){
        let {model} = this.state;
        let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Users/NewUser`, model);
        let result = false;
        try{result = res.data.isSuccess || false}
        catch{result = false}
        if(result){
            let {onSuccess} = this.props;
            onSuccess(res.data.data)
        }
        else{alert('خطا در برقراری ارتباط')}
    }
    async edit(){
        let {model} = this.state;
        let res = await Axios.post(`https://retailerapp.bbeta.ir/api/v1/Users/UpdateUser`, model);
        let result = false;
        try{result = res.data.isSuccess || false}
        catch{result = false}
        if(result){
            let {onClose} = this.props;
            onClose(model)
        }
        else{alert('خطا در برقراری ارتباط')}
    }
    footer_layout(){
        return false
        let {onInter} = this.props;
        return {
            size:48,align:'h',gap:12,
            row:[
                {html:'حساب دارید؟',className:'size12 color605E5C',align:'v'},
                {html:'ورود به حساب کاربری',className:'size12 color0094D4 bold',align:'v',attrs:{onClick:()=>onInter()}}
            ]
        }
    }
    form_layout(){
        let {model} = this.state;
        let {mode} = this.props;
        return {
            html:(
                <Form
                    lang={'fa'}
                    model={model}
                    bodyStyle={{background:'#fff'}}
                    inputStyle={{height:30,background:'#f5f5f5',border:'none'}}
                    labelAttrs={{className:'size14 color605E5C'}}
                    onSubmit={()=>mode === 'edit'?this.edit():this.register()}
                    submitText={mode === 'edit'?'ثبت':'ایجاد حساب کاربری'}
                    footerAttrs={{className:'main-bg padding-0-24'}}
                    onChange={(model)=>this.setState({model})}
                    inputs={[
                        {label:'کد مشتری',type:'text',field:'model.cardCode',disabled:true,show:mode === 'edit'},
                        {label:'نام',type:'text',field:'model.firstName',rowKey:'1',validations:[['required']]},
                        {type:'html',html:()=>'',rowKey:'1',rowWidth:12},
                        {label:'نام خانوادگی',type:'text',field:'model.lastName',rowKey:'1',validations:[['required']]},
                        {label:'ایمیل',type:'text',field:'model.email'},
                        {label:'تلفن همراه',type:'number',field:'model.mobile',rowKey:'3',disabled:false},
                        {type:'html',html:()=>'',rowKey:'3',rowWidth:12},
                        {label:'تلفن ثابت',type:'number',field:'model.landlineNumber',rowKey:'3'},
                        {label:'نام فروشگاه',type:'text',field:'model.storeName',validations:[['required']]},
                        {label:'ثبت موقعیت جغرافیایی',type:'html',html:()=>{
                            let {showMap,model} = this.state;
                            let {latitude,longitude} = model;
                            console.log(latitude,longitude)
                            if(showMap){return ''}
                            return (
                                <Map
                                    changeView={false}
                                    onClick={()=>this.setState({showMap:true})}
                                    latitude={model.latitude}
                                    longitude={model.longitude}
                                    style={{width:'100%',height:'120px'}}
                                />
                            )
                        }},
                        {label:'استان',type:'text',field:'model.province',rowKey:'2',validations:[['required']]},
                        {type:'html',html:()=>'',rowKey:'2',rowWidth:12},
                        {label:'شهر',type:'text',field:'model.city',rowKey:'2',validations:[['required']]},
                        {label:'آدرس',type:'textarea',field:'model.address',validations:[['required']]},
                        // {label:'شماره شبا',type:'text',field:'model.sheba'},
                        // {label:'شماره کارت بانکی',type:'number',field:'model.cardBankNumber'},
                        // {label:'نام دارنده کارت بانکی',type:'text',field:'model.cardBankName'},
                        
                    ]}
                />
            )
        }
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
    render(){
        let {showMap,model} = this.state;
        return (
            <>
                <RVD
                    layout={{
                        className:'main-bg',
                        attrs:{ref:this.dom},
                        style:{width:'100%',height:'100%',overflow:'hidden',position:'fixed',left:'50%',top:'100%',height:'0%',width:'0%',opacity:0},
                        column:[
                            this.header_layout(),
                            {size:12},
                            {
                                scroll:'v',flex:1,
                                column:[
                                    this.logo_layout(),
                                    {size:18},
                                    this.text_layout(),
                                    {size:6},
                                    this.subtext_layout(),
                                    {size:24},
                                    this.form_layout(),
                                    this.footer_layout(),
                                    {size:300}       
                                ]
                            }
                        ]
                    }}
                />
                {showMap && <ShowMap latitude={model.latitude} longitude={model.longitude} onClose={()=>this.setState({showMap:false})} onChange={(latitude,longitude)=>{
                    let {model} = this.state;
                    model.latitude = latitude;
                    model.longitude = longitude;
                    this.setState({model,showMap:false})
                }}/>}
            </>
        )
    }
}


class ShowMap extends Component{
    constructor(props){
        super(props);
        let {latitude = 35.699739,longitude = 51.338097} = props;
        this.state = {latitude,longitude};
    }
    header_layout(){
        let {onClose} = this.props;
        return {
            className:'box-shadow',size:60,style:{overflow:'visible',marginBottom:12,background:'#fff'},
            row:[
                {size:60,html:getSvg("chevronLeft", { flip: true }),align:'vh',attrs:{onClick:()=>onClose()}},
                {flex:1,html:'انتخاب موقعیت فروشگاه',className:'size16 color605E5C',align:'v'}
            ]
        }
    }
    map_layout(){
        let {latitude,longitude} = this.state;
        return {
            flex:1,
            html:(
                <Map
                    latitude={latitude} longitude={longitude} style={{width:'100%',height:'100%'}}
                    onChange={(latitude,longitude)=>this.setState({latitude,longitude})}
                />
            ),
            
        }
    }
    footer_layout(){
        let {onChange} = this.props;
        let {latitude,longitude} = this.state;
        return {
            size:72,style:{position:'absolute',bottom:12,left:12,width:'calc(100% - 24px)',overflow:'visible',zIndex:100000000000},
            className:'box-shadow',align:'vh',
            column:[
                {html:`Latitude:${latitude.toFixed(6)} - Lonitude:${longitude.toFixed(6)}`,style:{width:'100%',background:'rgba(255,255,255,.8)',color:'dodgerblue',fontSize:12,borderRadius:5},align:'h'},
                {size:6},
                {html:<button onClick={()=>onChange(latitude,longitude)} className='button-2 box-shadow'>تایید موقعیت</button>,style:{background:'orange',width:'100%'}},   
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{position:'fixed',left:0,top:0,width:'100%',height:'100%',zIndex:100},
                    column:[this.header_layout(),this.map_layout(),this.footer_layout()]
                }}
            />
        )
    }
}