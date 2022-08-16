import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import storeSvg from '../../utils/svgs/store-svg';
import Form from '../form/form';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:{}
        }
    }
    header_layout(){
        return {
            size:36,
            html:'ثبت نام'
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
    button_layout(){
        return {
            html:<button className='button-2'>ایجاد حساب کاربری</button>,className:'margin-0-12'
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
        let {model} = this.state;
        return {
            html:(
                <Form
                    model={model}
                    inputs={[
                        {label:'نام',type:'text',field:'model.name',rowKey:'1'},
                        {type:'html',html:()=>'',rowKey:'1',rowWidth:12},
                        {label:'نام خانوادگی',type:'text',field:'model.family',rowKey:'1'},
                        {label:'شماره تلفن همراه',type:'text',field:'model.mobile'},
                        {label:'شماره تلفن ثابت',type:'text',field:'model.phone'},
                        {label:'نام فروشگاه',type:'text',field:'model.shopName'},
                        {label:'استان',type:'text',field:'model.state',rowKey:'2'},
                        {type:'html',html:()=>'',rowKey:'2',rowWidth:12},
                        {label:'شهر',type:'text',field:'model.city',rowKey:'2'},
                        {label:'آدرس',type:'textarea',field:'model.address'},
                        
                        
                        
                        
                    ]}
                />
            )
        }
    }
    render(){
        return (
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
                                this.footer_layout(),
                                
                            ]
                        }
                        
                        
                    ]
                }}
            />
        )
    }
}