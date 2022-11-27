import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "../../utils/getSvg";
import Pricing from "./../../pricing";
import Home from "./../home/index";
import MyBurux from "./../my-burux/index";
import Buy from "./../buy/index";
import appContext from "../../app-context";
import SideMenu from "../../components/sidemenu";
import splashSrc from './../../images/logo444.png';
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
import OrderPopup from "../../popups/order-popup/order-popup";
import "./index.css";
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
import Register from "../../components/register/register";
import SignalR from '../../singalR/signalR';
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
    setTimeout(()=>{
      this.setState({splashScreen:false})
    },7000)
    let theme = localStorage.getItem('electricy-theme');
    if(theme === undefined || theme === null){
      theme = false;
      localStorage.setItem('electricy-theme','false')
    }
    else {
      theme = theme === 'false'?false:'theme-1'
    }
    let images = localStorage.getItem('electricy-images');
    if(images === undefined || images === null){
      images = {};
      localStorage.setItem('electricy-images','{}')
    }
    else {
      images = JSON.parse(images);
    }
    this.dateCalculator = dateCalculator();
    let userCardCode=this.props.userInfo.cardCode;
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
      profile:this.props.userInfo,
      SetState: (obj) => this.setState(obj),
      showMessage:this.showMessage.bind(this),
      userCardCode,
      images,
      signalR,
      messages:[],
      buruxlogod:this.getBuruxLogoD(),
      splashScreen:true,
      showRegister:false,
      theme,
      wallet:0,
      campaigns:[],
      testedChance: true,
      sidemenuOpen: false,
      userInfo:{},
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
      orderZIndex:0,
      order:false,
      bottomMenuItems: [
        { text: "خانه", icon: 19, id: "a" },
        { text: "خرید", icon: 'buy', id: "b" },
        { text: "بازارگاه", icon: 20, id: "c" },
        { text: ()=>{
          let {userInfo = {}} = this.state;
          let {cardName = 'پروفایل'} = userInfo;
          return cardName
        }, icon: 21, id: "d" },
      ],
      guaranteeItems: [],
      totalGuaranteeItems:0,
      guaranteeExistItems: [],
      activeBottomMenu: "a",
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
  getBuruxLogoD(){
    let a = 'M37.5266 10.6935C37.3382 10.1355 37.1425 9.50643 36.9377 8.95436C36.8208 8.64937 36.7316 8.40412 36.6164 8.07318C36.5178 7.76728 36.3922 7.47043 36.3207 7.17256H36.2145C36.116 7.538 33.4992 9.75168 33.4992 9.93384C33.4992 10.0998 33.7849 10.8345 33.857 11.052L34.6236 13.2635C34.8997 14.1719 35.1782 15.5421 34.0527 15.9274C33.8733 15.988 33.5788 16.0153 33.4187 16.0062C31.9889 15.902 29.8276 16.1803 29.0525 15.7529C28.6955 15.5512 28.4877 15.3337 28.2733 14.9933C28.0692 14.66 27.9435 14.3369 27.855 13.8923C27.7664 13.4638 27.6506 13.1407 27.6506 12.5814V2.52438H23.999V13.2804C23.999 13.8741 23.8627 14.4688 23.6111 14.801C22.9621 15.6821 21.2022 15.6821 20.5414 14.826C20.2899 14.5032 20.1298 13.9452 20.1298 13.394V2.52438H16.2631V12.4141C16.2631 13.4112 16.4232 13.647 16.1112 14.486C15.6648 15.6821 13.5927 15.7701 12.8611 14.826C12.6109 14.5032 12.4509 13.9452 12.4509 13.394V2.52438H8.5314V18.3654C8.5314 21.3189 5.78647 20.8195 5.14399 20.1127C4.87676 19.8146 4.66469 19.2293 4.66469 18.6896V2.52438H0.851059V18.8545C0.851059 19.597 1.09055 20.4884 1.31444 21.0464C1.58167 21.7028 1.9408 22.2185 2.41183 22.6723C4.94093 25.1458 12.1188 24.8389 12.1188 18.6369C13.6121 18.976 15.111 19.0653 16.5929 18.5749C17.0305 18.4363 17.8613 18.0422 18.0852 17.7191C18.7111 18.1202 18.9196 18.4181 20.1597 18.724C21.5202 19.0598 22.9476 19.0104 24.2779 18.5704C25.1317 18.2897 25.0282 18.206 25.6585 17.876C25.9258 18.0504 26.1233 18.2518 26.4172 18.4262C28.0247 19.4125 30.5783 19.1777 32.6143 19.1777C34.8739 19.1777 37.7141 18.8201 38.3377 16.3466C38.9033 14.1456 38.2045 12.6861 37.5266 10.6935ZM47.4743 13.4204C47.4743 14.4503 46.6174 15.2891 45.5641 15.2891C44.5178 15.2891 43.6603 14.4503 43.6603 13.4204V6.70037C43.6603 5.67734 44.5178 4.83971 45.5641 4.83971C46.6174 4.83971 47.4743 5.67734 47.4743 6.70037V13.4204ZM48.447 2.12332C47.6179 1.7992 47.0289 1.77387 46.0378 1.66834C45.7786 1.64198 45.0453 1.73936 44.7687 1.77386C44.3488 1.81732 43.9463 1.92295 43.6075 2.03499C41.821 2.61149 40.7239 4.10671 40.3845 5.9053C40.302 6.32589 40.2409 6.71758 40.2409 7.17256V13.3425C40.2409 15.5 41.1782 17.6058 43.2494 18.4511C44.3762 18.9166 45.6797 18.9842 46.9301 18.8545C47.1889 18.8283 47.4118 18.7571 47.644 18.7412C47.644 22.4729 46.1968 21.9309 42.0631 21.9309V24.4205C46.3137 24.4205 50.7082 25.1286 51.3951 20.4093C51.6363 18.7412 51.5204 16.1458 51.5107 14.2579L51.5634 7.39158C51.5634';
    let b = '5.15479 50.6451 2.98588 48.447 2.12332ZM32.8552 9.73317C33.5096 9.10437 34.5709 7.82803 35.2311 7.18854C35.6599 6.7705 36.4466 5.82734 36.9103 5.3805L41.0285 0.969427C41.1692 0.820647 41.2057 0.750829 41.3566 0.594926C41.4922 0.463039 41.6256 0.393229 41.6776 0.200589H38.142C37.3463 0.191532 37.6783 0.269492 36.8572 1.05674C36.7042 1.19636 36.6781 1.24123 36.5539 1.39805C36.4376 1.53675 36.3207 1.62479 36.1951 1.75566L30.4266 8.00204C30.2836 8.16802 30.2569 8.22106 30.0882 8.37788C29.8991 8.56238 28.792 9.72534 28.748 9.88226H32.2849C32.6587 9.88226 32.6587 9.93385 32.8552 9.73317ZM62.3515 20.8643C62.0298 21.178 61.6821 21.7545 61.6821 22.3663C61.6821 23.9565 63.2722 25.2845 64.9595 24.4894C66.4256 23.7996 66.727 21.9743 65.5572 20.8379C64.6729 19.974 63.2354 19.9991 62.3515 20.8643ZM21.5476 25.0379C21.4428 25.0379 21.3519 25.0736 21.279 25.1458C21.2045 25.2192 21.1675 25.3063 21.1675 25.4083C21.1675 25.5111 21.2045 25.5995 21.279 25.6706C21.3519 25.7441 21.4428 25.7795 21.5476 25.7795C21.6505 25.7795 21.7397 25.7441 21.8142 25.6706C21.8888 25.5995 21.9275 25.5111 21.9275 25.4083C21.9275 25.3063 21.8888 25.2192 21.8142 25.1458C21.7397 25.0736 21.6505 25.0379 21.5476 25.0379ZM20.4807 25.0379C20.3748 25.0379 20.2839 25.0736 20.2124 25.1458C20.1373 25.2192 20.0992 25.3063 20.0992 25.4083C20.0992 25.5111 20.1373 25.5995 20.2124 25.6706C20.2839 25.7441 20.3748 25.7795 20.4807 25.7795C20.5826 25.7795 20.6731 25.7441 20.7463 25.6706C20.8204 25.5995 20.8585 25.5111 20.8585 25.4083C20.8585 25.3063 20.8204 25.2192 20.7463 25.1458C20.6731 25.0736 20.5826 25.0379 20.4807 25.0379ZM24.0747 23.04C24.0615 22.9633 24.0471 22.8863 24.0343 22.8084C24.0189 22.7317 24.004 22.6629 23.9906 22.6021C23.979 22.5382 23.9659 22.4856 23.9538 22.4407C23.9421 22.3982 23.9355 22.3709 23.9325 22.3595L23.3331 22.5369C23.3402 22.5609 23.3482 22.5976 23.3599 22.6424C23.372 22.6895 23.385 22.7408 23.398 22.796C23.4083 22.8509 23.4203 22.9103 23.4331 22.9724C23.4474 23.0354 23.4584 23.0962 23.4674 23.1556C23.4778 23.2163 23.4868 23.2725 23.4929 23.3241C23.4979 23.3767 23.5029 23.4203 23.5029 23.4592C23.5029 23.5463 23.4868 23.6164 23.4584 23.6678C23.4287 23.718 23.3959 23.7548 23.3579 23.7814C23.3191 23.8055 23.2807 23.82 23.2427 23.8272C23.2039 23.8327 23.1741 23.8363 23.1555 23.8363H22.5598H22.1821C22.1656 23.8363 22.1373 23.834 22.0932 23.8305C22.0507 23.8259 22.008 23.8132 21.9659 23.7915C21.9231 23.7711 21.8833 23.7401 21.8483 23.6989C21.8152 23.6541 21.7978 23.597 21.7978';
    let c = '23.5212V22.7295H21.1644V23.5384C21.1644 23.5716 21.1598 23.606 21.1504 23.6427C21.1414 23.6758 21.1197 23.7067 21.0893 23.7352C21.0566 23.7642 21.0105 23.7883 20.9493 23.8064C20.8868 23.8259 20.8044 23.8363 20.7015 23.8363H19.8166H18.8087C18.7256 23.8363 18.6507 23.8305 18.5849 23.8191C18.5177 23.8087 18.4523 23.7905 18.3928 23.7642C18.3317 23.7401 18.2729 23.7035 18.2164 23.6586C18.1582 23.6152 18.1009 23.559 18.037 23.4937C17.9736 23.4248 17.905 23.3446 17.8323 23.2507C17.7564 23.1556 17.6716 23.0458 17.5784 22.922L16.7947 21.8827L18.8044 20.9799L18.5445 20.4105L16.2668 21.459L16.1316 21.9961C16.1866 22.0626 16.2505 22.1429 16.3293 22.2381C16.3928 22.3183 16.473 22.4213 16.5715 22.5472C16.6674 22.671 16.7806 22.8211 16.9093 22.9951C16.9436 23.0412 16.9741 23.087 17.0021 23.1316C17.0291 23.1786 17.0576 23.2232 17.0767 23.2679C17.0989 23.3115 17.1171 23.354 17.1291 23.3939C17.1414 23.4342 17.1474 23.4696 17.1474 23.5018C17.1474 23.5212 17.1461 23.543 17.1414 23.5625C17.139 23.5852 17.1334 23.6038 17.125 23.6152V23.6138C17.1014 23.6518 17.0613 23.6863 17.0061 23.7148C16.9494 23.7434 16.8729 23.7674 16.7759 23.7883C16.6777 23.8077 16.5595 23.8237 16.4212 23.834C16.2825 23.8453 16.1209 23.8499 15.9351 23.8499L14.4218 23.8418C14.3898 23.8418 14.3557 23.8373 14.317 23.8281C14.2766 23.82 14.2411 23.8019 14.2067 23.7779C14.1746 23.7515 14.1456 23.7148 14.1232 23.6645C14.0995 23.6151 14.0891 23.5508 14.0891 23.4706C14.0891 23.4248 14.0928 23.3735 14.1031 23.3115C14.1138 23.2497 14.1278 23.1854 14.1412 23.1202C14.1592 23.0536 14.174 22.9905 14.1917 22.9275C14.2067 22.8659 14.2244 22.8106 14.2385 22.7661L13.9382 22.6745L13.6351 22.5804C13.6292';
    let d = '22.5944 13.6164 22.6343 13.5978 22.6963C13.58 22.7593 13.5593 22.835 13.54 22.922C13.5172 23.0091 13.4975 23.0994 13.4825 23.1968C13.4647 23.2955 13.4551 23.3849 13.4551 23.4696C13.4551 23.5635 13.4647 23.6528 13.4848 23.7297C13.5019 23.8064 13.5272 23.8775 13.554 23.9393C13.5847 23.999 13.6164 24.053 13.6545 24.0988C13.6886 24.1422 13.726 24.1822 13.7594 24.213C13.8449 24.2932 13.9455 24.354 14.0587 24.3965C14.1717 24.4365 14.2892 24.4583 14.4159 24.4583L15.9322 24.47C16.1232 24.47 16.3056 24.4663 16.4806 24.4605C16.6534 24.4537 16.8124 24.4332 16.9576 24.3975C17.1037 24.3634 17.2323 24.3082 17.3475 24.2326C17.4625 24.1572 17.5533 24.0516 17.6224 23.9153C17.6989 23.999 17.7735 24.0747 17.8529 24.141C17.9311 24.2075 18.0143 24.2637 18.1091 24.3105C18.2021 24.3575 18.305 24.3929 18.4189 24.4183C18.5334 24.4459 18.659 24.4583 18.8044 24.4583H18.805H18.8087H18.8103H18.8594H19.873H19.8747H20.7015C20.8668 24.4583 21.0141 24.4401 21.1458 24.4024C21.2767 24.3679 21.39 24.3095 21.4838 24.2302C21.5664 24.3049 21.6669 24.3621 21.7859 24.4001C21.9034 24.4387 22.0354 24.4583 22.1821 24.4583H22.4566H23.136C23.253 24.4583 23.3699 24.4387 23.4868 24.3975C23.6045 24.3589 23.7077 24.2969 23.8022 24.2157C23.8961 24.1341 23.9718 24.0321 24.0293 23.9039C24.0872 23.7788 24.1172 23.63 24.1172 23.4592C24.1172 23.4031 24.1119 23.34 24.1038 23.2679C24.0979 23.1922 24.0872 23.1166 24.0747 23.04ZM23.71 21.6307C23.7898 21.555 23.8266 21.4621 23.8266 21.3557C23.8266 21.2468 23.7898 21.1552 23.71 21.0783C23.6311 21.003 23.5397 20.9662 23.4294 20.9662C23.3191 20.9662 23.2232 21.003 23.1458 21.0783C23.067 21.1552 23.0289 21.2468 23.0289 21.3557C23.0289 21.4621 23.067 21.555 23.1458 21.6307C23.2232';
    let e = '21.7064 23.3191 21.7453 23.4294 21.7453C23.5397 21.7453 23.6311 21.7064 23.71 21.6307ZM26.187 23.8363H25.7948C25.7357 23.8363 25.6773 23.8295 25.6192 23.8132C25.5627 23.7983 25.5113 23.7755 25.4639 23.7425C25.4167 23.7103 25.3779 23.6678 25.3476 23.6152C25.3198 23.5635 25.3035 23.5018 25.3035 23.4284C25.3035 23.2426 25.3459 23.1052 25.4325 23.0169C25.5172 22.9275 25.6295 22.8853 25.7762 22.8853C25.7939 22.8853 25.8149 22.8863 25.8416 22.8909C25.869 22.8931 25.8991 22.9026 25.9265 22.9162C25.9585 22.9299 25.9883 22.9493 26.0204 22.9757C26.0508 23.0032 26.0791 23.039 26.1052 23.0834C26.1282 23.1292 26.15 23.1845 26.1626 23.253C26.179 23.3195 26.187 23.4007 26.187 23.4959V23.8363ZM26.5748 22.6148C26.493 22.505 26.3841 22.4177 26.2526 22.3559C26.1192 22.2929 25.9622 22.2621 25.7762 22.2621C25.6252 22.2621 25.4869 22.2885 25.3579 22.3433C25.2283 22.3973 25.1114 22.4739 25.0102 22.5736C24.9747 22.6116 24.9357 22.6573 24.8973 22.7077C24.8592 22.758 24.8227 22.8188 24.7907 22.8863C24.7596 22.9552 24.7342 23.0341 24.7131 23.1237C24.6931 23.2108 24.6834 23.3137 24.6834 23.4284C24.6834 23.5612 24.6991 23.6804 24.7319 23.7837C24.7599 23.8867 24.804 23.9759 24.8585 24.0516C24.9113 24.1283 24.9747 24.1903 25.0453 24.243C25.1197 24.2932 25.1962 24.3358 25.2791 24.3703C25.3599 24.4011 25.4465 24.4242 25.5337 24.4365C25.6221 24.4515 25.709 24.4583 25.7948 24.4583H26.187C26.1803 24.5843 26.1579 24.6853 26.1216 24.7609C26.0858 24.8353 26.0323 24.9005 25.9599 24.9568C25.9137 24.9958 25.861 25.0302 25.7972 25.0565C25.7357 25.085 25.6646 25.1058 25.5797 25.124C25.4979 25.14 25.404 25.1539 25.2961 25.1643C25.1919 25.1734 25.0689 25.178 24.9323 25.178V25.7999C25.1101 25.7999 25.2707 25.7921 25.4101 25.7782C25.55 25.7635 25.6773 25.7417';
    let f = '25.7919 25.7119C25.9071 25.6811 26.0093 25.6443 26.1002 25.6008C26.1931 25.5573 26.2756 25.5043 26.3561 25.4449C26.5114 25.3244 26.6283 25.1779 26.7052 25.0094C26.7823 24.8399 26.8204 24.6314 26.8204 24.3815V23.4959C26.8204 23.3195 26.8021 23.1556 26.7616 23.0046C26.7215 22.8545 26.6611 22.7236 26.5748 22.6148ZM32.5913 21.9181C32.6648 21.8451 32.6995 21.7567 32.6995 21.6548C32.6995 21.5541 32.6648 21.4645 32.5913 21.3947C32.5157 21.3203 32.4273 21.2845 32.3237 21.2845C32.2168 21.2845 32.1279 21.3203 32.0528 21.3947C31.9782 21.4645 31.9435 21.5541 31.9435 21.6548C31.9435 21.7567 31.9782 21.8451 32.0528 21.9181C32.1279 21.9906 32.2168 22.0282 32.3237 22.0282C32.4273 22.0282 32.5157 21.9906 32.5913 21.9181ZM31.5223 21.9181C31.5964 21.8451 31.6345 21.7567 31.6345 21.6548C31.6345 21.5541 31.5964 21.4645 31.5223 21.3947C31.4478 21.3203 31.3609 21.2845 31.2567 21.2845C31.1502 21.2845 31.06 21.3203 30.9865 21.3947C30.9116 21.4645 30.8749 21.5541 30.8749 21.6548C30.8749 21.7567 30.9116 21.8451 30.9865 21.9181C31.06 21.9906 31.1502 22.0282 31.2567 22.0282C31.3609 22.0282 31.4478 21.9906 31.5223 21.9181ZM36.9317 23.4111C36.9317 23.495 36.926 23.5612 36.9133 23.6106C36.9013 23.6586 36.8795 23.6963 36.8539 23.7194C36.8144 23.7561 36.7466 23.7859 36.651 23.8055C36.5582 23.8259 36.4295 23.835 36.2679 23.835C36.1631 23.835 36.0678 23.8169 35.9813 23.7847C35.8958 23.7502 35.8116 23.7012 35.7321 23.6368C35.6539 23.5703 35.5765 23.4926 35.4952 23.3975C35.4195 23.3047 35.3323 23.1946 35.2407 23.0744C35.0794 22.8646 34.9193 22.6551 34.76 22.4475C34.6023 22.2413 34.4407 22.0318 34.2812 21.8233L36.2188 20.9445L35.9602 20.3761L33.7424 21.4277L33.6352 21.9353C33.7625 22.089 33.8898 22.2427 34.0163 22.3927C34.1416 22.545 34.2515';
    let g = '22.6869 34.3521 22.8223C34.4526 22.9552 34.5321 23.0802 34.5933 23.1877C34.6558 23.2988 34.6872 23.3895 34.6872 23.4628C34.6832 23.5304 34.6594 23.5898 34.617 23.6381C34.577 23.6872 34.5218 23.7262 34.4526 23.7548C34.3825 23.7847 34.3 23.8041 34.2055 23.8169C34.1102 23.8295 34.0067 23.8363 33.8934 23.8363H33.0599H32.7867C32.7689 23.8363 32.74 23.8341 32.6975 23.8295C32.6551 23.8259 32.6127 23.8132 32.5703 23.7927C32.5264 23.772 32.4874 23.7401 32.4526 23.6976C32.4192 23.655 32.4022 23.5956 32.4022 23.5212V22.7282H31.7685V23.5394C31.7685 23.5716 31.7628 23.607 31.7558 23.6414C31.7447 23.6746 31.7254 23.708 31.6933 23.7366C31.6613 23.7652 31.6155 23.7892 31.554 23.8077C31.4915 23.8272 31.4084 23.8363 31.3042 23.8363H30.478H29.4649H29.4094H29.369C29.3525 23.8363 29.3258 23.8327 29.2835 23.8227C29.2447 23.8145 29.2022 23.7983 29.1568 23.772C29.1137 23.748 29.0757 23.7103 29.0446 23.6632C29.0102 23.6164 28.9925 23.5544 28.9925 23.4787V22.7318H28.358V24.2533C28.358 24.4205 28.3394 24.5638 28.3016 24.6817C28.2638 24.7986 28.2071 24.8951 28.1295 24.9681C28.0538 25.0406 27.9556';
    let h = '25.0942 27.8356 25.1276C27.7181 25.1608 27.5768 25.178 27.4114 25.178H27.0934V25.7999H27.4114C27.6428 25.7999 27.8527 25.7645 28.0374 25.6979C28.2234 25.6281 28.3841 25.5329 28.5175 25.4083C28.6507 25.2832 28.758 25.1344 28.8385 24.9591C28.9173 24.786 28.9678 24.5901 28.9902 24.3757C29.0489 24.4147 29.1083 24.4378 29.1702 24.4446C29.2327 24.4537 29.2995 24.4595 29.369 24.4595H29.4094H29.4649H30.4205H31.3042C31.4708 24.4595 31.6188 24.4387 31.7501 24.4046C31.8794 24.3667 31.9933 24.3082 32.0878 24.2293C32.1691 24.3059 32.2709 24.3634 32.3901 24.4011C32.5078 24.4387 32.6394 24.4595 32.7867 24.4595H33.1628H33.9114C34.0224 24.4595 34.134 24.4491 34.2472 24.4332C34.3765 24.4147 34.5004 24.3829 34.6146 24.3368C34.7299 24.2932 34.8315 24.2338 34.92 24.1617C35.0096 24.086 35.077 23.9977 35.1174 23.8935C35.1933 23.9782 35.2674 24.0552 35.3419 24.126C35.4171 24.1926 35.4963 24.252 35.5867 24.3013C35.6739 24.3507 35.7745 24.3885 35.8855 24.4161C35.9887 24.4436 36.1126 24.4559 36.2509 24.4573V24.4595C36.2569 24.4595 36.2612 24.4573 36.2672 24.4573C36.271 24.4573 36.273 24.4595 36.2769 24.4595H36.3521V24.4559C36.4426 24.4537 36.5275 24.4491 36.605 24.4414C36.7115 24.4273 36.8054 24.4125 36.8903 24.3885C36.9742 24.3657 37.051 24.3345 37.1158 24.3004C37.1826 24.2637 37.2431 24.2225 37.2958 24.1744C37.3546 24.1182 37.4024 24.0574 37.4371 23.9922C37.4736 23.9279 37.5013 23.8626 37.5199 23.7973C37.5383 23.7297 37.5504 23.6632 37.5563 23.5992C37.5624 23.5339 37.5644 23.4696 37.5644 23.4111V20.8552H36.9317V23.4111ZM38.419 24.4583H39.0553V20.8539H38.419V24.4583ZM67.1489 2.64232V13.3918C67.1489 14.9887 66.5426 16.5574 65.7269 17.356C64.3505 18.6909 63.1376 18.9107 61.1837 18.9107C60.4942 18.9107 60.2122'
    let i = '18.7869 59.7469 18.7457C59.7469 22.0078 58.7788 23.7983 55.7813 24.2659C54.874 24.4229 53.7993 24.4755 52.714 24.4722C52.6291 24.4722 52.5606 24.4033 52.5606 24.3209L52.5593 21.9263C54.0502 21.9263 55.5267 22.0078 55.809 20.0806C56.0078 18.8006 55.8231 13.4054 55.8231 11.6581V2.64232H59.6918V13.3379C59.6918 14.039 59.7916 14.369 60.0736 14.8101C60.5509 15.6074 62.0545 15.6074 62.7444 15.1813C63.4215 14.7689 63.5608 13.8601 63.5608 13.0192V2.64232H67.1489Z'
    return `${a} ${b} ${c} ${d} ${e} ${f} ${g} ${h} ${i}`
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
  async getB1Info(cardCode) {
    const data = await fetch(`https://b1api.burux.com/api/BRXIntLayer/GetCalcData/${cardCode}`, {
        mode: 'cors',headers: {'Access-Control-Allow-Origin': '*'}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        return data;
    }).catch(function (error) {
        console.log(error);
        return null;
    });
    let {userInfo} = this.props;
    return {...data,storeName:userInfo.storeName,slpphone:'09123534314'};
  }
  showMessage(message){
    alert(message)
    //this.setState({message:this.state.messages.concat(message)});
  }
  async componentDidMount() {
    let {userCardCode,bazargah,kharidApis} = this.state;
    let b1Info = await this.getB1Info(userCardCode);
    this.getGuaranteeItems();
    this.getCampaignsData();
    if(bazargah.active){this.getBazargahOrders();}
    //let testedChance = await gardooneApis({type:"get_tested_chance"});
    let pricing = new Pricing('https://b1api.burux.com/api/BRXIntLayer/GetCalcData', userCardCode,12 * 60 * 60 * 1000)
    let istarted = pricing.startservice().then((value) => { return value; });
    let getFactorDetails = (items,obj = {})=>{
      let {SettleType,PaymentTime,PayDueDate,DeliveryType} = obj;
      let {userInfo,b1Info} = this.state;
      let config = {
        "CardCode": userInfo.cardCode,
        "CardGroupCode":b1Info.customer.groupCode,
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
      let data = {
        "CardGroupCode": b1Info.customer.groupCode,
        "CardCode": this.state.userCardCode,
        "marketingdetails": {
          "PriceList": campaign.PriceListNum,
          "SlpCode": b1Info.customer.slpcode,
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
      userInfo:{...b1Info.customer,storeName:b1Info.storeName},
      b1Info,cart,
      fixPrice,
      pricing,
      updateProductPrice,getFactorDetails,
      wallet:-b1Info.customer.ballance
      //testedChance
    });
  }
  getBottomMenu() {
    let { activeBottomMenu, bottomMenuItems } = this.state;
    return {
      size: 60,
      className: "bottom-menu",
      row: bottomMenuItems.filter(({show = ()=>true})=>show()).map(({ text, icon, id }) => {
        let active = id === activeBottomMenu;
        if(typeof text === 'function'){text = text()}
        return {
          flex: 1,
          attrs: { onClick: () => this.setState({ activeBottomMenu: id }) },
          column: [
            { size: 12 },
            {html: getSvg(icon, { fill: active ? "#3b55a5" : "#605E5C" }),align: "vh"},
            {html: text,align: "vh",style: { fontSize: 12, color: active ? "#3b55a5" : "#6E6E6E" }}
          ],
        };
      }),
    };
  }
  getContent() {
    let { activeBottomMenu,buy_view } = this.state;
    if (activeBottomMenu === "a") {return <Home />;}
    if (activeBottomMenu === "b") {return <Buy view={buy_view}/>;}
    if (activeBottomMenu === "c") {return <Bazargah/>;}
    if (activeBottomMenu === "d") {return <MyBurux />;}
  }
  changeTheme(){
    let {theme} = this.state;
    let newTheme = theme === false?'theme-1':false;
    localStorage.setItem('electricy-theme',newTheme === 'theme-1'?'theme-1':'false');
    this.setState({theme:newTheme})
  }
  render() {
    let context = {
      ...this.state,
      changeCart:this.changeCart.bind(this),
      getCartCountByVariantId:this.getCartCountByVariantId.bind(this),
      changeTheme:this.changeTheme.bind(this),
      logout: this.props.logout,
      layout:(type,parameters)=>layout(type,()=>this.state,parameters)
    };
    let { 
      sidemenuOpen, theme,orderZIndex,buruxlogod,splashScreen,showRegister,
      cartZIndex,shippingZIndex,searchZIndex,productZIndex,categoryZIndex,
      guaranteePopupSuccessZIndex,guaranteePopupSubmitZIndex,guaranteePopupZIndex,ordersHistoryZIndex,
      joziate_darkhasthaye_garanti_popup_zIndex,messages
    } = this.state;
    return (
      <appContext.Provider value={context}>
        <RVD
          layout={{
            className: "main-page" + (theme ? " " + theme : ""),
            column: [
              { flex: 1, html: this.getContent() },
              this.getBottomMenu(),
            ],
          }}
        />
        {ordersHistoryZIndex !== 0 && <OrdersHistory/>}
        {orderZIndex !== 0 && <OrderPopup/>}
        {guaranteePopupZIndex !== 0 && <Popup style={{alignItems:'flex-end'}}><SabteGarantiJadid/></Popup>}
        {guaranteePopupSubmitZIndex !== 0 && <Popup><SabteGarantiJadidBaJoziat/></Popup>}
        {guaranteePopupSuccessZIndex !== 0 && <Popup style={{padding:24}}><PayameSabteGaranti/></Popup>}
        {searchZIndex !== 0 && <Search/>}
        {shippingZIndex !== 0 && <Shipping/>}
        {productZIndex !== 0 && <Product/>}
        {cartZIndex !== 0 && <Cart/>}
        {categoryZIndex !== 0 && <CategoryView/>}
        {joziate_darkhasthaye_garanti_popup_zIndex !== 0 && <Popup><Joziate_Darkhasthaye_Garanti_Popup/></Popup>}
        <SideMenu
          onClose={() => this.setState({ sidemenuOpen: false })}
          open={sidemenuOpen}
        />
        {!splashScreen && showRegister && <Popup><Register onClose={()=>this.setState({showRegister:false})}/></Popup>}
        <Loading />
        {splashScreen && <Splash d={buruxlogod}/>}
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
            {html:<Logo/>,align:'vh'},
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


class Logo extends Component{
  render(){
    return (
      <svg width="240" height="240" viewBox="0 0 361 361" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="361" height="361" rx="24"/>
<g clipPath="url(#clip0_4189_31387)">
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
<path fillRule="evenodd" clipRule="evenodd" d="M137.46 77.2114H223.852C225.049 77.2114 226.019 76.2477 226.019 75.0585V61.8008C226.019 55.8934 221.181 51.0889 215.239 51.0889H146.07C140.128 51.0889 135.293 55.8934 135.293 61.8008V75.0585C135.293 76.2477 136.263 77.2114 137.46 77.2114ZM163.545 65.0402H197.069C198.265 65.0402 199.235 64.0766 199.235 62.8873C199.235 61.698 198.265 60.7343 197.069 60.7343H163.545C162.348 60.7343 161.379 61.698 161.379 62.8873C161.379 64.0766 162.348 65.0402 163.545 65.0402Z" fill="white"/>
<path fillRule="evenodd" clipRule="evenodd" d="M143.957 193.135H217.355C222.134 193.135 226.019 189.272 226.019 184.526V166.118C226.019 164.929 225.049 163.965 223.852 163.965H137.46C136.263 163.965 135.293 164.929 135.293 166.118V184.526C135.293 189.274 139.178 193.135 143.957 193.135ZM185.647 178.317C185.647 181.248 183.256 183.623 180.307 183.623C177.358 183.623 174.967 181.248 174.967 178.317C174.967 175.387 177.358 173.012 180.307 173.012C183.256 173.012 185.647 175.387 185.647 178.317Z" fill="white"/>
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
<path d="M254.855 230.518V269.683H257.194C259.137 269.705 261.048 269.187 262.714 268.187C264.348 267.212 265.712 265.844 266.682 264.207C267.672 262.539 268.185 260.63 268.164 258.689V230.518H254.855Z" fill="#FBAD45"/>
<path d="M221.008 230.518V269.683H223.279C225.168 269.706 227.026 269.188 228.647 268.187C230.232 267.212 231.556 265.843 232.499 264.207C233.46 262.539 233.958 260.63 233.938 258.689V230.518H221.008Z" fill="#FBAD45"/>
<path d="M248.705 221.773C246.771 221.751 244.867 222.257 243.198 223.237C241.559 224.205 240.191 225.573 239.224 227.215C238.229 228.886 237.716 230.8 237.742 232.745V260.938H251.052V221.773H248.705Z" fill="#FBAD45"/>
<path d="M282.932 221.773C280.998 221.751 279.094 222.257 277.424 223.237C275.785 224.205 274.418 225.573 273.45 227.215C272.456 228.886 271.943 230.8 271.969 232.745V260.938H285.278V221.773H282.932Z" fill="#FBAD45"/>
<path d="M266.614 216.829H256.798C256.789 216.828 256.779 216.831 256.771 216.837C256.763 216.843 256.758 216.852 256.756 216.862V226.673C256.757 226.684 256.762 226.694 256.769 226.702C256.777 226.71 256.787 226.715 256.798 226.715H266.614C266.635 226.715 266.644 226.694 266.644 226.673V216.862C266.632 216.829 266.614 216.829 266.614 216.829Z" fill="#FBAD45"/>
<path d="M304.293 246.679V234.865H291.422V245.914C291.422 246.54 290.795 247.026 290.03 247.026H284.116C283.838 247.026 283.42 247.235 283.42 253.975C283.42 260.508 283.838 260.925 284.116 260.925H290.03C298.727 260.925 304.293 255.365 304.293 246.679ZM296.292 275.171V265.095H283.073V275.171H296.292Z" fill="#FBAD45"/>
<defs>
</defs>
</svg>


    )
  }
}