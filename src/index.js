import React, { Component } from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import Main from './pages/main';
import Register from './components/register/register';
import reportWebVitals from './reportWebVitals';
import './index.css';
import RVD from './interfaces/react-virtual-dom/react-virtual-dom';
import Loading from './components/loading/index';
import {Icon} from '@mdi/react';
import { mdiAlert } from '@mdi/js';
import logo from './images/logo5.png';
import {OTPLogin} from './npm/aio-login/aio-login';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.apiBaseUrl = "https://retailerapp.bbeta.ir/api/v1";
    this.state = { isAutenticated: false, registered: false,pageError:false,userInfo:{}}
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////// Fill By Backend Developer ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async onInterNumber(number) {
    let sendSmsResult;
    try{
      sendSmsResult = await Axios.get(`${this.apiBaseUrl}/Users/FirstStep?phoneNumber=${number}`);
    }
    catch{
      this.setState({pageError:{text:'سرویس دهنده در دسترس نمی باشد',subtext:'Users/FirstStep'}});
      return;
    }
    if (sendSmsResult.data.isSuccess) {
      let data = sendSmsResult.data.data;
      this.userId = data.id;
      this.setState({ registered: data.alreadyRegistered })
      return true
    }
    else {
      return sendSmsResult.data.message
    }

  }
  async onInterCode(code) {
    if (this.userId !== undefined) {
      const smsValidationResult = await Axios.get(`${this.apiBaseUrl}/Users/SecondStep?userId=${this.userId}&code=${code}`);
      if (smsValidationResult.data.isSuccess){
        let res = smsValidationResult.data.data;
        let token = res.accessToken.access_token;
        let userInfo = await this.getUserInfo(res)
        this.setState({ isAutenticated: true, userInfo, token });
      }
      else {return smsValidationResult.data.message;}
    }
  }
  async onInterPassword(number,password){
    //if error return error message
    const loginResult = await Axios.get(`${this.apiBaseUrl}/Users/Login?phoneNumber=${number}&password=${password}`);
    if (loginResult.data.isSuccess){
      const res = loginResult.data.data;
      let userInfo = await this.getUserInfo(res);
      const token = userInfo.accessToken.access_token;
      this.setState({ isAutenticated: true, userInfo, token,registered:res.alreadyRegistered });
    }
    else
      return loginResult.data.message;
  }
  async updatePassword(password){
    //در صورت موفقیت ریترن ترو
    //در صورت خطا ریترن متن خطا
    const setPasswordResult = await Axios.get(`${this.apiBaseUrl}/Users/SetPassword?password=${password}`);
    if (setPasswordResult.data.isSuccess)
      return true;
    else
      return setPasswordResult.data.message;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  logout() {
    localStorage.clear('brxelctoken');
    this.state.recodeIn = false;
    this.setState({ isAutenticated: false })
  }
  async interByStorage() {
    let storage = localStorage.getItem('brxelctoken');
    if (!storage || storage === null) { this.setState({}); return; }
    storage = JSON.parse(storage);
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + storage.token;
    let res;
    $('.loading').css({display:'flex'});
    try{
      res = await Axios.post(`${this.apiBaseUrl}/BOne/GetCustomer`, { "DocCode": storage.userInfo.cardCode });
      //$('.loading').css({display:'none'});
    }
    catch{
      this.setState({pageError:{text:'سرویس دهنده در دسترس نیست',subtext:'BOne/GetCustomer'}})
    }
    if (res.status === 401) {
      this.setState({});
      return;
    }
    this.setState({ isAutenticated: true, userInfo: storage.userInfo, token: storage.token, registered: true })
  }
  async componentDidMount() {
    this.mounted = true;
    this.interByStorage();
    
  }
  updateUserInfo(obj){
    let {token,userInfo} = this.state;
    let newUserInfo = {...userInfo,...obj};
    this.setState({userInfo:newUserInfo});
    localStorage.setItem('brxelctoken', JSON.stringify({ token, userInfo:newUserInfo }));
  }
  async getUserInfo(userInfo){
    const b1Info = await fetch(`https://b1api.burux.com/api/BRXIntLayer/GetCalcData/${userInfo.cardCode}`, {
        mode: 'cors',headers: {'Access-Control-Allow-Origin': '*'}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        return data;
    }).catch(function (error) {
        console.log(error);
        return null;
    });
    let {customer = {}} = b1Info;
    let ballance = customer.ballance;
    if(isNaN(ballance)){
      console.error(`b1Info.customer.ballance is ${ballance} but we set it on 0`)
      ballance = 0;
    }
    return {
      ...userInfo,
      cardCode:userInfo.cardCode,
      groupName:customer.groupName,
      cardName:customer.cardName,
      itemPrices:b1Info.itemPrices,
      slpphone:b1Info.slpphone,
      slpcode:customer.slpcode,
      slpname:customer.slpname,
      groupCode:customer.groupCode,
      ballance:-ballance,
      slpphone:'09123534314'
    }
  }
  header_layout(){
    return {
      html:<img src={logo} width={160} height={160} alt=''/>,align:'vh'
    }
  }
  render() {
    if (!this.mounted) { return <Loading/> }
    let { isAutenticated, userInfo, token, registered ,pageError,loading} = this.state;
    if (isAutenticated) {
      if (!registered) {
        return (
          <Register
            baseUrl={this.apiBaseUrl}
            mode='register'
            model={{PhoneNumber:userInfo.phoneNumber}}
            onClose={()=>this.setState({ isAutenticated: false })}
            onSubmit={(userInfo)=>this.setState({ userInfo, registered: true })}
          />
        )
      }
      localStorage.setItem('brxelctoken', JSON.stringify({ token, userInfo }));
      return (
        <>
        <Main 
          logout={() => this.logout()} 
          token={token} 
          userInfo={userInfo} 
          updateUserInfo={this.updateUserInfo.bind(this)} 
          updatePassword={this.updatePassword.bind(this)} 
          baseUrl={this.apiBaseUrl}
        />
      </>
        
      )
    }
    if(pageError){
      return (
        <>
        <RVD
          layout={{
            className:'page-error',style:{overflow:'visible'},
            row:[
              {flex:1},
              {
                className:'page-error-image',
                column:[
                  {flex:3},
                  {html:<Icon path={mdiAlert} size={4}/>,align:'h'},
                  {html:pageError.text,align:'h'},
                  {html:pageError.subtext,align:'h'},
                  {size:36},
                  {html:'بارگزاری مجدد',className:'bm-reload',attrs:{onClick:()=>window.location.reload()}},
                  {flex:2}
                ]
              },
              {flex:1}

            ]
          }}
        />
      </>
        
      )
    }
    return (
      <RVD
        layout={{
          style:{position:'fixed',left:0,top:0,width:'100%',height:'100%',overflowY:'auto'},
          className:'bg3B55A5',
          column:[
            {size:48},
            this.header_layout(),
            {size:24},
            {
              html:(
                <OTPLogin
                  time={30}
                  header={<img src={logo} width={160} height={160}/>}
                  onInterNumber={(number)=>this.onInterNumber(number)}
                  onInterCode={(code)=>this.onInterCode(code)}
                  onInterPassword={(number,password)=>this.onInterPassword(number,password)}
                />
              )
            },
            {flex:1,style:{minHeight:240}}
          ]
        }}
      />
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();


