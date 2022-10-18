import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "../../utils/getSvg";
import Pricing from "./../../pricing";
import Home from "./../home/index";
import MyBurux from "./../my-burux/index";
import Buy from "./../buy/index";
import appContext from "../../app-context";
import SideMenu from "../../components/sidemenu";
import bulbSrc from './../../images/10w-bulb.png';
import splashSrc from './../../images/logo444.png';
import Loading from "../../components/loading";
import Services from "./../../services";
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
import SabteGarantiJadid from "../../components/garanti/sabte-garanti-jadid/sabte-garanti-jadid";
import SabteGarantiJadidBaJoziat from "../../components/garanti/sabte-garanti-jadid-ba-joziat/sabte-garanti-jadid-ba-joziat";
import PayameSabteGaranti from "../../components/garanti/payame-sabte-garanti/payame-sabte-garanti";
import Register from "../../components/register/register";
import SignalR from '../../singalR/signalR';
import logo2 from './../../images/logo2.png';
export default class Main extends Component {
  constructor(props) {
    super(props);
    
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
      services:Services(()=>this.state,this.props.token,userCardCode),
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
        { text: "بازارگاه", icon: 20, id: "c",show:()=>this.state.bazargah.active },
        { text: "بروکس من", icon: 21, id: "d" },
      ],
      guaranteeItems: [],
      totalGuaranteeItems:0,
      guaranteeExistItems: [],
      activeBottomMenu: "a",
      popup: {},
      peygiriyeSefaresheKharid_tab:undefined,
      buy_view:undefined,//temporary state
    };
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
    let {cart,product} = this.state;
    let newCart;
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
    let {services,images} = this.state;
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
    let res = await services({type:'getGuaranteesImages',parameter:itemCodes.toString(),loading:false});
    for(let i = 0; i < res.length; i++){
      images[res.ItemCode] = res.ImagesUrl;
    }
    this.setState({images})
  }
  async getGuaranteeItems(){
    let {services} = this.state;
    let res = await services({type:"guaranteeItems",loading:false});
    if(res === false){
      this.props.logout();
      return;
    }
    let {items,total} = res
    //this.getGuaranteeImages(items);
    let guaranteeExistItems = await services({type:"kalahaye_mojoode_garanti",loading:false});
    this.setState({
      guaranteeItems:items,
      totalGuaranteeItems:total,
      guaranteeExistItems
    });
  }
  async getCampaignsData() {
    let {services} = this.state;
    let campaigns = await services({type:"getCampaigns",cache:120,loading:false});
    this.setState({ campaigns});
  }
  async getBazargahOrders(){
    let {services,bazargah} = this.state;
    bazargah.wait_to_get = await services({type:'bazargah_orders',parameter:{type:'wait_to_get'},loading:false});
    bazargah.wait_to_send = await services({type:'bazargah_orders',parameter:{type:'wait_to_send'},loading:false});
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
    return {...data,storeName:userInfo.storeName};
  }
  showMessage(message){
    alert(message)
    //this.setState({message:this.state.messages.concat(message)});
  }
  async componentDidMount() {
    let developerMode = true
    let {userCardCode,bazargah} = this.state;
    let b1Info = await this.getB1Info(userCardCode);
    this.getGuaranteeItems()
    this.getCampaignsData();
    if(bazargah.active){this.getBazargahOrders();}
    //let testedChance = await services({type:"get_tested_chance"});
    let pricing = new Pricing('https://b1api.burux.com/api/BRXIntLayer/GetCalcData', userCardCode, 10 * 60 * 1000)
    let istarted = pricing.startservice().then((value) => { return value; });
    let fixPrice = (items,caller)=>{
      if(developerMode){
        if(!caller){
          console.error('fixPrice missing caller. items is ',items)
        }
        for(let i = 0; i < items.length; i++){
          if(!items[i].itemCode){
            console.error(caller + ' missing itemCode. item is ',items[i])
          }
          if(!items[i].itemQty){
            console.error(caller + ' missing itemQty. item is ',items[i])
          }
        }
      }
      let data = {
        "CardGroupCode": b1Info.customer.groupCode,
        "CardCode": this.state.userCardCode,
        "marketingdetails": {
            "priceList": b1Info.customer.priceListNum,
            "slpcode": userCardCode
        },
        "MarketingLines": items
      }
      let list = items.map(({itemCode})=>itemCode);
      list = pricing.autoPriceList(list, data, null, null, null, null, null, "01");
      return list
    }
    let updateProductPrice = (list,caller)=>{
      if(list === false){return false}
      return list.map((o)=>{
        let a=[{itemCode:o.defaultVariant.code,itemQty:1}];
        let obj = fixPrice(a,caller)[0]
        let newObj = {...o,...obj};
        return newObj
      })
    }
    this.setState({
      userInfo:{...b1Info.customer,storeName:b1Info.storeName},
      b1Info,
      fixPrice,
      updateProductPrice,
      wallet:b1Info.customer.ballance
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
        return {
          flex: 1,
          attrs: { onClick: () => this.setState({ activeBottomMenu: id }) },
          column: [
            { size: 12 },
            {html: getSvg(icon, { fill: active ? "#0094D4" : "#605E5C" }),align: "vh"},
            {html: text,align: "vh",style: { fontSize: 12, color: active ? "#0094D4" : "#6E6E6E" }}
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
        {messages.length && <Message messages={messages} onChange={(res)=>this.setState({messages:res})}/>}
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
  state = {step:0}
  constructor(props){
    super(props);
    this.state = {step:0}
    this.colors = new RColor().between('#2d5193','#7aa5f5',60)
    this.colors1 = new RColor().between('#0094D4','#fff',40)
    
    this.gradientInterval = setInterval(()=>{
      let {step} = this.state;
      if(step >= 170){
        clearInterval(this.gradientInterval);
        return;
      }
      this.setState({step:step + 1})
    },30)
  }
  getGradient(){
    let {step} = this.state;
    let range = 30;
    let c = step < range * 2?0:step - range * 2;
    let a = step < range?0:step - range;
    let b = step > 100?100:step;
    let white = '#0666f8';
    let blue = '#0d2d6a';
    if(step > 130){
      let color = this.colors1[step - 131];
      white = color;
      blue = color;
    }
    return (
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:blue,stopOpacity:1}} />
          <stop offset={`${c}%`} style={{stopColor:blue,stopOpacity:1}} />
          <stop offset={`${a}%`} style={{stopColor:white,stopOpacity:1}} />
          <stop offset={`${b}%`} style={{stopColor:white,stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:blue,stopOpacity:1}} />
        </linearGradient>
      </defs>
    )
  }
  render(){
    return (
      <RVD
        layout={{
          style:{background:'#0094D4',position:'fixed',width:'100%',height:'100%',left:0,top:0},
          column:[
            {size:152},
            {html:<img src={splashSrc} width='200' alt=''/>,align:'vh'},
            {flex:1},
            {html:'چند لحظه صبر کنید',className:'colorFFF size14',align:'vh'},
            {size:48}
          ]
        }}
      />
    )
  }
}
function RColor(log){
  let a = {
    number_to_hex(c) {c = c.toString(16); return c.length == 1 ? "0" + c : c;},
    getType(c){
      if(Array.isArray(c)){return 'array'}
      return c.indexOf('rgb') !== -1?'rgb':'hex';
    },
    between(c1,c2,count){
      var [r1,g1,b1] = this.to_array(c1);
      var [r2,g2,b2] = this.to_array(c2);
      var rDelta = (r2 - r1) / (count - 1);
      var gDelta = (g2 - g1) / (count - 1);
      var bDelta = (b2 - b1) / (count - 1);
      var colors = [];
      for(var i = 0; i < count; i++){
        let color = `rgb(${Math.round(r1 + rDelta * i)},${Math.round(g1 + gDelta * i)},${Math.round(b1 + bDelta * i)})`;
        colors.push(color)
      }
      return colors;
    },
    to_dark(c,percent){
      let [r,g,b] = this.to_array(c);
      r = Math.round(r - (r * (percent / 100)))
      g = Math.round(g - (g * (percent / 100)))
      b = Math.round(b - (b * (percent / 100)))
      return this['to_' + this.getType(c)]([r,g,b])
    },
    to_light(c,percent){
      let [r,g,b] = this.to_array(c);
      r = Math.round((255 - r) + ((255 - r) * (percent / 100)))
      g = Math.round((255 - g) + ((255 - g) * (percent / 100)))
      b = Math.round((255 - b) + ((255 - b) * (percent / 100)))
      return this['to_' + this.getType(c)]([r,g,b])
    },
    log(color){
      console.log(`%c ${color}`, 'background: '+color+'; color: #000');
    },
    getRandom(from,to){return from + Math.round(Math.random() * (to - from))},
    reverse(c){return this['to_' + this.getType(c)](this.to_array(c).map((o)=>255 - o))},
    random(obj = {}){
      let {
        type = 'hex',
        r = this.getRandom(0,255), 
        g = this.getRandom(0,255),
        b = this.getRandom(0,255)
      } = obj;
      if(Array.isArray(r)){r = this.getRandom(r[0],r[1])}
      if(Array.isArray(g)){g = this.getRandom(g[0],g[1])}
      if(Array.isArray(b)){b = this.getRandom(b[0],b[1])}
      return this['to_' + type]([r,g,b])
    },
    to_array(c){
      if(Array.isArray(c)){return c}
      if(c.indexOf('rgb(') === 0){
        return c.slice(c.indexOf('(') + 1,c.indexOf(')')).split(',').map((o)=>+o);
      }
      c = c.substr(1);
      let values = c.split(''),r,g,b;
      if (c.length === 3) {
          r = parseInt(values[0] + values[0], 16);
          g = parseInt(values[1] + values[1], 16);
          b = parseInt(values[2] + values[2], 16);
      } 
      else if (c.length === 6) {
          r = parseInt(values[0] + values[1], 16);
          g = parseInt(values[2] + values[3], 16);
          b = parseInt(values[4] + values[5], 16);
      } 
      return [r,g,b];
    },
    to_hex(c){return `#${this.to_array(c).map((o)=>this.number_to_hex(o)).toString()}`;}, 
    to_rgb(c){return `rgb(${this.to_array(c).toString()})`;}
  };
  return {
    to_hex:a.to_hex.bind(a),
    to_rgb:a.to_rgb.bind(a),
    to_array:a.to_array.bind(a),
    number_to_hex:a.number_to_hex.bind(a),
    reverse:a.reverse.bind(a),
    log:a.log.bind(a),
    random:a.random.bind(a),
    between:a.between.bind(a)
  };
}