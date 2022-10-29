import React,{Component} from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import Main from './pages/main';
import Register from './components/register/register';
import reportWebVitals from './reportWebVitals';
import './index.css';
import logo1 from './images/logo1.png';
import RVD from 'react-virtual-dom';
import $ from 'jquery';

class OTPLogin extends Component{
  constructor(props){
    super(props);
    this.apiBaseUrl="https://retailerapp.bbeta.ir/api/v1";
    let storage = localStorage.getItem('brxelcrecodein');
    let recodeIn,phoneValue,mode = 'inter-phone';
    if(!storage || storage === null){
      localStorage.setItem('brxelcrecodein',JSON.stringify({recodeIn:false,phoneValue:""}));
      recodeIn = false;
      phoneValue = ''; 
    }
    else{
      storage = JSON.parse(storage);
      
      if(storage.recodeIn === false || new Date().getTime() >= storage.recodeIn){
        recodeIn = false;
        phoneValue = '';
      }
      else{
        recodeIn = storage.recodeIn;
        phoneValue = storage.phoneValue;
        mode = 'inter-code'
      }
    }
    this.state = {mode,phoneValue,codeValue:'4178',recodeIn,recode:false,recodeLimit:1 * 1000 * 60,isAutenticated:false,registered:false}
    setInterval(()=>{
      let {mode,recode,phoneValue} = this.state;
      if(mode !== 'inter-code' || recode){return}
      let {recodeIn} = this.state;
      let remainingTime = recodeIn - new Date().getTime();
      if(remainingTime <= 0){
        this.setState({recode:true})
        this.changeRecodeIn(false,phoneValue)
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
  async SMSToUser(phoneNumber){
    //فقط ترتیبی بده که پیامک برای کاربر ارسال شود و نیازی نیست اینجا چیزی ریترن شود یا استیت اپ تغییر کند
    
   const sendSmsResult=await Axios.get(`${this.apiBaseUrl}/Users/FirstStep?phoneNumber=${phoneNumber}`);

   if(sendSmsResult.data.isSuccess){
      let data=sendSmsResult.data.data;
      
      this.userId=data.id;
      this.setState({registered:data.alreadyRegistered})
   }
      
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
    if(this.userId !== undefined){
        const smsValidationResult=await Axios.get(`${this.apiBaseUrl}/Users/SecondStep?userId=${this.userId}&code=${code}`);
        console.log(smsValidationResult)
      debugger;
        if(smsValidationResult.data.isSuccess)
          return smsValidationResult.data.data;
        else
          alert(smsValidationResult.data.message);
    }
  
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  async onInterCode(codeValue = this.state.codeValue,showError){
    let res = await this.SendCodeToServer(codeValue);
    if(typeof res === 'object'){
      let token = res.accessToken.access_token;
      this.setState({isAutenticated:true,userInfo:res,token});
    }
    else{
      if(showError !== false){
        this.setState({mode:'error',codeValue:''})
      }
      
    }
  }
  tryAuto(value){
    this.onInterCode(value,false)
  }
  changeRecodeIn(recodeIn,phoneValue){
    this.setState({recodeIn,phoneValue});
    localStorage.setItem('brxelcrecodein',JSON.stringify({phoneValue,recodeIn}))
  }
  getSvg(){
    return (
      <svg width="100%" height="262" viewBox="0 0 411 262" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3577_15152)">
        <path fillRule="evenodd" clipRule="evenodd" d="M224 261.999C100.242 261.73 0 161.321 0 37.5C0 -86.4879 100.512 -187 224.5 -187C337.103 -187 430.344 -104.098 446.517 4H482V262H224.5H224V261.999Z" fill="#FDB913"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M192.028 245.736C77.6195 245.326 -15 152.135 -15 37.2376C-15 -77.9138 78.0294 -171.262 192.787 -171.262C279.207 -171.262 353.305 -118.323 384.63 -43H411V246H192.028V245.736Z" fill="url(#paint0_linear_3577_15152)"/>
        
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
    return {
      size:210,html:<img src={logo1} alt='' width='210' height='210' style={{borderRadius:24}}/>,align:'vh'
    }
  }
  onInterPhone(){
    let {recodeLimit,phoneValue} = this.state;
    this.SMSToUser(phoneValue);
    this.setState({mode:'inter-code',recode:false,codeValue:''})
    this.changeRecodeIn(new Date().getTime() + recodeLimit,phoneValue)
  }
  
  onRecode(){
    let {recodeLimit,phoneValue} = this.state;
    this.SMSToUser(phoneValue);
    this.setState({recode:false});
    this.changeRecodeIn(new Date().getTime() + recodeLimit,phoneValue)
  }
  onChangePhone(){
    this.setState({mode:'inter-phone'});
    this.changeRecodeIn(false,'')
  }
  getPhoneError(phoneValue){
    if(!phoneValue){return 'شماره همراه خود را وارد کنید'}
    if(!phoneValue.length){return 'شماره همراه خود را وارد کنید'}
    if(phoneValue.indexOf('09') !== 0){return 'شماره همراه باید با 09 شروع شود'}
    if(phoneValue.length !== 11){return 'شماره همراه باید 11 رقم باشد'}
    return false;
  }
  changePhoneValue(value){
    if(value.length && value[value.length - 1] === ' '){return }
    if(value.length > 11){return}
    if(value && isNaN(+value)){return}
    this.setState({phoneValue:value})
  }
  interPhone_layout(){
    let {phoneValue,mode} = this.state;
    if(mode !== 'inter-phone'){return false}
    let error = this.getPhoneError(phoneValue)
    let disabledStyle = {}
    if(error){disabledStyle = {background:'#ccc',border:'1px solid #ddd'}}
    return {
      column:[
        {
          style:{
            background:'#fff',margin:12,padding:12
          },
          column:[
            {html:'ورود | ثبت نام',className:'size20 color323130 bold padding-0-12'},
            {size:12},
            {html:'شماره تلفن همراه خود را وارد کنید. پیامکی حاوی کد برای شما ارسال میشود',className:'size14 color605E5C padding-0-12'},
            {size:24},
            {
              className:'padding-0-12',
              html:(
                <input 
                  type='text' value={phoneValue} onChange={(e)=>this.changePhoneValue(e.target.value)} placeholder='09...'
                  style={{height:40,background:'#eee',border:'1px solid #0094D4',borderRadius:6,width:'100%',direction:'ltr',padding:'0 12px',fontFamily:'inherit'}}
                />
              )
            },
            {
              html:error,size:24,align:'v',className:'padding-0-12 colorD83B01 size12 bold',style:{marginBottom:12}
            },
            {
              className:'padding-0-12',
              html:(<button disabled={!!error} className='button-2' style={disabledStyle} onClick={()=>this.onInterPhone()}>ورود</button>)
            }
          ]
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
      style:{
        background:'#fff',margin:12,padding:12
      },
      
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
              <>
              <input 
                className='otp-code'
                type='text' value={codeValue} 
                inputMode='numeric'
                pattern="[0-9]+"
                autoComplete='one-time-code'
                onChange={(e)=>{
                  let value = e.target.value;
                  if(value !== ''){
                    value = value.toString();
                    if(isNaN(+value[value.length - 1])){return}
                  }
                  if(value.toString().length > 4){return}
                  if(value.toString().length === 4){
                    this.tryAuto(value)
                  }
                  this.setState({codeValue:value})
                }} maxLength={4} placeholder='- - - -'
                
              />
              <div className='otp-code-presentation' onClick={()=>$('otp-code').focus()}>{
                codeValue.split('').join(' - ')
                }</div>
              </>
          )
        },
        {size:16},
        {
          show:false,
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
    localStorage.clear('brxelctoken');
    this.state.recodeIn = false;
    this.setState({isAutenticated:false})
    this.onChangePhone();
  }
  async interByStorage(){
    this.mounted = true;
    let storage = localStorage.getItem('brxelctoken');
    if(!storage || storage === null){this.setState({}); return;}
    storage = JSON.parse(storage);
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + storage.token;
    let res = await Axios.post(`${this.apiBaseUrl}/BOne/GetCustomer`, { "DocCode": storage.userInfo.cardCode });
    if(res.status === 401){
      this.setState({});
      return;
    }
    this.setState({isAutenticated:true,userInfo:storage.userInfo,token:storage.token,registered:true})
  }
  componentDidMount(){
    this.interByStorage();
  }
  render(){
    if(!this.mounted){return null}
    let {isAutenticated,userInfo,token,registered} = this.state;
    if(isAutenticated){
      if(!registered){
        return (
          <Register
            model={{mobile:userInfo.phoneNumber}}
            onClose={()=>{
              this.setState({isAutenticated:false})
            }}
            onSuccess={(userInfo)=>{
              this.setState({userInfo,registered:true})
            }}
          />
        )
      }
      localStorage.setItem('brxelctoken',JSON.stringify({token,userInfo}));
      return <Main logout={()=>this.logout()} token={token} userInfo={userInfo}/>
    }
    return (
      <RVD
        layout={{
          style:{position:'fixed',left:0,top:0,width:'100%',height:'100%',background:'#eff8fc'},
          column:[
            {size:48},
            this.header_layout(),
            {flex:1},
            this.interPhone_layout(),
            this.interCode_layout(),
            this.error_layout(),
            {flex:3}
          ]
        }}
      />
    )
  }
}
ReactDOM.render(<OTPLogin />,document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// import React,{Component} from 'react';
// import Axios from 'axios';
// import ReactDOM from 'react-dom';
// import Main from './pages/main';
// import Register from './components/register/register';
// import reportWebVitals from './reportWebVitals';
// import logo1 from './images/logo1.png';
// import RVD from 'react-virtual-dom';
// import OTPLogin from './otp-login/otp-login';
// import './index.css';

// class Login extends Component{
//   constructor(props){
//     super(props);
//     this.apiBaseUrl="https://retailerapp.bbeta.ir/api/v1";
//     this.state = {isAutenticated:false,registered:false}
//   }
//   async onInterPhone(phoneNumber){  
//     const sendSmsResult=await Axios.get(`${this.apiBaseUrl}/Users/FirstStep?phoneNumber=${phoneNumber}`);
//     if(sendSmsResult.data.isSuccess){
//       let data=sendSmsResult.data.data;
//       this.userId=data.id;
//       this.setState({registered:data.alreadyRegistered});
//       return true
//     }
//     else{
//       return 'خطا'
//     }

//   }
//   async onInterCode(code){
//     if(!this.userId){return;}
//     let res = await Axios.get(`${this.apiBaseUrl}/Users/SecondStep?userId=${this.userId}&code=${code}`);
//     if(res.data.isSuccess){
//       res = res.data.data;
//       let token = res.accessToken.access_token;
//       this.setState({isAutenticated:true,userInfo:res,token});
//     }
//     else{
//       return res.data.message;
//     }
//   }
//   logout(){
//     localStorage.clear('brxelctoken');
//     this.setState({isAutenticated:false})
//   }
//   async componentDidMount(){
//     this.mounted = true;
//     let storage = localStorage.getItem('brxelctoken');
//     if(!storage || storage === null){this.setState({}); return;}
//     storage = JSON.parse(storage);
//     Axios.defaults.headers.common['Authorization'] = 'Bearer ' + storage.token;
//     let res = await Axios.post(`${this.apiBaseUrl}/BOne/GetCustomer`, { "DocCode": storage.userInfo.cardCode });
//     if(res.status === 401){
//       this.setState({});
//       return;
//     }
//     this.setState({isAutenticated:true,userInfo:storage.userInfo,token:storage.token,registered:true})
//   }
//   render(){
//     if(!this.mounted){return null}
//     let {isAutenticated,userInfo,token,registered} = this.state;
//     if(isAutenticated){
//       if(!registered){
//         return (
//           <Register
//             model={{mobile:userInfo.phoneNumber}}
//             onClose={()=>{
//               this.setState({isAutenticated:false})
//             }}
//             onSuccess={(userInfo)=>{
//               this.setState({userInfo,registered:true})
//             }}
//           />
//         )
//       }
//       localStorage.setItem('brxelctoken',JSON.stringify({token,userInfo}));
//       return <Main logout={()=>this.logout()} token={token} userInfo={userInfo}/>
//     }
//     return (
//       <OTPLogin
//         header={<img src={logo1} alt='' width='210' height='210' style={{borderRadius:24}}/>}
//         footer={(
//           <RVD
//             layout={{
//               className:'padding-0-12',gap:3,
//               row:[
//                 {html:'ورود شما به معنای پذیرش',className:'size14 color605E5C'},
//                 {html:'قوانین و مقررات',className:'size14 color0094D4 bold'},
//                 {html:'بروکس است.',className:'size14 color605E5C'},
//               ]
//             }}
//           />
//         )}
//         timeLimit={60000}
//         onInterPhone={this.onInterPhone.bind(this)}
//         onInterCode={this.onInterCode.bind(this)}
//       />
//     )
//   }
// }







// ReactDOM.render(
//     <Login />
//   ,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
