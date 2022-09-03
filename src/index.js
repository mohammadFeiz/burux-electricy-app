import React,{Component} from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import Main from './pages/main';
import Register from './components/register/register';
import reportWebVitals from './reportWebVitals';
import './index.css';
import RVD from 'react-virtual-dom';
import $ from 'jquery';

class OTPLogin extends Component{
  constructor(props){
    super(props);
    let recodeIn = localStorage.getItem('brxelcrecodein');
    console.log('init recodeIn',recodeIn)
    if(!recodeIn || recodeIn === null){
      localStorage.setItem('brxelcrecodein','false');
      recodeIn = false;
    }
    else{
      recodeIn = JSON.parse(recodeIn)
    }
    console.log('recodeIn',recodeIn)
    this.state = {mode:'inter-phone',phoneValue:'',codeValue:'',recodeIn,recode:false,recodeLimit:0.1 * 1000 * 60,isAutenticated:false}
    setInterval(()=>{
      let {mode,recode} = this.state;
      if(mode !== 'inter-code' || recode){return}
      let {recodeIn} = this.state;
      let remainingTime = recodeIn - new Date().getTime();
      if(remainingTime <= 0){
        this.setState({recode:true})
        this.changeRecodeIn(false)
        return
      }
      $('.remaining-time-to-resend-code').html(this.remainingTimeToClock(remainingTime))
    },1000)
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////// Fill By Backend Developer ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //!!!!!!حتما بعد از هر تغییر صفحه رو ریفرش کن!!!!!!!!!!!!!
  //این تابع زمانی کال می شود که کاربر شماره را وارد کرد و تایید رو زد
  SMSToUser(phoneNumber){
    //فقط ترتیبی بده که پیامک برای کاربر ارسال شود و نیازی نیست اینجا چیزی ریترن شود یا استیت اپ تغییر کند
    
    //Axios.post('url',phoneNumber)
  }

  //این تابع زمانی کال می شود که کاربر کد پیامک شده را وارد کرد و تایید رو زد
  async SendCodeToServer(code){
    
    //اگر کد وارد شده صحیح بود باید اطلاعات کاربر در قالب یک آبجکت ریترن شود
    //let res = await Axios.post('url',code)
    //let userInfo = {...}
    //return userInfo

    //اگر کد وارد شده اشتباه بود باید فالس ریترن شود 
    //let res = await Axios.post('url',code)
    //return false    
  
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  async onInterCode(){
    let {codeValue} = this.state;
    let res = await this.SendCodeToServer(codeValue);
    if(typeof res === 'object'){
      this.setState({isAutenticated:true,userInfo:res});
    }
    else{
      this.setState({mode:'error',codeValue:''})
    }
  }
  changeRecodeIn(value){
    console.log('changeRecodeIn',value)
    this.setState({recodeIn:value});
    localStorage.setItem('brxelcrecodein',JSON.stringify(value))
  }
  getSvg(){
    return (
      <svg width="411" height="262" viewBox="0 0 411 262" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3577_15152)">
        <path fillRule="evenodd" clipRule="evenodd" d="M224 261.999C100.242 261.73 0 161.321 0 37.5C0 -86.4879 100.512 -187 224.5 -187C337.103 -187 430.344 -104.098 446.517 4H482V262H224.5H224V261.999Z" fill="#FDB913"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M192.028 245.736C77.6195 245.326 -15 152.135 -15 37.2376C-15 -77.9138 78.0294 -171.262 192.787 -171.262C279.207 -171.262 353.305 -118.323 384.63 -43H411V246H192.028V245.736Z" fill="url(#paint0_linear_3577_15152)"/>
        <path d="M328.885 170.934C328.558 169.919 328.218 168.776 327.862 167.772C327.659 167.218 327.504 166.772 327.304 166.171C327.133 165.615 326.915 165.075 326.791 164.534H326.606C326.435 165.198 321.891 169.222 321.891 169.553C321.891 169.854 322.387 171.19 322.512 171.585L323.843 175.605C324.323 177.256 324.806 179.747 322.852 180.447C322.54 180.557 322.029 180.607 321.751 180.59C319.268 180.401 315.515 180.907 314.169 180.13C313.549 179.763 313.188 179.368 312.815 178.749C312.461 178.143 312.243 177.556 312.089 176.748C311.935 175.969 311.734 175.382 311.734 174.365V156.085H305.393V175.636C305.393 176.715 305.156 177.796 304.719 178.4C303.592 180.001 300.536 180.001 299.388 178.445C298.952 177.858 298.674 176.844 298.674 175.842V156.085H291.959V174.061C291.959 175.874 292.237 176.302 291.695 177.827C290.92 180.001 287.321 180.161 286.051 178.445C285.616 177.858 285.338 176.844 285.338 175.842V156.085H278.532V184.879C278.532 190.247 273.765 189.339 272.649 188.055C272.185 187.513 271.817 186.449 271.817 185.468V156.085H265.194V185.768C265.194 187.117 265.61 188.738 265.999 189.752C266.463 190.945 267.087 191.882 267.905 192.707C272.297 197.203 284.762 196.645 284.762 185.372C287.355 185.988 289.958 186.151 292.531 185.259C293.291 185.007 294.734 184.291 295.123 183.704C296.21 184.433 296.572 184.974 298.725 185.53C301.088 186.141 303.567 186.051 305.877 185.251C307.36 184.741 307.18 184.589 308.275 183.989C308.739 184.306 309.082 184.672 309.592 184.989C312.384 186.782 316.818 186.355 320.354 186.355C324.278 186.355 329.21 185.705 330.293 181.209C331.275 177.208 330.062 174.555 328.885 170.934ZM346.16 175.89C346.16 177.762 344.672 179.287 342.843 179.287C341.026 179.287 339.536 177.762 339.536 175.89V163.675C339.536 161.816 341.026 160.293 342.843 160.293C344.672 160.293 346.16 161.816 346.16 163.675V175.89ZM347.849 155.356C346.409 154.767 345.386 154.721 343.665 154.529C343.215 154.481 341.942 154.658 341.461 154.721C340.732 154.8 340.033 154.992 339.445 155.195C336.342 156.243 334.437 158.961 333.848 162.23C333.704 162.995 333.598 163.707 333.598 164.534V175.748C333.598 179.67 335.226 183.498 338.823 185.034C340.78 185.88 343.043 186.003 345.215 185.768C345.664 185.72 346.051 185.591 346.454 185.562C346.454 192.345 343.941 191.359 336.763 191.359V195.885C344.144 195.885 351.776 197.172 352.969 188.594C353.387 185.562 353.186 180.844 353.169 177.412L353.261 164.932C353.261 160.866 351.666 156.924 347.849 155.356ZM320.772 169.188C321.909 168.045 323.752 165.725 324.898 164.563C325.643 163.803 327.009 162.088 327.814 161.276L334.966 153.258C335.21 152.988 335.274 152.861 335.536 152.578C335.771 152.338 336.003 152.211 336.093 151.861H329.953C328.572 151.844 329.148 151.986 327.722 153.417C327.457 153.671 327.411 153.752 327.196 154.037C326.994 154.29 326.791 154.45 326.572 154.688L316.555 166.041C316.307 166.343 316.26 166.439 315.967 166.725C315.639 167.06 313.716 169.174 313.64 169.459H319.782C320.431 169.459 320.431 169.553 320.772 169.188ZM371.995 189.421C371.437 189.991 370.833 191.039 370.833 192.151C370.833 195.041 373.594 197.455 376.524 196.01C379.07 194.756 379.594 191.438 377.562 189.373C376.027 187.802 373.53 187.848 371.995 189.421ZM380.327 156.299V175.838C380.327 178.741 379.274 181.592 377.857 183.044C375.467 185.47 373.36 185.87 369.967 185.87C368.77 185.87 368.28 185.645 367.472 185.57C367.472 191.499 365.791 194.754 360.586 195.604C359.01 195.889 357.144 195.985 355.259 195.979C355.112 195.979 354.993 195.853 354.993 195.704L354.99 191.351C357.579 191.351 360.144 191.499 360.634 187.996C360.979 185.67 360.658 175.863 360.658 172.687V156.299H367.376V175.74C367.376 177.015 367.55 177.614 368.04 178.416C368.868 179.865 371.48 179.865 372.678 179.091C373.854 178.341 374.095 176.689 374.095 175.161V156.299H380.327Z" fill="white"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_3577_15152" x1="436.226" y1="-27.6042" x2="18.7453" y2="97.3783" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0094D4"/>
        <stop offset="0.990162" stopColor="#00B5A5"/>
        </linearGradient>
        <clipPath id="clip0_3577_15152">
        <rect width="429" height="262" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    )
  }
  header_layout(){
    return {html:this.getSvg()}
  }
  onInterPhone(){
    let {recodeIn,recodeLimit,phoneValue} = this.state;
    this.SMSToUser(phoneValue);
    this.setState({mode:'inter-code',recode:false,codeValue:''})
    this.changeRecodeIn(new Date().getTime() + recodeLimit)
  }
  
  
  onRecode(){
    let {recodeLimit,phoneValue} = this.state;
    this.SMSToUser(phoneValue);
    this.setState({recode:false});
    this.changeRecodeIn(new Date().getTime() + recodeLimit)
  }
  onChangePhone(){
    let {recodeLimit} = this.state;
    this.setState({mode:'inter-phone',phoneValue:''});
    this.changeRecodeIn(new Date().getTime() + recodeLimit)
  }
  interPhone_layout(){
    let {phoneValue,mode} = this.state;
    if(mode !== 'inter-phone'){return false}
    let disabled = phoneValue.toString().length < 11;
    let disabledStyle = {}
    if(disabled){disabledStyle = {background:'#ccc',border:'1px solid #ddd'}}
    return {
      column:[
        {html:'ورود | ثبت نام',className:'size20 color323130 bold padding-0-12'},
        {size:12},
        {html:'شماره تلفن همراه خود را وارد کنید. پیامکی حاوی کد برای شما ارسال میشود',className:'size14 color605E5C padding-0-12'},
        {size:24},
        {
          className:'padding-0-12',
          html:(
            <input 
              type='number' value={phoneValue} onChange={(e)=>this.setState({phoneValue:e.target.value})} placeholder='09...'
              style={{height:40,background:'#eee',border:'1px solid #0094D4',borderRadius:6,width:'100%',direction:'ltr',padding:'0 12px',fontFamily:'inherit'}}
            />
          )
        },
        {size:16},
        {
          className:'padding-0-12',
          html:(<button disabled={disabled} className='button-2' style={disabledStyle} onClick={()=>this.onInterPhone()}>ورود</button>)
        },
        {size:16},
        {
          className:'padding-0-12',gap:3,
          row:[
            {html:'ورود شما به معنای پذیرش',className:'size14 color605E5C'},
            {html:'قوانین و مقررات',className:'size14 color0094D4 bold'},
            {html:'بروکس است.',className:'size14 color605E5C'},
          ]
        }
      ]
    }
  }
  remainingTimeToClock(value){
    let minutes = Math.floor(value / 60000)
    let seconds = value - (minutes * 60000);
    seconds = Math.round(seconds / 1000).toString();
    if(seconds.length === 1){seconds = '0' + seconds}
    return `0${minutes} : ${seconds}`
  }
  interCode_layout(){
    let {codeValue,phoneValue,mode,recode} = this.state;
    if(mode !== 'inter-code'){return false}
    let disabled = codeValue.toString().length < 4;
    let disabledStyle = {}
    if(disabled){disabledStyle = {background:'#ccc',border:'1px solid #ddd'}}
    return {
      column:[
        {
          html:'کد تایید را وارد کنید',
          className:'size20 color323130 bold padding-0-12'
        },
        {size:12},
        {
          html:`کد تایید برای شماره ${phoneValue} پیامک شد`,
          className:'size14 color605E5C padding-0-12'
        },
        {size:24},
        {
          className:'padding-0-12',
          html:(
            <input 
              type='number' value={codeValue} onChange={(e)=>{
                let value = e.target.value;
                if(value.toString().length > 4){return}
                this.setState({codeValue:e.target.value})
              }} maxLength={4} placeholder='- - - -'
              style={{height:40,background:'#eee',border:'1px solid #0094D4',borderRadius:6,width:'100%',direction:'ltr',padding:'0 12px',fontFamily:'inherit',textAlign:'center'}}
            />
          )
        },
        {size:16},
        {
          className:'padding-0-12',
          html:(
            <button className='button-2' style={disabledStyle} onClick={()=>this.onInterCode()}>تایید</button>
          )
        },
        {size:16},
        {
          show:!!!recode,gap:3,
          className:'padding-0-12 size12 color605E5C',align:'h',
          row:[
            {html:'',style:{direction:'ltr'},className:'remaining-time-to-resend-code bold'},
            {html:'مانده تا دریافت مجدد کد'}
          ]
        },
        {
          className:'padding-0-12',show:!!recode,align:'h',
          html:(
            <button className='button-1' style={{width:'fit-content'}} onClick={()=>this.onRecode()}>دریافت مجدد کد</button>
          )
        },
        {size:12},
        {
          attrs:{onClick:()=>this.onChangePhone()},
          className:'padding-0-12 size14 color0094D4 bold',
          html:'تغییر شماره تلفن'
        }    
      ]
    }
  }
  error_layout(){
    let {mode} = this.state;
    if(mode !== 'error'){return false}
    return {
      column:[
        {html:'کد وارد شده صحیح نیست!',className:'size16 colorD83B01 bold',align:'vh'},
        {size:24},
        {html:(<button className='button-2' onClick={()=>this.setState({mode:'inter-code'})}>تلاش مجدد</button>)}
      ]
    }
  }
  logout(){
    this.state.recodeIn = false;
    this.setState({isAutenticated:false})
    this.onChangePhone();
  }
  render(){
    let {isAutenticated} = this.state;
    if(isAutenticated){
      return <Main logout={()=>this.logout()}/>
    }
    return (
      <RVD
        layout={{
          column:[
            this.header_layout(),
            {size:48},
            this.interPhone_layout(),
            this.interCode_layout(),
            this.error_layout()
          ]
        }}
      />
    )
  }
}





// export class BuruxAuth extends Component {
//   render(){
//     let {goToLanding} = this.props; 
//     let authClient = new Keycloak({
//       "realm": "burux",
//       "url": "https://iam.burux.com/auth/",
//       "ssl-required": "external",
//       "resource": "RetailerApp",
//       "public-client": true,
//       "verify-token-audience": true,
//       "use-resource-role-mappings": true,
//       "confidential-port": 0,
//       "clientId":'RetailerApp'
//     })
//     return (<div><ReactKeycloakProvider authClient={authClient}><Login goToLanding={goToLanding}/></ReactKeycloakProvider></div>);
//     // return <Main />;
//   }
// }
// function Login(props){
//   const obj = useKeycloak();
//   let {authenticated} = obj.keycloak;
//   if(!authenticated){
//     let {login} = obj.keycloak; 
//     try {login()} catch{let a = '';}
//     return null
//   }
//   let {tokenParsed} = obj.keycloak;
//   let {preferred_username:username,email,groups,name} = tokenParsed;
//   return (
//     <InternalLogin
//       data={{username,email,groups,logout:()=>{
//         obj.keycloak.logout();
//         //props.goToLanding()
//       },groups,name,token:obj.keycloak.token}}
//     />
//   )
// }
// class InternalLogin extends Component{
//   constructor(props){
//     super(props);
//     this.state = {init:true}
//   }
//   logout(){
//     let {data} = this.props;
//     data.logout()
//   }
//   render(){
//     return <Main logout={()=>this.logout()}/>
//   }
// }

ReactDOM.render(
    <OTPLogin />
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
