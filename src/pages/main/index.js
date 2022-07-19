import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "../../utils/getSvg";
import Home from "./../home/index";
import MyBurux from "./../my-burux/index";
import Buy from "./../buy/index";
import appContext from "../../app-context";
import SideMenu from "../../components/sidemenu";
import Loading from "../../components/loading";
import Services from "./../../services";
import layout from "../../layout";
import dateCalculator from "../../utils/date-calculator";
import functions from "../../functions";
import Search from "./../../popups/search/search";
import Shipping from './../../popups/shipping/shipping';
import Cart from "./../../popups/cart/cart";
import Product from "./../../popups/product/product";
import CategoryView from "./../../popups/category-view/category-view";
import GuaranteePopup from "../../popups/guarantee-popup/guarantee-popup";
import GuaranteePopupSubmit from "../../popups/guarantee-popup-submit/guarantee-popup-sumbmit";
import GuaranteePopupSuccess from "../../popups/guarantee-popup-success/guarantee-popup-success";
import OrdersHistory from "../../popups/orders-history/orders-history";
import OrderPopup from "../../popups/order-popup/order-popup";
import "./index.css";
export default class Main extends Component {
  constructor(props) {
    super(props);
    let theme = localStorage.getItem('electricy-theme');
    if(theme === undefined || theme === null){
      theme = false;
      localStorage.setItem('electricy-theme','false')
    }
    else {
      theme = theme === 'false'?false:'theme-1'
    }
    this.dateCalculator = dateCalculator();
    this.state = {
      services:Services(()=>this.state),
      theme,
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
      guaranteePopupSubmitZIndex:0,
      ordersHistoryZIndex:0,
      orderZIndex:0,
      order:false,
      bottomMenuItems: [
        { text: "خانه", icon: 19, id: "a" },
        { text: "خرید", icon: 'buy', id: "b" },
        { text: "بازارگاه", icon: 20, id: "c" },
        { text: "بروکس من", icon: 21, id: "d" },
      ],
      guaranteeItems: [],
      guaranteeExistItems: [],
      activeBottomMenu: "a",
      popup: {},
      peygiriyeSefaresheKharid_tab:undefined,
      buy_view:undefined//temporary state
    };
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
  async getGuaranteeItems(){
    let {services} = this.state;
    let guaranteeItems = await services({type:"kalahaye_garanti_shode",loading:false});
    let guaranteeExistItems = await services({type:"kalahaye_mojoode_garanti",loading:false});
    this.setState({
      guaranteeItems,
      guaranteeExistItems
    });
  }
  async componentDidMount() {
    let {services} = this.state;
    this.getGuaranteeItems()
    let testedChance = await services({type:"get_tested_chance"});
    let userInfo = await services({type:"userInfo",cache:1000});
    this.setState({
      userInfo,
      testedChance,
    });
  }
  getBottomMenu() {
    let { activeBottomMenu, bottomMenuItems } = this.state;
    return {
      size: 60,
      className: "bottom-menu",
      row: bottomMenuItems.map(({ text, icon, id }) => {
        let active = id === activeBottomMenu;
        return {
          flex: 1,
          attrs: { onClick: () => this.setState({ activeBottomMenu: id }) },
          column: [
            { size: 12 },
            {
              html: getSvg(icon, { fill: active ? "#0094D4" : "#605E5C" }),
              align: "vh",
            },
            {
              html: text,
              align: "vh",
              style: { fontSize: 12, color: active ? "#0094D4" : "#6E6E6E" },
            },
          ],
        };
      }),
    };
  }
  getContent() {
    let { activeBottomMenu,buy_view } = this.state;
    if (activeBottomMenu === "a") {
      return <Home />;
    }
    if (activeBottomMenu === "b") {
      return <Buy view={buy_view}/>;
    }
    if (activeBottomMenu === "d") {
      return <MyBurux />;
    }
  }
  getHeaderLayout(title, onBack) {
    return {
      size: 48,
      className: "header",
      row: [
        {
          size: 48,
          html: getSvg("chevronLeft", { flip: true }),
          align: "vh",
          attrs: { onClick: () => onBack() },
        },
        { size: 6 },
        {
          flex: 1,
          html: title,
          align: "v",
          className: "size16 bold color605E5C",
        },
      ],
    };
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
      SetState: (obj) => this.setState(obj),
      changeCart:this.changeCart.bind(this),
      getCartCountByVariantId:this.getCartCountByVariantId.bind(this),
      changeTheme:this.changeTheme.bind(this),
      logout: this.props.logout,
      getHeaderLayout: this.getHeaderLayout.bind(this),
      layout:(type,parameters)=>layout(type,()=>this.state,parameters)
    };
    let { 
      popup, sidemenuOpen, theme,orderZIndex,
      cartZIndex,shippingZIndex,searchZIndex,productZIndex,categoryZIndex,
      guaranteePopupSuccessZIndex,guaranteePopupSubmitZIndex,guaranteePopupZIndex,ordersHistoryZIndex
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
        {orderZIndex !== 0 && <OrderPopup/>}
        {guaranteePopupZIndex !== 0 && <GuaranteePopup/>}
        {guaranteePopupSubmitZIndex !== 0 && <GuaranteePopupSubmit/>}
        {guaranteePopupSuccessZIndex !== 0 && <GuaranteePopupSuccess/>}
        {searchZIndex !== 0 && <Search/>}
        {shippingZIndex !== 0 && <Shipping/>}
        {productZIndex !== 0 && <Product/>}
        {cartZIndex !== 0 && <Cart/>}
        {categoryZIndex !== 0 && <CategoryView/>}
        <SideMenu
          onClose={() => this.setState({ sidemenuOpen: false })}
          open={sidemenuOpen}
        />
        <Loading />
      </appContext.Provider>
    );
  }
}