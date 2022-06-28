import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "../../utils/getSvg";
import Home from "./../home/index";
import MyBurux from "./../my-burux/index";
import Buy from "./../buy/index";
import appContext from "../../app-context";
import Table from "./../../coponents/aio-table/aio-table";
import SideMenu from "../../coponents/sidemenu";
import Loading from "../../coponents/loading";
import LampSrc from "./../../images/lamp.png";
import Services from "./../../services";
import layout from "../../layout";
import dateCalculator from "../../utils/date-calculator";
import "./index.css";
import functions from "../../functions";
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
      searchValue: "",
      peygiriyeSefaresheKharid_tab:undefined,
      buy_view:undefined//temporary state
    };
  }
  async componentDidMount() {
    let {services} = this.state;
    let guaranteeItems = await services({type:"kalahaye_garanti_shode"});
    let guaranteeExistItems = await services({type:"kalahaye_mojoode_garanti"});
    let testedChance = await services({type:"get_tested_chance"});
    let userInfo = await services({type:"userInfo",cache:1000});
    let allProducts = await services({type:"getAllProducts",cache:1000});    
    this.setState({
      guaranteeItems,
      userInfo,
      guaranteeExistItems,
      testedChance,
      allProducts,
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
      changeTheme:this.changeTheme.bind(this),
      logout: this.props.logout,
      getHeaderLayout: this.getHeaderLayout.bind(this),
      layout:(type,parameters)=>layout(type,()=>this.state,parameters)
    };
    let { popup, guaranteeItems, sidemenuOpen, theme,peygiriyeSefaresheKharid_tab,services } = this.state;
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
        {popup.mode === "guarantee-popup" && (
          <GuaranteePopup
            onClick={async (type, typeNumber) => {
              if (typeNumber === 1) {
                let res = await services({type:"sabte_kalahaye_garanti"});
                if (res) {
                  this.setState({ popup: { mode: type } });
                } else {
                  alert("error");
                }
              } else {
                this.setState({ popup: { mode: type } });
              }
            }}
          />
        )}
        {popup.mode === "guarantee-popup-without-submit-success" && (
          <GuaranteePopupSuccess
            submit={false}
            success={false}
            today={this.dateCalculator.getToday('jalali','hour')}
            onClose={() => this.setState({ popup: {} })}
          />
        )}
        {popup.mode === "guarantee-popup-with-submit-success" && (
          <GuaranteePopupSuccess
            submit={true}
            today={this.dateCalculator.getToday('jalali','hour')}
            onClose={() => this.setState({ popup: {} })}
          />
        )}
        {popup.mode === "guarantee-popup-with-submit-unsuccess" && (
          <GuaranteePopupSuccess
            submit={false}
            today={this.dateCalculator.getToday('jalali','hour')}
            success={false}
            onClose={() => this.setState({ popup: {} })}
          />
        )}
        {popup.mode === "guarantee-popup-with-submit" && (
          <GuaranteePopupWithSubmit
            items={guaranteeItems}
            onSubmit={async (Items) => {
              let res = await services({type:"sabte_kalahaye_garanti", parameter:Items});
              if (res) {
                let guaranteeItems = await services({type:"kalahaye_garanti_shode"});
                this.setState({
                  guaranteeItems,
                  popup: { mode: "guarantee-popup-with-submit-success" },
                });
              } else {
                this.setState({
                  guaranteeItems,
                  popup: { mode: "guarantee-popup-with-submit-unsuccess" },
                });
              }
            }}
            onClose={() => this.setState({ popup: {} })}
          />
        )}
        {popup.mode === "peygiriye-sefareshe-kharid" && (
          <PeygiriyeSefaresheKharid
            onClose={() => {
              if(popup.onBack){popup.onBack()}
              else {this.setState({ popup: {} })}
            }}
            tab={peygiriyeSefaresheKharid_tab}
            
          />
        )}
        {popup.mode === "joziate-sefareshe-kharid" && (
          <JoziateSefaresheKharid
            order={popup.order}
            onClose={() =>
              this.setState({ popup: { mode: "peygiriye-sefareshe-kharid" } })
            }
          />
        )}
        {popup.mode === "search" && (
          <Search onClose={() => this.setState({ popup: {} })} />
        )}
        <SideMenu
          onClose={() => this.setState({ sidemenuOpen: false })}
          open={sidemenuOpen}
        />
        <Loading />
      </appContext.Provider>
    );
  }
}

