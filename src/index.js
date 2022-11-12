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
      size:210,html:<Logo/>,align:'vh'
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
                  type='text' tabIndex={0} 
                  onKeyDown={(e)=>{
                    if(e.keyCode === 13){this.onInterPhone()}
                  }} 
                  value={phoneValue} onChange={(e)=>this.changePhoneValue(e)} placeholder='09...'
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
          scroll:'v',
          column:[
            {size:48},
            this.header_layout(),
            {size:48},
            this.interPhone_layout(),
            this.interCode_layout(),
            this.error_layout(),
            {size:300}
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





class Logo extends Component{
  render(){
    return (
      <svg width="240" height="240" viewBox="0 0 361 361" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="361" height="361" rx="24"/>
<g clip-path="url(#clip0_4189_31387)">
<path d="M223.852 168.271H137.46C136.263 168.271 135.293 167.307 135.293 166.118V124.454C135.293 123.265 136.263 122.301 137.46 122.301C138.656 122.301 139.626 123.265 139.626 124.454V163.965H221.688V124.83C221.688 123.641 222.658 122.677 223.855 122.677C225.052 122.677 226.022 123.641 226.022 124.83V166.118C226.019 167.307 225.049 168.271 223.852 168.271Z" fill="white"/>
<path d="M230.355 129.487C223.701 129.487 218.047 123.961 217.75 117.171L217.316 107.136C217.265 105.949 218.19 104.944 219.387 104.894C220.584 104.832 221.59 105.763 221.643 106.952L222.078 116.987C222.274 121.505 225.988 125.184 230.355 125.184C232.351 125.184 234.187 124.401 235.526 122.978C236.956 121.463 237.665 119.419 237.522 117.218L236.869 107.183C236.793 105.997 237.696 104.974 238.89 104.896C240.067 104.857 241.116 105.721 241.191 106.905L241.844 116.94C242.066 120.338 240.945 123.529 238.685 125.922C236.519 128.223 233.562 129.487 230.355 129.487Z" fill="white"/>
<path d="M210.367 129.487C203.685 129.487 198.13 123.942 197.984 117.123L197.765 107.088C197.74 105.902 198.69 104.916 199.884 104.891C201.061 104.869 202.07 105.81 202.096 106.996L202.314 117.032C202.41 121.524 206.023 125.181 210.367 125.181C212.371 125.181 214.238 124.39 215.62 122.959C217.089 121.429 217.848 119.374 217.753 117.171L217.319 107.136C217.268 105.949 218.193 104.944 219.39 104.894C220.587 104.832 221.593 105.763 221.646 106.952L222.081 116.987C222.229 120.374 221.044 123.555 218.748 125.936C216.539 128.228 213.565 129.487 210.367 129.487Z" fill="white"/>
<path d="M190.374 129.487C183.666 129.487 178.212 123.919 178.212 117.079V107.044C178.212 105.855 179.182 104.891 180.378 104.891C181.575 104.891 182.545 105.855 182.545 107.044V117.079C182.545 121.546 186.057 125.184 190.377 125.184C192.389 125.184 194.287 124.387 195.708 122.942C197.224 121.404 198.031 119.341 197.984 117.126L197.765 107.091C197.74 105.905 198.69 104.919 199.884 104.894C201.061 104.871 202.07 105.813 202.096 106.999L202.314 117.034C202.387 120.413 201.137 123.582 198.802 125.955C196.557 128.234 193.564 129.487 190.374 129.487Z" fill="white"/>
<path d="M170.383 129.487C167.193 129.487 164.2 128.231 161.952 125.95C159.614 123.577 158.37 120.413 158.443 117.032L158.661 106.996C158.686 105.81 159.715 104.86 160.873 104.891C162.067 104.916 163.017 105.902 162.992 107.088L162.773 117.123C162.725 119.338 163.533 121.402 165.043 122.936C166.47 124.385 168.365 125.181 170.38 125.181C174.697 125.181 178.209 121.546 178.209 117.076V107.041C178.209 105.852 179.179 104.888 180.376 104.888C181.572 104.888 182.542 105.852 182.542 107.041V117.076C182.542 123.919 177.088 129.487 170.383 129.487Z" fill="white"/>
<path d="M150.39 129.487C147.191 129.487 144.215 128.225 142.006 125.936C139.71 123.555 138.528 120.374 138.673 116.987L139.108 106.952C139.161 105.765 140.195 104.838 141.364 104.894C142.558 104.944 143.486 105.949 143.436 107.136L143.001 117.171C142.906 119.377 143.663 121.432 145.134 122.959C146.519 124.393 148.383 125.181 150.387 125.181C154.729 125.181 158.342 121.524 158.44 117.032L158.658 106.996C158.684 105.81 159.712 104.86 160.87 104.891C162.064 104.916 163.014 105.902 162.989 107.088L162.77 117.123C162.627 123.942 157.072 129.487 150.39 129.487Z" fill="white"/>
<path d="M130.402 129.487C127.198 129.487 124.238 128.223 122.071 125.922C119.812 123.527 118.691 120.338 118.913 116.94L119.563 106.905C119.638 105.718 120.642 104.852 121.864 104.896C123.058 104.974 123.963 105.997 123.885 107.183L123.235 117.218C123.092 119.419 123.798 121.463 125.23 122.978C126.57 124.401 128.406 125.184 130.402 125.184C134.769 125.184 138.483 121.505 138.679 116.987L139.113 106.952C139.167 105.765 140.201 104.838 141.37 104.894C142.564 104.944 143.492 105.949 143.441 107.136L143.007 117.171C142.71 123.961 137.056 129.487 130.402 129.487Z" fill="white"/>
<path d="M239.274 109.197H219.642C218.661 109.197 217.803 108.542 217.551 107.601L208.929 75.6155C208.755 74.9693 208.893 74.2786 209.305 73.7494C209.714 73.2174 210.35 72.9055 211.023 72.9055H223.922C224.758 72.9055 225.517 73.3818 225.876 74.131L241.228 106.119C241.55 106.785 241.502 107.57 241.104 108.194C240.709 108.818 240.017 109.197 239.274 109.197ZM221.304 104.894H235.84L222.554 77.2114H213.843L221.304 104.894Z" fill="white"/>
<path d="M141.359 109.197H121.724C120.981 109.197 120.289 108.818 119.894 108.194C119.498 107.57 119.451 106.785 119.77 106.119L135.102 74.131C135.461 73.3818 136.221 72.9027 137.056 72.9027H149.955C150.628 72.9027 151.261 73.2146 151.673 73.7438C152.083 74.2758 152.22 74.9638 152.049 75.6099L143.452 107.601C143.2 108.542 142.34 109.197 141.359 109.197ZM125.155 104.894H139.696L147.138 77.2114H138.424L125.155 104.894Z" fill="white"/>
<path d="M219.516 109.197H199.884C198.836 109.197 197.942 108.453 197.751 107.428L191.904 75.4428C191.789 74.8134 191.96 74.17 192.375 73.6798C192.784 73.1896 193.395 72.9055 194.037 72.9055H211.023C212.007 72.9055 212.865 73.5628 213.117 74.5098L221.613 106.498C221.784 107.144 221.643 107.829 221.234 108.361C220.822 108.888 220.189 109.197 219.516 109.197ZM201.692 104.894H216.705L209.353 77.2114H196.633L201.692 104.894Z" fill="white"/>
<path d="M200.005 109.197H180.37C179.795 109.197 179.243 108.971 178.837 108.565C178.43 108.158 178.203 107.609 178.203 107.035L178.318 75.0473C178.324 73.8608 179.291 72.9027 180.485 72.9027H194.037C195.083 72.9027 195.977 73.6436 196.167 74.663L202.138 106.651C202.255 107.281 202.084 107.93 201.672 108.42C201.26 108.913 200.649 109.197 200.005 109.197ZM182.545 104.894H197.401L192.235 77.2114H182.643L182.545 104.894Z" fill="white"/>
<path d="M180.496 109.197H160.861C160.22 109.197 159.609 108.913 159.197 108.422C158.784 107.93 158.614 107.283 158.731 106.654L164.696 74.6657C164.887 73.6464 165.781 72.9055 166.826 72.9055H180.485C181.679 72.9055 182.652 73.8692 182.652 75.0585L182.663 107.047C182.663 107.618 182.433 108.163 182.029 108.567C181.626 108.971 181.071 109.197 180.496 109.197ZM163.465 104.894H178.329L178.318 77.2114H168.626L163.465 104.894Z" fill="white"/>
<path d="M160.985 109.197H141.35C140.677 109.197 140.044 108.888 139.635 108.358C139.226 107.829 139.085 107.141 139.256 106.495L147.746 74.507C147.996 73.56 148.856 72.9027 149.84 72.9027H166.627C167.266 72.9027 167.874 73.184 168.286 73.6686C168.699 74.156 168.872 74.7994 168.763 75.4261L163.121 107.414C162.938 108.448 162.036 109.197 160.985 109.197ZM144.161 104.894H159.166L164.048 77.2114H151.511L144.161 104.894Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M137.46 77.2114H223.852C225.049 77.2114 226.019 76.2477 226.019 75.0585V61.8008C226.019 55.8934 221.181 51.0889 215.239 51.0889H146.07C140.128 51.0889 135.293 55.8934 135.293 61.8008V75.0585C135.293 76.2477 136.263 77.2114 137.46 77.2114ZM163.545 65.0402H197.069C198.265 65.0402 199.235 64.0766 199.235 62.8873C199.235 61.698 198.265 60.7343 197.069 60.7343H163.545C162.348 60.7343 161.379 61.698 161.379 62.8873C161.379 64.0766 162.348 65.0402 163.545 65.0402Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M143.957 193.135H217.355C222.134 193.135 226.019 189.272 226.019 184.526V166.118C226.019 164.929 225.049 163.965 223.852 163.965H137.46C136.263 163.965 135.293 164.929 135.293 166.118V184.526C135.293 189.274 139.178 193.135 143.957 193.135ZM185.647 178.317C185.647 181.248 183.256 183.623 180.307 183.623C177.358 183.623 174.967 181.248 174.967 178.317C174.967 175.387 177.358 173.012 180.307 173.012C183.256 173.012 185.647 175.387 185.647 178.317Z" fill="white"/>
<path d="M209.485 158.398C209.85 158.398 210.216 158.264 210.505 157.977L217.412 151.117C217.97 150.563 217.97 149.646 217.412 149.092C216.854 148.538 215.93 148.538 215.372 149.092L208.465 155.952C207.907 156.506 207.907 157.423 208.465 157.977C208.754 158.264 209.119 158.398 209.485 158.398Z" fill="white"/>
<path d="M214.331 157.932C213.779 158.478 213.779 159.382 214.331 159.928C214.616 160.21 214.978 160.342 215.339 160.342C215.701 160.342 216.062 160.21 216.348 159.928L219.373 156.915C219.925 156.369 219.925 155.465 219.373 154.919C218.821 154.372 217.908 154.372 217.356 154.919L214.331 157.932Z" fill="white"/>
</g>
<path d="M205.783 242.306H201.98V246.108H205.783V242.306Z" fill="white"/>
<path d="M176.837 243.898H176.817C174.896 243.701 173.009 243.25 171.208 242.557C169.783 242.012 168.398 241.369 167.063 240.632C165.914 239.996 164.808 239.285 163.753 238.503L163.419 238.768C162.693 239.918 162.057 241.122 161.519 242.37C161.225 243.047 160.994 243.748 160.828 244.467C160.428 246.059 160.428 247.319 160.828 248.313C161.086 249.206 161.62 249.995 162.355 250.568C162.484 250.67 162.621 250.769 162.764 250.859C163.104 251.091 163.456 251.302 163.82 251.492C164.389 251.794 164.975 252.062 165.575 252.294L166.578 252.688L170.348 254.166C172.4 254.982 174.545 255.54 176.735 255.828C177.54 255.935 178.35 255.99 179.162 255.995V244.015C178.386 244.015 177.61 243.976 176.837 243.898Z" fill="white"/>
<path d="M91.3137 230.518V269.683H93.6529C95.5958 269.705 97.5067 269.187 99.1733 268.187C100.807 267.212 102.171 265.844 103.141 264.207C104.131 262.539 104.644 260.63 104.623 258.689V230.518H91.3137Z" fill="white"/>
<path d="M108.427 230.518V269.683H110.698C112.587 269.706 114.445 269.188 116.065 268.187C117.651 267.212 118.975 265.843 119.917 264.207C120.879 262.539 121.377 260.63 121.356 258.689V230.518H108.427Z" fill="white"/>
<path d="M136.124 221.773C134.189 221.751 132.286 222.257 130.616 223.237C128.977 224.205 127.61 225.573 126.642 227.215C125.648 228.886 125.135 230.8 125.161 232.745V260.938H138.47V221.773H136.124Z" fill="white"/>
<path d="M67.7801 262.458C65.8283 262.477 63.9081 261.965 62.2248 260.976C60.5659 260.006 59.1825 258.628 58.206 256.972C57.2058 255.292 56.6873 253.369 56.7073 251.414V231.659H76.8566C78.7401 231.641 80.5896 232.161 82.1878 233.159C83.7737 234.146 85.0928 235.508 86.029 237.125C86.9937 238.772 87.5048 240.646 87.5103 242.555V251.556C87.5288 253.49 87.0024 255.391 85.9912 257.039C85.0038 258.672 83.6218 260.03 81.9724 260.988C80.2942 261.963 78.3838 262.466 76.4433 262.444L67.7801 262.458ZM70.1518 249.002H74.0775V245.074H70.1518V249.002Z" fill="white"/>
<path d="M187.547 244.085H180.007C179.231 244.077 178.457 244.022 177.687 243.922H177.667C176.448 243.754 175.245 243.482 174.07 243.109C172.149 242.485 170.276 241.714 168.467 240.803C168.312 240.728 168.154 240.66 167.992 240.602C167.012 240.25 165.947 240.233 164.957 240.553C163.967 240.873 163.106 241.513 162.505 242.376C162.213 243.062 161.984 243.774 161.82 244.502C161.423 246.116 161.423 247.394 161.82 248.402C162.076 249.307 162.606 250.107 163.334 250.687C163.462 250.791 163.598 250.891 163.74 250.983L167.533 252.837C169.161 253.625 170.786 254.421 172.409 255.226C168.467 257.221 163.792 258.528 159.744 258.369C157.838 258.289 155.486 257.836 154.364 256.077C153.659 254.96 153.294 253.283 153.372 250.859C153.45 248.73 154.416 244.203 155.907 242.607L148.018 234.701C144.442 238.399 142.534 245.345 142.299 250.433C142.09 255.385 143.169 259.303 145.121 262.334C148.311 267.259 153.737 269.388 159.332 269.654C159.738 269.675 160.15 269.684 160.564 269.684C167.702 269.684 175.825 266.727 181.477 262.883C182.369 262.279 183.07 261.425 183.497 260.425C183.924 259.424 184.059 258.319 183.885 257.242C183.789 256.633 183.696 256.021 183.618 255.403H187.562C187.956 255.402 188.334 255.241 188.612 254.957C188.891 254.673 189.048 254.288 189.05 253.886V245.596C189.047 245.193 188.887 244.807 188.605 244.524C188.324 244.24 187.943 244.083 187.547 244.085Z" fill="white"/>
<path d="M103.072 216.829H93.2575C93.2475 216.828 93.2376 216.831 93.2297 216.837C93.2218 216.843 93.2166 216.852 93.2151 216.862V226.673C93.2158 226.684 93.2205 226.694 93.2283 226.702C93.2361 226.71 93.2465 226.715 93.2575 226.715H103.072C103.094 226.715 103.103 226.694 103.103 226.673V216.862C103.091 216.829 103.072 216.829 103.072 216.829Z" fill="white"/>
<path d="M203.988 255.605C205.578 255.621 207.141 255.202 208.511 254.395C209.864 253.608 210.991 252.486 211.785 251.136C212.6 249.766 213.023 248.199 213.008 246.605V230.518H196.595C195.06 230.503 193.553 230.928 192.252 231.742C190.957 232.545 189.88 233.655 189.115 234.973C188.33 236.315 187.914 237.841 187.909 239.396V246.736C187.895 248.312 188.323 249.86 189.144 251.205C189.951 252.534 191.076 253.639 192.418 254.422C193.787 255.219 195.345 255.631 196.929 255.614L203.988 255.605ZM202.062 244.642H198.867V241.443H202.062V244.642Z" fill="white"/>
<path d="M200.078 245.728H180.683V255.614H200.078V245.728Z" fill="white"/>
<path d="M254.855 230.518V269.683H257.194C259.137 269.705 261.048 269.187 262.714 268.187C264.348 267.212 265.712 265.844 266.682 264.207C267.672 262.539 268.185 260.63 268.164 258.689V230.518H254.855Z" fill="#3B55A5"/>
<path d="M221.008 230.518V269.683H223.279C225.168 269.706 227.026 269.188 228.647 268.187C230.232 267.212 231.556 265.843 232.499 264.207C233.46 262.539 233.958 260.63 233.938 258.689V230.518H221.008Z" fill="#3B55A5"/>
<path d="M248.705 221.773C246.771 221.751 244.867 222.257 243.198 223.237C241.559 224.205 240.191 225.573 239.224 227.215C238.229 228.886 237.716 230.8 237.742 232.745V260.938H251.052V221.773H248.705Z" fill="#3B55A5"/>
<path d="M282.932 221.773C280.998 221.751 279.094 222.257 277.424 223.237C275.785 224.205 274.418 225.573 273.45 227.215C272.456 228.886 271.943 230.8 271.969 232.745V260.938H285.278V221.773H282.932Z" fill="#3B55A5"/>
<path d="M266.614 216.829H256.798C256.789 216.828 256.779 216.831 256.771 216.837C256.763 216.843 256.758 216.852 256.756 216.862V226.673C256.757 226.684 256.762 226.694 256.769 226.702C256.777 226.71 256.787 226.715 256.798 226.715H266.614C266.635 226.715 266.644 226.694 266.644 226.673V216.862C266.632 216.829 266.614 216.829 266.614 216.829Z" fill="#3B55A5"/>
<path d="M304.293 246.679V234.865H291.422V245.914C291.422 246.54 290.795 247.026 290.03 247.026H284.116C283.838 247.026 283.42 247.235 283.42 253.975C283.42 260.508 283.838 260.925 284.116 260.925H290.03C298.727 260.925 304.293 255.365 304.293 246.679ZM296.292 275.171V265.095H283.073V275.171H296.292Z" fill="#3B55A5"/>
<line x1="59" y1="290.671" x2="302" y2="290.671" stroke="white"/>
<path d="M110.366 312.294C109.843 312.294 109.376 312.22 108.967 312.073C108.558 311.92 108.212 311.705 107.928 311.427C107.77 311.59 107.601 311.729 107.421 311.844C107.241 311.953 107.053 312.043 106.856 312.114C106.665 312.179 106.472 312.226 106.275 312.253C106.079 312.28 105.888 312.294 105.703 312.294C105.544 312.294 105.392 312.288 105.244 312.278C105.097 312.267 104.955 312.245 104.819 312.212C104.683 312.179 104.552 312.13 104.426 312.065C104.301 311.999 104.178 311.912 104.058 311.803V312.4C104.058 313.862 103.663 314.942 102.872 315.64C102.086 316.338 100.916 316.688 99.3616 316.688H97.7662C97.0516 316.688 96.3971 316.57 95.8025 316.336C95.208 316.101 94.6925 315.766 94.2562 315.329C93.8253 314.898 93.4898 314.375 93.2498 313.758C93.0098 313.148 92.8898 312.458 92.8898 311.688C92.8898 310.974 92.9962 310.232 93.2089 309.463C93.4271 308.688 93.7489 307.854 94.1744 306.959L95.7862 307.745C95.4098 308.514 95.1125 309.215 94.8944 309.848C94.6762 310.48 94.5671 311.086 94.5671 311.664C94.5671 312.117 94.6435 312.539 94.7962 312.932C94.9544 313.325 95.1753 313.666 95.4589 313.955C95.7425 314.249 96.0807 314.481 96.4735 314.65C96.8498 314.814 97.2671 314.896 97.7253 314.896H99.3616C99.9671 314.896 100.458 314.838 100.834 314.724C101.216 314.615 101.511 314.454 101.718 314.241C101.931 314.028 102.075 313.767 102.152 313.456C102.228 313.145 102.266 312.793 102.266 312.4V306.64H104.058V308.236C104.058 308.732 104.104 309.13 104.197 309.43C104.29 309.725 104.413 309.954 104.565 310.118C104.723 310.276 104.901 310.382 105.097 310.437C105.293 310.486 105.495 310.51 105.703 310.51C105.828 310.51 105.97 310.488 106.128 310.445C106.292 310.401 106.444 310.325 106.586 310.216C106.728 310.107 106.845 309.962 106.938 309.782C107.036 309.602 107.085 309.376 107.085 309.103V306.64H108.869V309.185C108.88 309.643 109.003 309.978 109.237 310.191C109.472 310.404 109.843 310.51 110.35 310.51C110.437 310.505 110.549 310.486 110.685 310.453C110.827 310.42 110.963 310.355 111.094 310.257C111.231 310.158 111.345 310.019 111.438 309.839C111.536 309.654 111.585 309.408 111.585 309.103C111.585 308.983 111.574 308.836 111.553 308.661C111.531 308.487 111.503 308.298 111.471 308.097C111.438 307.895 111.4 307.69 111.356 307.483C111.318 307.27 111.277 307.071 111.233 306.886C111.195 306.695 111.157 306.526 111.119 306.378C111.081 306.226 111.051 306.108 111.029 306.027L112.731 305.511C112.742 305.544 112.763 305.631 112.796 305.773C112.834 305.909 112.875 306.081 112.919 306.288C112.963 306.49 113.009 306.717 113.058 306.968C113.107 307.218 113.151 307.472 113.189 307.728C113.233 307.985 113.268 308.233 113.295 308.473C113.323 308.713 113.336 308.923 113.336 309.103C113.336 309.638 113.249 310.104 113.074 310.502C112.9 310.9 112.671 311.23 112.387 311.492C112.109 311.754 111.793 311.953 111.438 312.089C111.083 312.22 110.726 312.288 110.366 312.294ZM107.666 303.098L106.357 304.423L105.048 303.114L106.357 301.788L107.666 303.098ZM111.176 303.065L109.883 304.374L108.533 303.081L109.859 301.756L111.176 303.065ZM109.368 300.758L108.141 301.985L106.93 300.774L108.157 299.547L109.368 300.758ZM115.84 314.896C116.685 314.896 117.378 314.836 117.918 314.716C118.458 314.596 118.883 314.408 119.194 314.151C119.32 314.048 119.429 313.936 119.522 313.816C119.62 313.701 119.699 313.568 119.759 313.415C119.824 313.268 119.873 313.101 119.906 312.916C119.944 312.736 119.966 312.528 119.972 312.294H118.589C118.191 312.294 117.787 312.239 117.378 312.13C116.974 312.016 116.606 311.828 116.273 311.566C115.946 311.304 115.676 310.958 115.463 310.527C115.256 310.096 115.152 309.564 115.152 308.931C115.152 308.56 115.182 308.228 115.242 307.933C115.308 307.638 115.39 307.377 115.488 307.148C115.586 306.913 115.695 306.711 115.815 306.542C115.935 306.373 116.052 306.226 116.167 306.1C116.478 305.789 116.832 305.549 117.231 305.38C117.634 305.206 118.068 305.118 118.532 305.118C118.935 305.118 119.312 305.181 119.661 305.307C120.015 305.432 120.332 305.62 120.61 305.871C120.986 306.226 121.27 306.673 121.461 307.213C121.657 307.753 121.755 308.399 121.755 309.152V312.171C121.755 312.564 121.725 312.924 121.665 313.251C121.605 313.584 121.515 313.887 121.395 314.159C121.281 314.438 121.133 314.688 120.953 314.912C120.773 315.141 120.561 315.354 120.315 315.55C120.07 315.741 119.8 315.908 119.505 316.049C119.211 316.197 118.881 316.317 118.515 316.409C118.15 316.502 117.746 316.57 117.304 316.614C116.868 316.663 116.38 316.688 115.84 316.688V314.896ZM118.532 306.91C118.03 306.91 117.64 307.085 117.362 307.434C117.083 307.778 116.944 308.277 116.944 308.931C116.944 309.258 116.993 309.523 117.092 309.725C117.19 309.927 117.334 310.09 117.525 310.216C117.618 310.276 117.716 310.325 117.82 310.363C117.929 310.396 118.032 310.423 118.131 310.445C118.229 310.467 118.316 310.483 118.392 310.494C118.474 310.499 118.54 310.502 118.589 310.502H119.972V309.152C119.972 308.77 119.944 308.451 119.89 308.195C119.835 307.933 119.764 307.72 119.677 307.557C119.59 307.393 119.492 307.268 119.382 307.18C119.279 307.088 119.172 307.022 119.063 306.984C118.96 306.946 118.859 306.924 118.761 306.918C118.668 306.913 118.592 306.91 118.532 306.91ZM130.353 312.294H130.182C129.942 312.294 129.715 312.275 129.502 312.237C129.29 312.198 129.074 312.089 128.856 311.909C128.823 312.64 128.687 313.3 128.447 313.889C128.212 314.478 127.882 314.98 127.457 315.395C127.037 315.809 126.53 316.128 125.935 316.352C125.341 316.576 124.667 316.688 123.914 316.688H122.785V314.896H123.914C124.46 314.896 124.929 314.838 125.322 314.724C125.72 314.609 126.047 314.427 126.303 314.176C126.56 313.93 126.751 313.606 126.876 313.202C127.002 312.804 127.064 312.318 127.064 311.746V306.64H128.856V309.209C128.856 309.488 128.913 309.711 129.028 309.88C129.148 310.049 129.284 310.18 129.437 310.273C129.59 310.366 129.737 310.428 129.879 310.461C130.026 310.488 130.127 310.502 130.182 310.502H130.353V312.294ZM134.836 305.102C135.327 305.102 135.764 305.192 136.146 305.372C136.533 305.547 136.86 305.781 137.127 306.076C137.395 306.365 137.599 306.698 137.741 307.074C137.883 307.445 137.954 307.827 137.954 308.219C137.954 308.705 137.888 309.122 137.757 309.471C137.626 309.815 137.433 310.148 137.176 310.469C137.264 310.475 137.373 310.48 137.504 310.486C137.64 310.491 137.782 310.497 137.929 310.502C138.076 310.502 138.218 310.502 138.355 310.502C138.496 310.502 138.616 310.502 138.715 310.502H139.402V312.294H138.715C138.366 312.294 138.008 312.28 137.643 312.253C137.277 312.231 136.92 312.201 136.571 312.163C136.227 312.119 135.9 312.07 135.589 312.016C135.278 311.956 135.003 311.893 134.763 311.828C134.272 311.964 133.718 312.076 133.102 312.163C132.486 312.25 131.779 312.294 130.983 312.294H130.058V310.502H130.983C131.13 310.502 131.258 310.502 131.367 310.502C131.482 310.502 131.591 310.502 131.695 310.502C131.798 310.497 131.899 310.494 131.997 310.494C132.101 310.488 132.21 310.48 132.325 310.469C132.188 310.306 132.068 310.142 131.965 309.978C131.861 309.815 131.774 309.643 131.703 309.463C131.637 309.283 131.586 309.092 131.547 308.89C131.515 308.683 131.498 308.459 131.498 308.219C131.498 307.805 131.586 307.409 131.76 307.033C131.935 306.651 132.172 306.318 132.472 306.035C132.777 305.751 133.132 305.525 133.536 305.356C133.939 305.187 134.373 305.102 134.836 305.102ZM133.184 308.228V308.326C133.184 308.538 133.219 308.738 133.29 308.923C133.361 309.103 133.467 309.269 133.609 309.422C133.751 309.575 133.92 309.708 134.116 309.823C134.318 309.932 134.539 310.03 134.779 310.118C135.003 310.03 135.21 309.932 135.401 309.823C135.592 309.714 135.756 309.586 135.892 309.438C136.034 309.286 136.143 309.111 136.219 308.915C136.301 308.713 136.342 308.481 136.342 308.219C136.342 308.072 136.298 307.922 136.211 307.769C136.124 307.611 136.009 307.467 135.867 307.336C135.726 307.205 135.565 307.098 135.385 307.017C135.205 306.935 135.022 306.894 134.836 306.894C134.624 306.894 134.416 306.932 134.215 307.008C134.018 307.079 133.844 307.178 133.691 307.303C133.538 307.428 133.416 307.573 133.323 307.737C133.23 307.895 133.184 308.058 133.184 308.228ZM133.478 301.903L134.836 300.528L136.227 301.919L134.853 303.294L133.478 301.903ZM143.682 305.478C143.693 305.511 143.715 305.601 143.748 305.748C143.78 305.89 143.819 306.068 143.862 306.28C143.911 306.493 143.958 306.728 144.001 306.984C144.05 307.24 144.094 307.499 144.132 307.761C144.176 308.018 144.211 308.268 144.239 308.514C144.266 308.754 144.279 308.964 144.279 309.144C144.279 309.684 144.189 310.153 144.009 310.551C143.829 310.949 143.595 311.277 143.306 311.533C143.022 311.789 142.7 311.98 142.34 312.106C141.98 312.231 141.62 312.294 141.26 312.294H139.051V310.502H141.318C141.389 310.502 141.492 310.491 141.629 310.469C141.77 310.448 141.909 310.393 142.046 310.306C142.182 310.213 142.299 310.077 142.398 309.897C142.501 309.717 142.553 309.466 142.553 309.144C142.553 309.024 142.542 308.874 142.52 308.694C142.499 308.514 142.471 308.32 142.439 308.113C142.406 307.906 142.368 307.693 142.324 307.475C142.28 307.257 142.237 307.052 142.193 306.861C142.155 306.67 142.117 306.498 142.079 306.346C142.04 306.193 142.01 306.076 141.989 305.994L143.682 305.478ZM140.778 315.141L142.136 313.767L143.527 315.158L142.152 316.532L140.778 315.141ZM158.074 312.294H157.902C157.662 312.294 157.436 312.275 157.223 312.237C157.01 312.198 156.795 312.089 156.577 311.909C156.544 312.64 156.408 313.3 156.168 313.889C155.933 314.478 155.603 314.98 155.178 315.395C154.758 315.809 154.25 316.128 153.656 316.352C153.061 316.576 152.388 316.688 151.635 316.688H150.506V314.896H151.635C152.18 314.896 152.649 314.838 153.042 314.724C153.44 314.609 153.768 314.427 154.024 314.176C154.28 313.93 154.471 313.606 154.597 313.202C154.722 312.804 154.785 312.318 154.785 311.746V306.64H156.577V309.209C156.577 309.488 156.634 309.711 156.749 309.88C156.869 310.049 157.005 310.18 157.158 310.273C157.31 310.366 157.458 310.428 157.599 310.461C157.747 310.488 157.848 310.502 157.902 310.502H158.074V312.294ZM163.924 304.398L162.631 303.089L163.907 301.764L165.233 303.089L163.924 304.398ZM160.634 304.382L159.342 303.073L160.61 301.748L161.935 303.073L160.634 304.382ZM166.82 310.502V312.294H165.511C165.031 312.294 164.6 312.228 164.218 312.098C163.836 311.961 163.523 311.762 163.277 311.5C162.983 311.757 162.623 311.953 162.197 312.089C161.777 312.226 161.3 312.294 160.765 312.294H157.812V310.502H160.765C161.125 310.502 161.412 310.467 161.624 310.396C161.843 310.325 162.006 310.238 162.115 310.134C162.224 310.025 162.295 309.908 162.328 309.782C162.361 309.651 162.377 309.526 162.377 309.406V306.632H164.161V309.348C164.161 309.534 164.188 309.692 164.243 309.823C164.303 309.948 164.376 310.055 164.464 310.142C164.551 310.224 164.646 310.289 164.75 310.338C164.854 310.388 164.954 310.426 165.053 310.453C165.156 310.475 165.249 310.488 165.331 310.494C165.413 310.499 165.473 310.502 165.511 310.502H166.82ZM166.405 310.502H167.436C167.785 310.502 168.066 310.472 168.279 310.412C168.497 310.352 168.666 310.265 168.786 310.15C168.906 310.03 168.985 309.886 169.023 309.717C169.067 309.548 169.089 309.357 169.089 309.144V306.64H170.881V309.103C170.881 309.588 170.995 309.943 171.224 310.167C171.459 310.385 171.83 310.497 172.337 310.502C172.424 310.497 172.533 310.48 172.664 310.453C172.801 310.42 172.929 310.358 173.049 310.265C173.174 310.167 173.281 310.03 173.368 309.856C173.455 309.676 173.499 309.438 173.499 309.144V306.64H175.283V309.103C175.283 309.594 175.4 309.951 175.634 310.175C175.869 310.393 176.245 310.502 176.763 310.502C176.911 310.502 177.055 310.48 177.197 310.437C177.339 310.388 177.467 310.311 177.582 310.208C177.696 310.104 177.789 309.97 177.86 309.807C177.936 309.638 177.98 309.43 177.991 309.185V306.64H179.783V309.185C179.793 309.648 179.933 309.984 180.2 310.191C180.467 310.398 180.873 310.502 181.419 310.502H182.27V312.294H181.419C180.863 312.294 180.372 312.226 179.946 312.089C179.526 311.948 179.172 311.735 178.883 311.451C178.621 311.735 178.302 311.948 177.925 312.089C177.554 312.226 177.167 312.294 176.763 312.294C176.251 312.294 175.801 312.226 175.413 312.089C175.026 311.948 174.685 311.738 174.391 311.459C174.113 311.721 173.793 311.926 173.433 312.073C173.079 312.215 172.724 312.288 172.37 312.294H172.313C171.816 312.294 171.377 312.223 170.995 312.081C170.613 311.934 170.283 311.738 170.005 311.492C169.694 311.759 169.329 311.961 168.909 312.098C168.489 312.228 167.998 312.294 167.436 312.294H166.405V310.502ZM173.851 303.253L172.542 304.578L171.233 303.269L172.542 301.944L173.851 303.253ZM177.361 303.22L176.068 304.529L174.718 303.237L176.043 301.911L177.361 303.22ZM175.553 300.913L174.325 302.14L173.114 300.929L174.342 299.702L175.553 300.913ZM191.025 310.502V312.294H189.716C189.236 312.294 188.805 312.228 188.423 312.098C188.041 311.961 187.728 311.762 187.482 311.5C187.188 311.757 186.828 311.953 186.402 312.089C185.982 312.226 185.505 312.294 184.97 312.294H182.017V310.502H184.97C185.33 310.502 185.617 310.467 185.83 310.396C186.048 310.325 186.211 310.238 186.32 310.134C186.43 310.025 186.5 309.908 186.533 309.782C186.566 309.651 186.582 309.526 186.582 309.406V306.632H188.366V309.348C188.366 309.534 188.393 309.692 188.448 309.823C188.508 309.948 188.581 310.055 188.669 310.142C188.756 310.224 188.851 310.289 188.955 310.338C189.059 310.388 189.16 310.426 189.258 310.453C189.361 310.475 189.454 310.488 189.536 310.494C189.618 310.499 189.678 310.502 189.716 310.502H191.025ZM187.45 316.671L186.157 315.362L187.433 314.037L188.759 315.362L187.45 316.671ZM184.332 316.655L183.04 315.346L184.316 314.02L185.641 315.346L184.332 316.655ZM195.274 305.478C195.285 305.511 195.307 305.601 195.339 305.748C195.372 305.89 195.41 306.068 195.454 306.28C195.503 306.493 195.549 306.728 195.593 306.984C195.642 307.24 195.686 307.499 195.724 307.761C195.768 308.018 195.803 308.268 195.83 308.514C195.858 308.754 195.871 308.964 195.871 309.144C195.871 309.684 195.781 310.153 195.601 310.551C195.421 310.949 195.187 311.277 194.898 311.533C194.614 311.789 194.292 311.98 193.932 312.106C193.572 312.231 193.212 312.294 192.852 312.294H190.643V310.502H192.909C192.98 310.502 193.084 310.491 193.22 310.469C193.362 310.448 193.501 310.393 193.638 310.306C193.774 310.213 193.891 310.077 193.989 309.897C194.093 309.717 194.145 309.466 194.145 309.144C194.145 309.024 194.134 308.874 194.112 308.694C194.09 308.514 194.063 308.32 194.03 308.113C193.998 307.906 193.959 307.693 193.916 307.475C193.872 307.257 193.829 307.052 193.785 306.861C193.747 306.67 193.709 306.498 193.67 306.346C193.632 306.193 193.602 306.076 193.58 305.994L195.274 305.478ZM192.369 315.141L193.728 313.767L195.119 315.158L193.744 316.532L192.369 315.141ZM206.009 310.944C206.009 311.124 205.965 311.293 205.878 311.451C205.796 311.604 205.687 311.738 205.55 311.852C205.414 311.967 205.259 312.057 205.084 312.122C204.909 312.188 204.732 312.22 204.552 312.22C204.296 312.22 204.067 312.168 203.865 312.065C203.663 311.956 203.491 311.814 203.349 311.639C203.213 311.459 203.107 311.255 203.03 311.026C202.959 310.797 202.924 310.557 202.924 310.306C202.924 309.651 203.077 309.051 203.382 308.506C203.688 307.96 204.176 307.45 204.847 306.976L205.567 307.638C205.049 308.009 204.675 308.378 204.446 308.743C204.222 309.108 204.105 309.479 204.094 309.856C204.17 309.812 204.277 309.768 204.413 309.725C204.549 309.681 204.691 309.659 204.839 309.659C205.002 309.659 205.155 309.692 205.297 309.758C205.439 309.818 205.561 309.905 205.665 310.019C205.774 310.134 205.859 310.27 205.919 310.428C205.979 310.587 206.009 310.758 206.009 310.944ZM214.412 312.294H214.24C214 312.294 213.774 312.275 213.561 312.237C213.348 312.198 213.133 312.089 212.915 311.909C212.882 312.64 212.746 313.3 212.506 313.889C212.271 314.478 211.941 314.98 211.516 315.395C211.096 315.809 210.588 316.128 209.994 316.352C209.399 316.576 208.726 316.688 207.973 316.688H206.844V314.896H207.973C208.518 314.896 208.987 314.838 209.38 314.724C209.778 314.609 210.106 314.427 210.362 314.176C210.618 313.93 210.809 313.606 210.935 313.202C211.06 312.804 211.123 312.318 211.123 311.746V306.64H212.915V309.209C212.915 309.488 212.972 309.711 213.086 309.88C213.206 310.049 213.343 310.18 213.496 310.273C213.648 310.366 213.796 310.428 213.937 310.461C214.085 310.488 214.186 310.502 214.24 310.502H214.412V312.294ZM224.189 309.839C224.249 310.008 224.339 310.137 224.459 310.224C224.579 310.317 224.704 310.385 224.835 310.428C224.966 310.467 225.089 310.488 225.203 310.494C225.318 310.499 225.4 310.502 225.449 310.502H227.011V312.294H225.449C225.029 312.294 224.639 312.234 224.279 312.114C223.919 311.988 223.597 311.808 223.313 311.574V311.566C223.019 311.326 222.784 311.028 222.61 310.674C222.571 310.69 222.531 310.709 222.487 310.731C221.92 311.004 221.311 311.258 220.662 311.492C220.013 311.721 219.334 311.912 218.625 312.065C217.921 312.218 217.218 312.294 216.514 312.294H214.158V310.502H216.514C216.896 310.502 217.291 310.475 217.701 310.42C218.11 310.366 218.516 310.292 218.92 310.199C219.329 310.101 219.732 309.989 220.131 309.864C220.529 309.738 220.911 309.605 221.276 309.463C221.647 309.321 221.993 309.177 222.315 309.029C222.637 308.877 222.926 308.727 223.182 308.579L219.1 307.148C218.854 307.077 218.636 307.041 218.445 307.041C218.254 307.036 218.085 307.068 217.938 307.139C217.791 307.21 217.662 307.322 217.553 307.475C217.444 307.628 217.346 307.821 217.259 308.056L215.606 307.557C215.721 307.191 215.876 306.842 216.072 306.509C216.269 306.177 216.511 305.898 216.801 305.675C217.09 305.446 217.428 305.293 217.815 305.217C217.935 305.195 218.061 305.184 218.191 305.184C218.481 305.184 218.797 305.238 219.141 305.348C219.446 305.446 219.721 305.538 219.967 305.626C220.218 305.708 220.463 305.795 220.703 305.888C220.943 305.975 221.194 306.07 221.456 306.174C221.723 306.272 222.029 306.387 222.372 306.518C222.721 306.648 223.125 306.801 223.583 306.976C224.041 307.145 224.584 307.341 225.211 307.565L225.432 309.07C225.4 309.092 225.255 309.185 224.999 309.348C224.786 309.49 224.516 309.654 224.189 309.839ZM216.547 301.854L217.905 300.479L219.296 301.87L217.921 303.245L216.547 301.854ZM231.239 305.478C231.25 305.511 231.272 305.601 231.304 305.748C231.337 305.89 231.375 306.068 231.419 306.28C231.468 306.493 231.514 306.728 231.558 306.984C231.607 307.24 231.651 307.499 231.689 307.761C231.733 308.018 231.768 308.268 231.795 308.514C231.823 308.754 231.836 308.964 231.836 309.144C231.836 309.684 231.746 310.153 231.566 310.551C231.386 310.949 231.152 311.277 230.863 311.533C230.579 311.789 230.257 311.98 229.897 312.106C229.537 312.231 229.177 312.294 228.817 312.294H226.608V310.502H228.874C228.945 310.502 229.049 310.491 229.185 310.469C229.327 310.448 229.466 310.393 229.603 310.306C229.739 310.213 229.856 310.077 229.954 309.897C230.058 309.717 230.11 309.466 230.11 309.144C230.11 309.024 230.099 308.874 230.077 308.694C230.055 308.514 230.028 308.32 229.995 308.113C229.962 307.906 229.924 307.693 229.881 307.475C229.837 307.257 229.793 307.052 229.75 306.861C229.712 306.67 229.673 306.498 229.635 306.346C229.597 306.193 229.567 306.076 229.545 305.994L231.239 305.478ZM228.334 315.141L229.692 313.767L231.083 315.158L229.709 316.532L228.334 315.141ZM245.631 312.294H245.459C245.219 312.294 244.993 312.275 244.78 312.237C244.567 312.198 244.352 312.089 244.133 311.909C244.101 312.64 243.964 313.3 243.724 313.889C243.49 314.478 243.16 314.98 242.734 315.395C242.314 315.809 241.807 316.128 241.212 316.352C240.618 316.576 239.944 316.688 239.192 316.688H238.062V314.896H239.192C239.737 314.896 240.206 314.838 240.599 314.724C240.997 314.609 241.324 314.427 241.581 314.176C241.837 313.93 242.028 313.606 242.153 313.202C242.279 312.804 242.342 312.318 242.342 311.746V306.64H244.133V309.209C244.133 309.488 244.191 309.711 244.305 309.88C244.425 310.049 244.562 310.18 244.714 310.273C244.867 310.366 245.014 310.428 245.156 310.461C245.303 310.488 245.404 310.502 245.459 310.502H245.631V312.294ZM251.48 304.398L250.187 303.089L251.464 301.764L252.789 303.089L251.48 304.398ZM248.191 304.382L246.898 303.073L248.167 301.748L249.492 303.073L248.191 304.382ZM254.377 310.502V312.294H253.067C252.587 312.294 252.157 312.228 251.775 312.098C251.393 311.961 251.079 311.762 250.834 311.5C250.539 311.757 250.179 311.953 249.754 312.089C249.334 312.226 248.857 312.294 248.322 312.294H245.368V310.502H248.322C248.682 310.502 248.968 310.467 249.181 310.396C249.399 310.325 249.563 310.238 249.672 310.134C249.781 310.025 249.852 309.908 249.885 309.782C249.917 309.651 249.934 309.526 249.934 309.406V306.632H251.717V309.348C251.717 309.534 251.745 309.692 251.799 309.823C251.859 309.948 251.933 310.055 252.02 310.142C252.107 310.224 252.203 310.289 252.307 310.338C252.41 310.388 252.511 310.426 252.609 310.453C252.713 310.475 252.806 310.488 252.887 310.494C252.969 310.499 253.029 310.502 253.067 310.502H254.377ZM259.313 305.184C259.804 305.184 260.243 305.252 260.63 305.388C261.017 305.519 261.345 305.716 261.612 305.978C261.885 306.234 262.092 306.55 262.234 306.927C262.376 307.303 262.446 307.734 262.446 308.219C262.446 308.508 262.4 308.814 262.307 309.136C262.22 309.452 262.054 309.766 261.808 310.077C261.563 310.382 261.219 310.674 260.777 310.952C260.341 311.23 259.776 311.473 259.084 311.68H259.092C258.868 311.757 258.623 311.822 258.356 311.877C258.094 311.926 257.848 311.969 257.619 312.008C257.69 312.313 257.821 312.618 258.012 312.924C258.203 313.229 258.426 313.518 258.683 313.791C258.939 314.064 259.217 314.312 259.517 314.536C259.823 314.759 260.123 314.939 260.417 315.076C260.374 314.988 260.33 314.885 260.286 314.765C260.243 314.645 260.202 314.517 260.164 314.38C260.131 314.249 260.104 314.118 260.082 313.988C260.06 313.857 260.049 313.739 260.049 313.636C260.049 313.456 260.063 313.276 260.09 313.096C260.117 312.921 260.161 312.758 260.221 312.605C260.341 312.288 260.502 312.002 260.704 311.746C260.911 311.484 261.148 311.26 261.416 311.075C261.683 310.889 261.972 310.748 262.283 310.649C262.599 310.551 262.929 310.502 263.273 310.502H264.836V312.294H263.207C262.891 312.294 262.61 312.376 262.365 312.539C262.125 312.708 261.95 312.938 261.841 313.227C261.776 313.407 261.743 313.587 261.743 313.767C261.743 314.039 261.795 314.326 261.898 314.626C262.007 314.926 262.201 315.198 262.479 315.444L261.923 316.802C261.11 316.802 260.363 316.671 259.681 316.409C259.005 316.153 258.407 315.812 257.889 315.387C257.376 314.961 256.954 314.473 256.621 313.922C256.288 313.377 256.065 312.812 255.95 312.228C255.623 312.256 255.296 312.272 254.968 312.278C254.641 312.288 254.33 312.294 254.036 312.294V310.502C254.265 310.502 254.54 310.499 254.862 310.494C255.184 310.483 255.525 310.464 255.885 310.437C255.917 309.777 255.972 309.198 256.048 308.702C256.13 308.2 256.245 307.75 256.392 307.352C256.561 306.894 256.763 306.523 256.997 306.239C257.232 305.956 257.48 305.738 257.742 305.585C258.004 305.427 258.271 305.32 258.544 305.266C258.816 305.211 259.073 305.184 259.313 305.184ZM259.313 306.968C259.133 306.968 258.947 307 258.756 307.066C258.571 307.131 258.399 307.276 258.241 307.499C258.083 307.718 257.944 308.042 257.824 308.473C257.704 308.898 257.625 309.474 257.586 310.199C257.745 310.172 257.916 310.142 258.102 310.109C258.293 310.071 258.454 310.03 258.585 309.987C259.086 309.828 259.487 309.662 259.787 309.488C260.093 309.308 260.325 309.136 260.483 308.972C260.646 308.808 260.753 308.661 260.802 308.53C260.856 308.394 260.884 308.288 260.884 308.211C260.884 307.982 260.84 307.788 260.753 307.63C260.666 307.472 260.548 307.344 260.401 307.246C260.259 307.148 260.093 307.077 259.902 307.033C259.711 306.989 259.515 306.968 259.313 306.968ZM267.872 305.478C267.883 305.511 267.904 305.601 267.937 305.748C267.97 305.89 268.008 306.068 268.052 306.28C268.101 306.493 268.147 306.728 268.191 306.984C268.24 307.24 268.283 307.499 268.322 307.761C268.365 308.018 268.401 308.268 268.428 308.514C268.455 308.754 268.469 308.964 268.469 309.144C268.469 309.684 268.379 310.153 268.199 310.551C268.019 310.949 267.784 311.277 267.495 311.533C267.212 311.789 266.89 311.98 266.53 312.106C266.17 312.231 265.81 312.294 265.45 312.294H263.241V310.502H265.507C265.578 310.502 265.682 310.491 265.818 310.469C265.96 310.448 266.099 310.393 266.235 310.306C266.372 310.213 266.489 310.077 266.587 309.897C266.691 309.717 266.743 309.466 266.743 309.144C266.743 309.024 266.732 308.874 266.71 308.694C266.688 308.514 266.661 308.32 266.628 308.113C266.595 307.906 266.557 307.693 266.513 307.475C266.47 307.257 266.426 307.052 266.383 306.861C266.344 306.67 266.306 306.498 266.268 306.346C266.23 306.193 266.2 306.076 266.178 305.994L267.872 305.478ZM264.967 315.141L266.325 313.767L267.716 315.158L266.342 316.532L264.967 315.141Z" fill="white"/>
<defs>
<clipPath id="clip0_4189_31387">
<rect width="124.329" height="142.48" fill="white" transform="translate(118.335 51.0889)"/>
</clipPath>
</defs>
</svg>


    )
  }
}