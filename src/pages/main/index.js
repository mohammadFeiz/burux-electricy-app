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
import PeygiriyeSefaresheKharid from "../../popups/peygiriye-sefareshe-kharid/peygiriye-sefareshe-kharid";
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
      peygiriyeSefaresheKharidZIndex:0,
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
  async componentDidMount() {
    let {services} = this.state;
    let guaranteeItems = await services({type:"kalahaye_garanti_shode"});
    let guaranteeExistItems = await services({type:"kalahaye_mojoode_garanti"});
    let testedChance = await services({type:"get_tested_chance"});
    let userInfo = await services({type:"userInfo",cache:1000});
    this.setState({
      guaranteeItems,
      userInfo,
      guaranteeExistItems,
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
      popup, sidemenuOpen, theme,peygiriyeSefaresheKharid_tab,
      cartZIndex,shippingZIndex,searchZIndex,productZIndex,categoryZIndex,
      guaranteePopupSuccessZIndex,guaranteePopupSubmitZIndex,guaranteePopupZIndex,peygiriyeSefaresheKharidZIndex
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
        {peygiriyeSefaresheKharidZIndex !== 0 && <PeygiriyeSefaresheKharid/>}
        {popup.mode === "joziate-sefareshe-kharid" && (
          <JoziateSefaresheKharid
            order={popup.order}
            onClose={() =>
              this.setState({ popup: { mode: "peygiriye-sefareshe-kharid" } })
            }
          />
        )}
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








class JoziateSefaresheKharid extends Component {
  static contextType = appContext;
  getRow(key, value) {
    return {
      align: "v",
      row: [
        { size: 110, html: key + " : ", className: "size12 colorA19F9D" },
        { flex: 1, html: value, className: "size12 theme-1-colorFFF" },
      ],
    };
  }
  getStatus(status) {
    let statuses = [
      { title: "در حال پردازش", color: "#662D91", percent: 50 },
      { title: "مرسوله در مسیر فروشگاه است", color: "#108ABE", percent: 65 },
      { title: "تحویل شده", color: "#107C10", percent: 100 },
      { title: "لغو شده", color: "#A4262C", percent: 100 },
    ];
    let obj = statuses[status];
    if (!obj) {return null;}
    return {
      style: { padding: "0 24px" },className: "box",
      column: [
        { size: 16 },
        {size: 24,html: obj.title,style: { color: obj.color },className: "size14 bold"},
        {
          html: (
            <div style={{height: 12,display: "flex",width: "100%",borderRadius: 3,overflow: "hidden"}}>
              <div style={{ width: obj.percent + "%", background: obj.color }}></div>
              <div style={{ flex: 1, background: obj.color, opacity: 0.3 }}></div>
            </div>
          ),
        },
        { size: 16 },
      ],
    };
  }
  
  render() {
    let { getHeaderLayout,theme } = this.context;
    let {order,onClose} = this.props;
    let {
      docEntry,date,customerName,customerCode,customerGroup,campain,basePrice,visitorName,address,mobile,
      phone,total,paymentMethod,items
    } = order;
    return (
      <div className={"popup-container" + (theme?' ' + theme:'')}>
        <RVD
          layout={{
            className: "popup main-bg",
            column: [
              getHeaderLayout("جزيیات سفارش خرید", () => onClose()),
              { size: 12 },
              {
                flex: 1,scroll: "v",gap: 12,
                column: [
                  {
                    className: "box gap-no-color",
                    style: { padding: 12 },
                    gap: 12,
                    column: [
                      this.getRow("پیش فاکتور", docEntry),
                      this.getRow("تاریخ ثبت", date),
                      { size: 12 },
                      this.getRow(
                        "نام مشتری",
                        customerName + " - " + customerCode
                      ),
                      this.getRow("گروه مشتری", customerGroup),
                      this.getRow("نام کمپین", campain),
                      this.getRow("قیمت پایه", basePrice),
                      this.getRow("نام ویزیتور", visitorName),
                      { size: 12 },
                      this.getRow("آدرس", address),
                      this.getRow("تلفن همراه", mobile),
                      this.getRow("تلفن ثابت", phone),
                      { size: 12 },
                      this.getRow("مبلغ پرداختی کل", total),
                      this.getRow("نحوه پرداخت", paymentMethod),
                    ],
                  },
                  //this.getStatus(order.status),
                  {
                    gap: 2,
                    column: items.map((o, i) => {
                      let src = functions.getProductSrc(o);
                      return this.context.layout("productCard2", {...o,src,isFirst: i === 0,isLast: i === items.length - 1})
                    })
                  },
                ],
              },
            ],
          }}
        />
      </div>
    );
  }
}