class GuaranteePopup extends Component {
  static contextType = appContext;
  render() {
    let { onClick } = this.props;
    let {theme} = this.context;
    return (
      <div className={"popup-container" + (theme?' ' + theme:'')}>
        <RVD
          layout={{
            className: "guarantee-popup theme-1-dark-bg",
            column: [
              {
                size: 36,
                row: [
                  { flex: 1 },
                  {
                    size: 36,
                    html: getSvg(40),
                    align: "vh",
                    attrs: { onClick: () => onClick(false) },
                  },
                ],
              },
              {
                size: 60,
                html: "درخواست جمع آوری کالاهای گارانتی",
                className: "size16 bold color323130 theme-1-colorFFF",
                align: "vh",
              },
              {
                html: "با وارد کردن جزئیات کالاهای گارانتی، درخواست شما در اولین فرصت طی 72 ساعت آینده توسط ویزیتور بررسی میگردد.در غیر این صورت درخواست شما در ویزیت بعدی بررسی میگردد",
                className: "size14 color605E5C theme-1-colorDDD",
              },
              { size: 24 },
              {
                html: (
                  <button
                    onClick={() =>
                      onClick("guarantee-popup-without-submit-success", 1)
                    }
                    className="button-1"
                  >
                    ادامه بدون ثبت جزئیات
                  </button>
                ),
              },
              { size: 12 },
              {
                html: (
                  <button
                    onClick={() => onClick("guarantee-popup-with-submit", 2)}
                    className="button-2"
                  >
                    ثبت جزئیات کالاهای گارانتی
                  </button>
                ),
              },
            ],
          }}
        />
      </div>
    );
  }
}
class GuaranteePopupSuccess extends Component {
  static contextType = appContext;
  render() {
    let { submit, onClose, success,today } = this.props;
    let {theme} = this.context;
    let text;
    if (success === false) {
      text = "خطا";
    }
    if (submit) {
      text = "درخواست گارانتی شما با موفقیت ثبت شد";
    } else {
      text = "درخواست گارانتی شما با موفقیت اعلام شد";
    }
    return (
      <div className={"popup-container" + (theme?' ' + theme:'')}>
        <RVD
          layout={{
            className: "guarantee-popup-success theme-1-dark-bg",
            column: [
              {
                size: 36,
                row: [
                  {
                    size: 36,
                    html: getSvg("chevronLeft", { flip: true }),
                    align: "vh",
                    attrs: { onClick: () => onClose() },
                  },
                  { flex: 1 },
                ],
              },
              { size: 48 },
              { html: getSvg(41), align: "h" },
              { size: 24 },
              { html: text, className: "color107C10 size20 bold", align: "h" },
              { size: 24 },
              {
                html: "درخواست گارانتی شما در تا 72 ساعت آینده بررسی خواهد شد",
                className: "size14 color605E5C theme-1-colorDDD",
                align: "h",
              },
              { flex: 1 },
              {
                size: 60,
                html: `ثبت درخواست در ${`${today[3]}:${0} ${today[0]}/${today[1]}/${today[2]}`}`,
                className: "size16 bold color605E5C theme-1-colorDDD",
                align: "vh",
              },
              {
                html: (
                  <button onClick={() => onClose()} className="button-2">
                    بازگشت
                  </button>
                ),
              },
            ],
          }}
        />
      </div>
    );
  }
}
class GuaranteePopupWithSubmit extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }
  render() {
    let { items } = this.state;
    let { onClose, onSubmit } = this.props;
    let { getHeaderLayout, guaranteeExistItems,theme } = this.context;
    return (
      <div className={"popup-container" + (theme?' ' + theme:'')}>
        <RVD
          layout={{
            className: "popup main-bg",
            column: [
              getHeaderLayout("ثبت درخواست گارانتی جدید", () => onClose()),
              { size: 12 },
              {
                className: "box",
                style: { padding: 12 },
                column: [
                  {
                    row: [
                      {
                        html: "تاریخ مراجعه ویزیتور : ",
                        className: "size16 color605E5C",
                      },
                      {
                        html: "تا 72 ساعت آینده",
                        className: "size16 color605E5C",
                      },
                    ],
                  },
                  { size: 12 },
                  {
                    row: [
                      { size: 16, html: getSvg(42), align: "vh" },
                      { size: 6 },
                      {
                        flex: 1,
                        html: "ویزیتور جهت ثبت کالاهای گارانتی در تاریخ ذکر شده به فروشگاه شما مراجعه میکند",
                        className: "size12 color00B5A5 bold",
                      },
                    ],
                  },
                ],
              },
              { size: 12 },
              {
                className: "box",
                style: { padding: 12 },
                column: [
                  {
                    html: "کالاهای گارانتی",
                    className: "size16 color605E5C",
                  },
                  { size: 12 },
                  {
                    row: [
                      { size: 16, html: getSvg(42), align: "vh" },
                      { size: 6 },
                      {
                        flex: 1,
                        html: "با ثبت کالاهای درخواستی برای گارانتی، درخواست شما در اولویت قرار میگیرد.",
                        className: "size12 color00B5A5 bold",
                      },
                    ],
                  },
                ],
              },
              { size: 12 },
              {
                flex: 1,
                html: (
                  <Table
                    paging={false}
                    columns={[
                      {
                        title: "",
                        width: 36,
                        cellAttrs:(row)=>{
                          return {
                            onClick:()=>{
                              let {items} = this.state;
                              this.setState({items:items.filter((o)=>row.Code !== o.Code)})
                            }
                          }
                        },
                        template: (row) => {
                          return 'X'
                            
                        },
                      },
                      { title: "عنوان", getValue: (row) => row.Name },
                      {
                        title: "تعداد",
                        getValue: (row) => row.Qty,
                        width: 70,
                        inlineEdit: {
                          type: "number",
                          onChange: (row, value) => {
                            let { items } = this.state;
                            row.Qty = value;
                            this.setState({ items });
                          },
                        },
                      },
                    ]}
                    model={items}
                    toolbarItems={[
                      {
                        type: "select",
                        text: "افزودن کالا",
                        caret: false,
                        className:'button-1',
                        popupAttrs: { style:{maxHeight: 400 ,bottom:0,top:'unset',position:'fixed',left:0,width:'100%'}},
                        optionText:'option.Name',
                        optionValue:'option.Code',
                        options: guaranteeExistItems,
                        onChange: (value, obj) => {
                          let { items } = this.state;
                          items.push({
                            Name: obj.text,
                            Code: obj.value,
                            Qty: 1,
                          });
                          this.setState({ items });
                        },
                      }
                    ]}
                  />
                ),
              },
              {
                show:!!items.length,html:<button disabled={!items.length} className='button-2' onClick={()=>onSubmit(items)}>ثبت درخواست</button>,style:{padding:12}
              }
            ],
          }}
        />
      </div>
    );
  }
}

