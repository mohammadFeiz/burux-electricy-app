import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import storeSvg from '../../utils/svgs/store-svg';
import Header from '../header/header';
import Form from '../form/form';
import mapSrc from './../../images/map.png';
import NeshanMap from '../neshan-map/neshan-map';
import appContext from '../../app-context';

export default class Register extends Component{
    static contextType = appContext;
    constructor(props){
        super(props);
        this.state = {
            model:{
                "latitude": 35.699739,
                "longitude": 51.338097,
                "firstName": "Ali",
                "lastName": "Ahmadi",
                "mobile": "09372046549",
                "storeName": "Ali Store",
                "address": "Lorestan, Khorram Abad",
                "province": "Lorestan",
                "city": "Khorram Abad",
                "landlineNumber": '02188050006',
                "email":"test12564@gmailo.com"
            },
            showMap:false
        }
    }
    header_layout(){
        let {onClose} = this.props;
        return {
            html:<Header buttons={{logo:true,gap:true}} onClose={()=>onClose()}/>
        }
    }
    logo_layout(){
        return {
            html:storeSvg,align:'vh'
        }
    }
    text_layout(){
        return {
            html:'به خانواده بزرگ بروکس بپیوندید',align:'h',
            className:'size20 color323130 bold'
        }
    }
    subtext_layout(){
        return {
            html:'بیش از 8000 فروشگاه در سطح کشور عضو این خانواده هستند',align:'vh',
            className:'size14 color605E5C'
        }
    }
    async register(){
        let {services} = this.context;
        let res = await services({type:'register',parameter:this.state.model})
        let {onClose} = this.props;
        onClose()
        this.setState({model:{
            "latitude": 35.699739,
            "longitude": 51.338097,
            "firstName": "",
            "lastName": "",
            "mobile": "",
            "storeName": "",
            "address": "",
            "province": "",
            "city": "",
            "landlineNumber": "",
            "email":""
        }})
    }
    button_layout(){
        return {
            html:<button className='button-2' onClick={()=>this.register()}>ایجاد حساب کاربری</button>,className:'margin-0-12'
        }
    }
    footer_layout(){
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
        let {model,showMap} = this.state;
        return {
            html:(
                <Form
                    lang={'fa'}
                    model={model}
                    theme={{rowHeight:70,rowGap:6}}
                    onChange={(model)=>this.setState({model})}
                    inputs={[
                        {label:'نام',type:'text',field:'model.firstName',rowKey:'1',validations:[['required']]},
                        {type:'html',html:()=>'',rowKey:'1',rowWidth:12},
                        {label:'نام خانوادگی',type:'text',field:'model.lastName',rowKey:'1',validations:[['required']]},
                        {label:'ایمیل',type:'text',field:'model.email',validations:[['required']]},
                        {label:'شماره تلفن همراه',type:'text',field:'model.mobile',validations:[['required']]},
                        {label:'شماره تلفن ثابت',type:'text',field:'model.landlineNumber',validations:[['required']]},
                        {label:'نام فروشگاه',type:'text',field:'model.storeName',validations:[['required']]},
                        {label:'ثبت موقعیت جغرافیایی',type:'html',html:()=>{
                            let {showMap,model} = this.state;
                            let {latitude,longitude} = model;
                            console.log(latitude,longitude)
                            if(showMap){return ''}
                            return (
                                <NeshanMap
                                    options={{
                                        key: 'web.3b7ae71ad0f4482e84b0f8c47e762b5b',
                                        center: [model.latitude, model.longitude],
                                        maptype:'standard-day',
                                        dragging:false,
                                        zoomControl:false,
                                        minZoom:12,
                                        maxZoom:12,
                                    }}
                                    
                                    onInit={(L, myMap) => {
                                        let marker = L.marker([latitude, longitude])
                                        .addTo(myMap)
                                        .bindPopup('I am a popup.');

                                        myMap.on('click', (e)=> {
                                        this.setState({showMap:true})
                                        });

                                        // L.circle([35.699739, 51.338097], {
                                        // color: 'dodgerblue',
                                        // fillColor: 'dodgerblue',
                                        // fillOpacity: 0.5,
                                        // radius: 1500
                                        // }).addTo(myMap);
                                    }}
                                    style={{
                                        width:'100%',
                                        height:'120px'
                                    }}
                                />
                            )
                        }},
                        {label:'استان',type:'text',field:'model.province',rowKey:'2'},
                        {type:'html',html:()=>'',rowKey:'2',rowWidth:12},
                        {label:'شهر',type:'text',field:'model.city',rowKey:'2'},
                        {label:'آدرس',type:'textarea',field:'model.address'}
                    ]}
                />
            )
        }
    }
    render(){
        let {showMap,latitude,longitude} = this.state;

        return (
            <>
                <RVD
                    layout={{
                        className:'main-bg',
                        style:{width:'100%',height:'100%',overflow:'hidden'},
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
                                    this.button_layout(),
                                    this.footer_layout()       
                                ]
                            }
                        ]
                    }}
                />
                {showMap && <ShowMap lat={latitude} lng={longitude} onClose={()=>this.setState({showMap:false})} onChange={(latitude,longitude)=>{
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
        return {
            html:<Header title='انتخاب موقعیت فروشگاه' onClose={()=>this.props.onClose()}/>
        }
    }
    setCoords({latitude,longitude}){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            this.setState({latitude,longitude})
        },500);
        
    }
    map_layout(){
        let {latitude,longitude} = this.state;
        let setCoords = this.setCoords.bind(this);
        return {
            flex:1,
            html:(
                <NeshanMap
                options={{
                    key: 'web.3b7ae71ad0f4482e84b0f8c47e762b5b',
                    center: [latitude, longitude],
                    zoom: 13,
                    maptype:'standard-day'
                    }}
                    onInit={(L, myMap) => {
                    let marker = L.marker([latitude, longitude])
                    .addTo(myMap)
                    .bindPopup('I am a popup.');

                    // myMap.on('click', function (e) {
                    //     debugger;
                    //     marker.setLatLng(e.latlng)
                    // });
                    myMap.on('move', function (e) {
                        //marker.setLatLng(e.target.getCenter())
                        let {lat,lng} = e.target.getCenter()
                        marker.setLatLng({lat,lng})
                        setCoords({latitude:lat,longitude:lng})
                    });

                    // L.circle([35.699739, 51.338097], {
                    // color: 'dodgerblue',
                    // fillColor: 'dodgerblue',
                    // fillOpacity: 0.5,
                    // radius: 1500
                    // }).addTo(myMap);
                }}
                style={{
                    width:'100%',
                    height:'100%'
                }}
            />
            )
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
                    column:[
                        this.header_layout(),
                        this.map_layout(),
                        this.footer_layout()
                    ]
                }}
            />
        )
    }
}