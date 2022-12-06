import React, { Component } from "react";
import RVD from "./../../npm/react-virtual-dom/react-virtual-dom";
import getSvg from "../../utils/getSvg";
import Pricing from "./../../pricing";
import Home from "./../home/index";
import MyBurux from "./../my-burux/index";
import Buy from "./../buy/index";
import appContext from "../../app-context";
import Loading from "../../components/loading";
import layout from "../../layout";
import dateCalculator from "../../utils/date-calculator";
import Search from "./../../popups/search/search";
import Shipping from './../../popups/shipping/shipping';
import Cart from "./../../popups/cart/cart";
import Product from "./../../popups/product/product";
import CategoryView from "./../../popups/category-view/category-view";
import Joziate_Darkhasthaye_Garanti_Popup from "./../../components/garanti/joziate-darkhasthaye-garanti-popup/joziate_darkhasthaye_garanti_popup";
import OrdersHistory from "../../popups/orders-history/orders-history";
import Popup from "../../components/popup/popup";
import {Icon} from '@mdi/react';
import { mdiShieldCheck,mdiCellphoneMarker,mdiClipboardList,mdiExitToApp} from "@mdi/js";
import Bazargah from "../bazargah/bazargah";
import AIOService from './../../aio-service/index';
import kharidApis from "../../apis/kharid-apis";
import bazargahApis from './../../apis/bazargah-apis';
import walletApis from './../../apis/wallet-apis';
import gardooneApis from './../../apis/gardoone-apis';
import guarantiApis from './../../apis/guaranti-apis';
import dotsloading from './../../images/simple_loading.gif';
import SabteGarantiJadid from "../../components/garanti/sabte-garanti-jadid/sabte-garanti-jadid";
import SabteGarantiJadidBaJoziat from "../../components/garanti/sabte-garanti-jadid-ba-joziat/sabte-garanti-jadid-ba-joziat";
import PayameSabteGaranti from "../../components/garanti/payame-sabte-garanti/payame-sabte-garanti";
import Logo5 from './../../images/logo5.png';
import SignalR from '../../singalR/signalR';
import RSA from './../../npm/react-super-app/react-super-app';
import "./index.css";
export default class Main extends Component {
  constructor(props) {
    super(props);
    let wrl = window.location.href;
    let status = wrl.indexOf('status=');
    if(status !== -1){
      status = wrl.slice(status + 7,wrl.length)
      if(status === '2'){
        alert('خطا در پرداخت')
        //window.location.href = wrl.slice(0,wrl.indexOf('/?status')) 
        window.history.pushState(window.history.state, window.title, wrl.slice(0,wrl.indexOf('/?status')));
      }
      if(status === '3'){
        alert('پرداخت موفق')
        //window.location.href = wrl.slice(0,wrl.indexOf('/?status')) 
        window.history.pushState(window.history.state, window.title, wrl.slice(0,wrl.indexOf('/?status')));
      }
    
    }
    let signalR=new SignalR(()=>this.state);
    signalR.start();
    
    let images = localStorage.getItem('electricy-images');
    if(images === undefined || images === null){
      images = {};
      localStorage.setItem('electricy-images','{}')
    }
    else {
      images = JSON.parse(images);
    }
    this.dateCalculator = dateCalculator();
    let backOffice = {
      forsate_ersale_sefareshe_bazargah:60,
      forsate_akhze_sefareshe_bazargah:30
    }
    this.state = {
      bazargah:{
        setActivity:async (state)=>{
          let {bazargahApis,bazargah} = this.state;
          let res = await bazargahApis({type:'activity',parameter:state})
          this.setState({bazargah:{...bazargah,active:res}})
        },
        // active:this.props.userInfo.isBazargahActive,
        active:true,
        forsate_ersale_sefareshe_bazargah:backOffice.forsate_ersale_sefareshe_bazargah,
        forsate_akhze_sefareshe_bazargah:backOffice.forsate_akhze_sefareshe_bazargah
      },
      SetState: (obj) => this.setState(obj),
      showMessage:this.showMessage.bind(this),
      images,
      signalR,
      messages:[],
      campaigns:[],
      testedChance: true,
      userInfo:props.userInfo,
      updateUserInfo:props.updateUserInfo,
      allProducts:[],
      cart: {},//{variantId:{count,product,variant}}
      cartZIndex:0,
      shipping:false,//{cards:[<ProductCard/>,...],cartItems:[{count,variant,product}],total:number}
      shippingZIndex:0,
      searchZIndex:0,
      productZIndex:0,
      product:false,
      categoryZIndex:0,
      category:false,
      guaranteePopupZIndex:0,
      guaranteePopupSuccessZIndex:0,
      guaranteePopupSuccessText:'',
      guaranteePopupSuccessSubtext:'',
      guaranteePopupSubmitZIndex:0,
      joziate_darkhasthaye_garanti_popup_zIndex:0,
      ordersHistoryZIndex:0,
      order:false,
      guaranteeItems: [],
      totalGuaranteeItems:0,
      guaranteeExistItems: [],
      popup: {},
      peygiriyeSefaresheKharid_tab:undefined,
      buy_view:undefined,//temporary state
    };
    let {token} = this.props;
    let log = true;
    this.state.kharidApis = AIOService({token,getState:()=>this.state,apis:kharidApis,log});
    this.state.bazargahApis = AIOService({token,getState:()=>this.state,apis:bazargahApis,log});
    this.state.walletApis = AIOService({token,getState:()=>this.state,apis:walletApis,log});
    this.state.gardooneApis = AIOService({token,getState:()=>this.state,apis:gardooneApis,log});
    this.state.guarantiApis = AIOService({token,getState:()=>this.state,apis:guarantiApis,log});
  }
  changeCart(count,variantId){
    let {cart,product,kharidApis} = this.state;
    let newCart;
    if(typeof count === 'object'){
      newCart = {...count}
    }
    else{
      if(count === 0){
        let res = {};
        for(let prop in cart){
          if(prop.toString() !== variantId.toString()){res[prop] = cart[prop]}
        }
        newCart = res;
      }
      else{
        newCart = {...cart}
        if(newCart[variantId] === undefined){
          newCart[variantId] = {count,product,variant:product.variants.filter((o) => o.id === variantId)[0]}
        }
        else{newCart[variantId].count = count;}
      }
    }
    clearTimeout(this.cartTimeout);
    this.cartTimeout = setTimeout(async ()=>await kharidApis({type:'setCart',parameter:newCart,loading:false}),2000)
    this.setState({cart:newCart});
  }
  getCartCountByVariantId(variantId) {
    if(!variantId){return 0}
    let { cart } = this.state;
    let cartItem = cart[variantId];
    if(!cartItem){return 0}
    return cartItem.count || 0;
  }
  async getGuaranteeImages(items){
    if(!items.length){return}
    let {guarantiApis,images} = this.state;
    let itemCodes = [];
    for(let i = 0; i < items.length; i++){
      let {Details = []} = items[i];
      for(let j = 0; j < Details.length; j++){
        let {Code} = Details[j];
        if(images[Code]){continue}
        if(itemCodes.indexOf(Code) !== -1){continue}
        itemCodes.push(Code);
      }
    }
    let res = await guarantiApis({type:'getImages',parameter:itemCodes,loading:false});
    for(let i = 0; i < res.length; i++){
      images[res.ItemCode] = res.ImagesUrl;
    }
    this.setState({images})
  }
  async getGuaranteeItems(){
    let {guarantiApis} = this.state;
    let res = await guarantiApis({type:"items",loading:false});
    if(res === false){
      this.props.logout();
      return;
    }
    let {items,total} = res
    //this.getGuaranteeImages(items);
    let guaranteeExistItems = await guarantiApis({type:"kalahaye_mojood",loading:false});
    this.setState({
      guaranteeItems:items,
      totalGuaranteeItems:total,
      guaranteeExistItems
    });
  }
  async getCampaignsData() {
    let {kharidApis} = this.state;
    let campaigns = await kharidApis({type:"getCampaigns",loading:false});
    this.setState({ campaigns});
  }
  async getBazargahOrders(){
    let {bazargah,bazargahApis} = this.state;
    bazargah.wait_to_get = await bazargahApis({type:'orders',parameter:{type:'wait_to_get'},loading:false});
    bazargah.wait_to_send = await bazargahApis({type:'orders',parameter:{type:'wait_to_send'},loading:false});
    this.setState({bazargah})
  }
  showMessage(message){
    alert(message)
    //this.setState({message:this.state.messages.concat(message)});
  }
  async componentDidMount() {
    let {userInfo,bazargah,kharidApis} = this.state;
    this.getGuaranteeItems();
    this.getCampaignsData();
    if(bazargah.active){this.getBazargahOrders();}
    //let testedChance = await gardooneApis({type:"get_tested_chance"});
    let pricing = new Pricing('https://b1api.burux.com/api/BRXIntLayer/GetCalcData', userInfo.cardCode,12 * 60 * 60 * 1000)
    pricing.startservice().then((value) => { return value; });
    let getFactorDetails = (items,obj = {})=>{
      let {SettleType,PaymentTime,PayDueDate,DeliveryType} = obj;
      let {userInfo} = this.state;
      let config = {
        "CardCode": userInfo.cardCode,
        "CardGroupCode":userInfo.groupCode,
        "MarketingLines": items,
        "DeliverAddress": userInfo.address,
        "marketingdetails": {
          "SlpCode": userInfo.slpcode,
          SettleType,
          PaymentTime,
          PayDueDate,
          DeliveryType
        }
      }
      let res = pricing.autoCalcDoc(config)
      return res
    }
    let fixPrice = (items,campaign = {})=>{
      let {userInfo} = this.state;
      let data = {
        "CardGroupCode": userInfo.groupCode,
        "CardCode": userInfo.cardCode,
        "marketingdetails": {
          "PriceList": campaign.PriceListNum,
          "SlpCode": userInfo.slpcode,
          "Campaign":campaign.CampaigId
        },
        "MarketingLines": items
      }
      let list = items.map(({itemCode})=>itemCode);
        list = pricing.autoPriceList(list, data, null, null, null, null, null, "01");
        return list
    }
    let updateProductPrice = (list,campaignId)=>{
        if(list === false){return false}
      return list.map((o)=>{
        
          if(!o.defaultVariant){
            console.error(`updateProductPrice error`);
            console.error('object is',o);
          }
          let a = o.variants.map((res)=>{
            return {
              itemCode:res.code,itemQty:1
            }
          })
          let array = fixPrice(a,campaignId);
          let result;
          for(let i = 0; i < array.length; i++){
            let obj = array[i];
            if(!result){result = obj}
            else{
              if(obj.FinalPrice && obj.FinalPrice < result.FinalPrice ){
                result = obj;
              }
            }
          }
          let newObj = {...o,...result};
          return newObj
      })
    }
    let cart = await kharidApis({type:'getCart',loading:false});
    this.setState({
      cart,
      fixPrice,
      pricing,
      updateProductPrice,getFactorDetails
    });
  }
  addPopup(type){
    let {rsa_actions} = this.state;
    let {addPopup} = rsa_actions;
    if(type === 'peygiriye-sefareshe-kharid'){
      addPopup({content:()=><OrdersHistory/>,title:'پیگیری سفارش خرید'})
    }
    else if(type === 'darkhaste_garanti'){
      addPopup({ content:()=><SabteGarantiJadid/>,title:'درخواست گارانتی',type:'bottom'})
    }
  }
  render() {
    let context = {
      ...this.state,
      changeCart:this.changeCart.bind(this),
      getCartCountByVariantId:this.getCartCountByVariantId.bind(this),
      logout: this.props.logout,
      layout:(type,parameters)=>layout(type,()=>this.state,parameters)
    };
    let { 
      cartZIndex,shippingZIndex,searchZIndex,productZIndex,categoryZIndex,
      guaranteePopupSuccessZIndex,guaranteePopupSubmitZIndex,guaranteePopupZIndex,ordersHistoryZIndex,
      joziate_darkhasthaye_garanti_popup_zIndex,messages
    } = this.state;
    let {userInfo,logout} = this.props;
    return (
      <appContext.Provider value={context}>
        <RSA
          rtl={true}
          popupConfig={{closeType:'back button',type:'fullscreen'}}
          navs={[
            { text: "خانه", icon: (active)=>getSvg(19, { fill: active ? "#3b55a5" : "#605E5C" }), id: "khane",headerText:getSvg('mybrxlogo') },
            { text: "خرید", icon: (active)=>getSvg('buy', { fill: active ? "#3b55a5" : "#605E5C" }), id: "kharid" },
            { text: "بازارگاه", icon: (active)=>getSvg(20, { fill: active ? "#3b55a5" : "#605E5C" }), id: "bazargah" },
            { text:userInfo.cardName || 'پروفایل', icon: (active)=>getSvg(21, { fill: active ? "#3b55a5" : "#605E5C" }), id: "profile" },
          ]}
          sides={[
            { text: 'بازارگاه', icon: ()=> <Icon path={mdiCellphoneMarker} size={0.8}/>},
            { text: 'پیگیری سفارش خرید', icon: ()=> <Icon path={mdiClipboardList} size={0.8} />,onClick:()=>this.addPopup('peygiriye-sefareshe-kharid')},
            { text: 'درخواست گارانتی', icon: ()=> <Icon path={mdiShieldCheck} size={0.8} />,onClick:()=>this.addPopup('darkhaste_garanti')},
            { text: 'خروج از حساب کاربری', icon: ()=> <Icon path={mdiExitToApp} size={0.8} />,className:'colorA4262C',onClick:()=>logout() },
            // { text: 'تست درگاه', icon: 17,fill:'#A4262c',onClick:()=>{
            //     let {kharidApis} = this.context;
            //     let amount = window.prompt('مبلغ را وارد کنید');
            //     let url = window.prompt('آدرس بازگشت را وارد کنید');
            //     kharidApis({type:'dargah',parameter:{amount,url}})
            // }},
          ]}
          sideHeader={()=>getSvg('mybrxlogo')}
          navId='khane'
          body={({navId})=>{
            if (navId === "khane") {return <Home />;}
            if (navId === "kharid") {return <Buy/>;}
            if (navId === "bazargah") {return <Bazargah/>;}
            if (navId === "profile") {return <MyBurux />;}
          }}
          getActions={({setConfitm,addPopup,removePopup,setNavId})=>{
            this.setState({rsa_actions:{setConfitm,addPopup,removePopup,setNavId}})
          }}
          splash={()=><Splash/>}
          splashTime={7000}
        />
        <Loading/>
        {guaranteePopupSubmitZIndex !== 0 && <Popup><SabteGarantiJadidBaJoziat/></Popup>}
        {guaranteePopupSuccessZIndex !== 0 && <Popup style={{padding:24}}><PayameSabteGaranti/></Popup>}
        {searchZIndex !== 0 && <Search/>}
        {shippingZIndex !== 0 && <Shipping/>}
        {productZIndex !== 0 && <Product/>}
        {cartZIndex !== 0 && <Cart/>}
        {categoryZIndex !== 0 && <CategoryView/>}
        {joziate_darkhasthaye_garanti_popup_zIndex !== 0 && <Popup><Joziate_Darkhasthaye_Garanti_Popup/></Popup>}
      </appContext.Provider>
    );
  }
}
Main.defaultProps = {userInfo:{cardCode:'c50000'}}
class Message extends Component{
  constructor(props){
    super(props);
    this.iv = setInterval(()=>{
      let {messages,onChange} = this.props;
      if(!messages.length){clearInterval(this.iv); return}
      messages = messages.slice(1,messages.length);
      onChange(messages);
    },3000)
  }
  render(){
    let {messages} = this.props;
    return <div className='my-burux-message'>{messages[0]}</div>
  }
}
class Splash extends Component{
  render(){
    return (
      <RVD
        layout={{
          style:{background:'#3B55A5',position:'fixed',width:'100%',height:'100%',left:0,top:0},
          column:[
            {size:152},
            {html:<img src={Logo5} alt='' width={240} height={240}/>,align:'vh'},
            {flex:1},
            {
              align:'vh',html:<img src={dotsloading} height='40px' alt=''/>
            },
            {size:24},
            {html:'چند لحظه صبر کنید',className:'colorFFF size14',align:'vh'},
            {size:48}
          ]
        }}
      />
    )
  }
}