class PeygiriyeSefaresheKharid extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    let {tab = 'SalesApproved'} = this.props;
    this.state = {tab,tabs:{}};
  }
  async componentDidMount() {
    let {services} = this.context;
    let tabs = await services({type:"peygiriye_sefareshe_kharid",cache:1});
    this.setState({tabs});
    this.context.SetState({peygiriyeSefaresheKharid_tab:undefined})
  }
  translate(text){
    return {
      Invoiced:'فاکتور شده',
      Registered:'در حال پردازش',
      SalesApproved:'در انتظار تایید ویزیتور',
      PaymentApproved:'پرداخت شده'
    }[text] || text;
  }
  getTabs(){
    let {tabs} = this.state;
    let res = [];
    for(let prop in tabs){
      res.push({title:this.translate(prop),badge:tabs[prop].length,id:prop})
    }
    return res
  }
  // { title: "در حال پردازش", badge: inProcess.length, id: "inProcess" },
  // { title: "تحویل شده", badge: delivered.length, id: "delivered" },
  // { title: "مرجوع شده", badge: rejected.length, id: "rejected" },
  // { title: "لغو شده", badge: canceled.length, id: "canceled" },
  getTabsLayout() {
    let {services} = this.context;
    let {tab} = this.state;
    let parameters = {
      tabs:this.getTabs(),
      activeTabId: tab,
      onClick: async (obj) => {
        let tabs = await services({type:"peygiriye_sefareshe_kharid",cache:1});
        this.setState({tab: obj.id,tabs});
      },
    };
    return this.context.layout("tabs", parameters);
  }
  async getDetails(o){
    let { SetState,services } = this.context;
    let res = await services({type:"joziatepeygiriyesefareshekharid", parameter:o});
    SetState({popup: {mode: "joziate-sefareshe-kharid",order: res}})
  }
  render() {
    let { onClose } = this.props;
    let { tab,tabs } = this.state;
    let { getHeaderLayout, SetState,theme } = this.context;
    let orders = tabs[tab] || [];
    return (
      <div className={"popup-container" + (theme?' ' + theme:'')}>
        <RVD
          layout={{
            className: "popup main-bg",
            column: [
              getHeaderLayout("پیگیری سفارش خرید", () => onClose()),
              this.getTabsLayout(),
              { size: 12 },
              {
                flex: 1,gap: 12,
                column: orders.map((o) => {
                  return {html: (<OrderCard {...o} onClick={() =>this.getDetails(o)}/>)};
                }),
              },
            ],
          }}
        />
      </div>
    );
  }
}
class OrderCard extends Component {
  render() {
    let { items = [], docEntry, date, total, onClick } = this.props;
    return (
      <RVD
        layout={{
          className: "box",
          style: { padding: 12 },
          column: [
            {
              align: "v",
              size: 36,
              row: [
                { html: "پیش سفارش:", className: "colorA19F9D size12" },
                { size: 4 },
                { html: docEntry, className: "color605E5C size14" },
                { flex: 1 },
                { html: date, className: "colorA19F9D size12" },
              ],
            },
            {
              size: 40,
              className: "color605E5C size12",
              scroll: "v",
              style: { whiteSpcae: "nowrap", flexWrap: "nowrap" },
              html: items
                .map((o) => {
                  return `${o.Qty} عدد ${o.name} `;
                })
                .toString(),
            },
            {
              size: 36,
              childsProps: { align: "v" },
              row: [
                {
                  html: "مشاهده",
                  className: "size14 color0094D4",
                  attrs: {
                    onClick: () => onClick(),
                  },
                },
                { flex: 1 },
                { html: total, className: "size14 color323130" },
                { size: 6 },
                { html: "تومان", className: "size12 color605E5C" },
              ],
            },
          ],
        }}
      />
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
class Search extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      searchFamilies: [{ name: "جنرال" },{ name: "جاینت" },{ name: "پنلی" },{ name: "سیم و کابل" }],
      result: [
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000},
        {src: LampSrc,name: "لامپ",color: "آفتابی",unit: "",discountPercent: 1000,discountPrice: 10,Qty: 3,price: 324000}
      ],
    };
  }
  async changeSearch(searchValue) {
    let {services} = this.context;
    clearTimeout(this.timeout);
    this.setState({ searchValue });
    this.timeout = setTimeout(async () => {
      let res = await services({type:"search", parameter:searchValue});
      this.setState({ result: res });
    }, 2000);
  }
  render() {
    let { getHeaderLayout } = this.context;
    let { searchValue, searchFamilies, result } = this.state;
    let { onClose } = this.props;
    return (
      <div className="popup-container">
        <RVD
          layout={{
            className: "popup main-bg",
            column: [
              getHeaderLayout("جستجوی کالا", () => onClose()),
              this.context.layout("search", {value: searchValue,onChange: (searchValue) => this.changeSearch(searchValue)}),
              {size: 200,align: "vh",className: "size20 color323130 bold",show: false,html: "در میان ان کالا جستجو"},
              {size: 48,align: "v",className: "size14 color323130 bold",html: "جستجو در خانواده ها",style: { padding: "0 24px" }},
              {
                gap: 12,
                row: searchFamilies.map((o) => {
                  return {size: 90,html: o.name,className: "color605E5C size14",align: "vh",style: {border: "1px solid #999",borderRadius: 24}};
                }),
              },
              {size: 48,align: "v",className: "size14 color323130 bold padding-0-24",html: "محصولات"},
              { size: 24 },
              {
                flex: 1,
                column: result.map((o, i) => {
                  return this.context.layout("productCard2", {...o,isFirst: i === 0,isLast: i === result.length - 1});
                }),
              },
            ],
          }}
        />
      </div>
    );
  }
}
