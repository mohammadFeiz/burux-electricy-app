import React, { Component, Fragment } from "react";
import RVD from "react-virtual-dom";
import getSvg from "./../../utils/getSvg";
import appContext from "../../app-context";
import AIOButton from "./../../coponents/aio-button/aio-button";
import functions from "../../functions";
import src1 from "./../../utils/brx66.png";
import catTools from './../../images/cat-tools.png';
import catCable from './../../images/cat-cable.png';
import catLamp from './../../images/cat-lamp.png';
import $ from 'jquery';
import "./index.css";
import services from "../../services";
import ContentSlider from "../../coponents/content-slider";

export default class Buy extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    let {view = {type:"main"}} = this.props;
    this.state = {
      searchValue: "",
      view, //main,category,product
      campaigns: [],
      tabs: [
        { title: "نمایشگاه", id: "1", flex: 1 },
        { title: "دسته بندی کالاها", id: "2", flex: 1 },
      ],
      activeTabId: "1",
      activeCartTabId:'regular',
      lastOrders: [],
      recommendeds: [],
      bestSellings: [],
      families: [],
      preOrders: { waitOfVisitor: 0, waitOfPey: 0 },
      categories: [],
    };
  }
  
  getProduct() {
    return {
      name: "لامپ LED جنرال 10 وات بروکس",
      code: "213654",
      id: "b",
      details: [
        ["تعداد در کارتن", "100عدد"],
        ["سرپیچ", "بزرگ"],
      ],
      optionTypes: [
        {
          name: "رنگ",
          id: "color",
          items: [
            { name: "زرد", id: "yellow" },
            { name: "یخی", id: "ice" },
            { name: "سفید", id: "white" },
          ],
        },
        {
          name: "توان",
          id: "power",
          items: [
            { name: "10 وات", id: "10wat" },
            { name: "15 وات", id: "15wat" },
          ],
        },
      ],
      variants: [
        {
          optionValues: { color: "yellow", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "1",
        },
        {
          optionValues: { color: "ice", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "2",
        },
        {
          optionValues: { color: "yellow", power: "15wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "3",
        },
        {
          optionValues: { color: "white", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "4",
        },
        {
          optionValues: { color: "white", power: "15wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "5",
        },
        {
          optionValues: { color: "ice", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "6",
        },
      ],
      campaignsPrices: [
        { name: "خرید عادی", price: false, id: "10178" },
        { name: "فروش ویژه 10 وات", price: 235600, id: "10181" },
      ],
    };
  }
  changeView(o){
    if(o === 'back'){
      if(!this.viewStack.pop){return}
      this.viewStack.pop();
      let beforeView = {...this.viewStack[this.viewStack.length - 1]};
      this.setState({view:{...beforeView}});
      
    }
    else {
      this.viewStack = this.viewStack || [{type:'main'}];
      this.viewStack.push(o)
      this.setState({view:{...o}});
    }
    
  }
  async getCampaignsData() {
    let campaigns = await services("getCampaigns");
    this.setState({ campaigns});
  }
  async getPreOrders() {
    let {allProducts} = this.context;
    let preOrders = await services("preOrders",{allProducts});
    this.setState({ preOrders });
  }
  async getCategories() {
    let {allProducts} = this.context;
    let categories = await services("getCategories",{allProducts});
    this.setState({ categories });
  }
  async getFamilies() {
    let {allProducts} = this.context;
    let families = await services('families',{allProducts});
    this.setState({ families });
  }
  async getRecommendeds(count) {
    let {allProducts} = this.context;
    let recommendeds = await services('recommendeds',{allProducts,count});
    if(count){this.setState({ recommendeds });}
    else {return recommendeds}
  }
  async getLastOrders(count) {
    let {allProducts} = this.context;
    let lastOrders = await services("lastOrders",{allProducts,count});
    this.setState({ lastOrders });
    if(count){this.setState({ lastOrders });}
    else {return lastOrders}
  }
  async getBestSellings(count) {
    let {allProducts} = this.context;
    let bestSellings = await services('bestCellings',{allProducts,count});
    if(count){this.setState({ bestSellings });}
    else {return bestSellings}
  }
  getActiveFamilyItems() {
    return [
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
        stockType: false,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
        stockType: "نورواره 2",
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
    ];
  }
  //dont set async for parallel data fetching
  componentDidMount() {
    this.getCampaignsData();
    this.getLastOrders(10);
    this.getFamilies();
    this.getPreOrders();
    this.getRecommendeds(10);
    this.getBestSellings(10);
    this.getCategories();
    this.context.SetState({buy_view:undefined})
  }
  preOrdersLayout() {
    let { preOrders } = this.state;
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      column: [
        {
          html: "پیش سفارشات",
          className: "size14 color323130 bold",
          size: 36,
          align: "v",
        },
        {
          gap: 12,
          size: 120,
          row: [
            {
              attrs:{
                onClick:()=>{
                  let {SetState} = this.context;
                  SetState({activeBottomMenu:'a',popup:{mode:'peygiriye-sefareshe-kharid'},peygiriyeSefaresheKharid_tab:'visitorWait'})
                }
              },
              style: { background: "#fafafa", borderRadius: 12 },
              flex: 1,
              column: [
                {
                  html: "در انتظار تایید ویزیتور",
                  align: "vh",
                  size: 48,
                  className: "size14 color605E5C bold",
                  
                },
                { html: preOrders.waitOfVisitor, align: "vh", flex: 1 },
              ],
            },
            {
              attrs:{
                onClick:()=>{
                  let {SetState} = this.context;
                  SetState({activeBottomMenu:'a',popup:{mode:'peygiriye-sefareshe-kharid'},peygiriyeSefaresheKharid_tab:'factored'})
                }
              },
              style: { background: "#fafafa", borderRadius: 12 },
              flex: 1,
              column: [
                {
                  html: "در انتظار پرداخت",
                  align: "vh",
                  size: 48,
                  className: "size14 color605E5C bold",
                },
                { html: preOrders.waitOfPey, align: "vh", flex: 1 },
              ],
            },
          ],
        },
      ],
    };
  }
  familiesLayout() {
    let { families } = this.state;
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      show: families.length !== 0,
      column: [
        {
          html: "محبوب ترین خانواده ها",
          className: "size14 color323130 bold",
          size: 36,
          align: "v",
        },
        {
          gap: 16,scroll:'h',
          row: families.map((o) => {
            let config = {
              ...o,src: src1,
              onClick: async () => this.changeView({type:"category",name:o.name,items:this.getActiveFamilyItems(o.id)}),
            };
            return this.context.layout("productCard", config);
          }),
        },
      ],
    };
  }
  tab1Layout() {
    let {bestSellings,lastOrders,recommendeds,campaigns} = this.state;
    let {allProducts} = this.context;
    return {
      flex: 1,scroll: "v",className:'buy-tab-1',gap: 12,
      column: [
        {
          html:(
            <ContentSlider 
              style={{borderRadius:16}} 
              items={
                campaigns.map((o)=>{
                  let {color,background,name,src} = o;
                  return {
                    title:name,color,background,icon:<img src={src} alt='' height='100%'/>,
                    button:{text:'خرید',onClick:async ()=>{
                      this.changeView({type:'campaign',items:await services("activeCampaignItems",{campaign:o,allProducts}),name:o.name,campaign:o})
                    }}
                  }
                })
              }
            />
          )
        },
        this.preOrdersLayout(),
        {html:(<CategorySlider 
            title='پر فروش ترین محصولات' items={bestSellings} 
            showAll={async ()=>this.changeView({type:'category',items:await this.getBestSellings(),name:'پر فروش ترین محصولات'})}
            onClick={(product)=>this.changeView({type:'product',product})}
        />)},
        this.familiesLayout(),
        {html:(<CategorySlider 
          title='آخرین سفارشات شما' items={lastOrders} 
          showAll={async ()=>this.changeView({type:'category',items:await this.getLastOrders(),name:'آخرین سفارشات شما'})}
          onClick={(product)=>this.changeView({type:'product',product})}
        />)},
        {html:(<CategorySlider 
          title='پیشنهاد سفارش' items={recommendeds} 
          showAll={async ()=>this.changeView({type:'category',items:await this.getRecommendeds(),name:'پیشنهاد سفارش'})}
          onClick={(product)=>this.changeView({type:'product',product})}
      />)},
      ],
    };
  }
  tab2Layout() {
    let { categories } = this.state;
    return {
      flex: 1,className:'box gap-no-color padding-12',scroll:'v',
      gap: 24,childsProps:{flex:1},
      column: [
        {
          column:[
            {flex:1,html:<img src={catLamp} alt='' width='100%'/>},
            {size:36,align:'vh',html:'لامپ و چراغ',className:'color323130 size16 bold'}
          ]
        },
        {
          column:[
            {flex:1,html:<img src={catCable} alt='' width='100%'/>},
            {size:36,align:'vh',html:'سیم  کابل',className:'color323130 size16 bold'}
          ]
        },
        {
          column:[
            {flex:1,html:<img src={catTools} alt='' width='100%'/>},
            {size:36,align:'vh',html:'ابزار وسایر',className:'color323130 size16 bold'}
          ]
        }
      ],
    };
  }
  cartButtonLayout() {
    let { view } = this.state;
    if (view.type === "cart") {return { html: "" };}
    let { cart } = this.context;
    let badge = 0;
    let variantIds = Object.keys(cart).map((o) => o);
    for (let i = 0; i < variantIds.length; i++) {
      let id = variantIds[i];
      let { count = 0 } = cart[id];
      badge += count;
    }
    return {
      html: (
        <AIOButton
          type="button"
          style={{ background: "none" }}
          text={getSvg(45)}
          badge={badge ? badge : undefined}
          badgeAttrs={{ className: "badge-1" }}
          onClick={() => this.changeView({type:"cart"})}
        />
      ),
    };
  }
  headerLayout() {
    let {view } = this.state;
    let { SetState } = this.context;
    return {
      className: "buy-header",
      size: 60,
      childsProps: { align: "vh" },
      row: [
        {size: 60,html: getSvg(22),attrs: { onClick: () => SetState({ sidemenuOpen: true }) },show: view.type === "main"},
        {size: 60,html: getSvg("chevronLeft", { flip: true }),attrs: { onClick: () => view.onBack?view.onBack():this.changeView('back')},show: view.type !== "main"},
        {html: {main: "خرید کالا",category: "خرید کالا",campaign: "خرید کالا",product: "خرید کالا",cart: "سبد خرید"}[view.type],className: "size16 color605E5C"},
        { flex: 1 },
        this.cartButtonLayout(),
        { size: 16 },
      ],
    };
  }
  tabsLayout() {
    let { tabs, activeTabId, view } = this.state;
    if (view.type !== "main") {return { html: "" };}
    return {
      flex: 1,style:{overflow:'hidden'},
      column: [
        this.context.layout("tabs", {tabs,activeTabId,onClick: (obj) => this.setState({ activeTabId: obj.id })}),
        activeTabId === "1" ? this.tab1Layout() : this.tab2Layout(),
      ],
    };
  }
  render() {
    let { view,searchValue} = this.state;
    let { cart,SetState } = this.context;
    return (
      <>
        <RVD
          layout={{
            flex: 1,
            className: "buy-page main-bg",
            style: { width: "100%" },
            column: [
              this.headerLayout(),
              this.context.layout("search", {show:view.type === 'main',value: searchValue,onChange: (searchValue) => this.setState({ searchValue })}),
              this.tabsLayout(),
              {
                flex:1,show:view.type === "category" || view.type === 'campaign',
                html:()=>(
                  <CategoryView 
                    items={view.items} name={view.name} type={view.type} cart={cart} campaign={view.campaign}
                    onClick={(o)=>this.changeView({type:'product',product:o})}
                  />
                )
              },
              {
                flex:1,show:view.type === 'shipping',
                html:()=>(<Shipping items={view.items}/>)
              },
              {
                flex: 1,show:view.type === "product",
                html: ()=>(
                  <Product
                    product={view.product}
                    onClose={() => this.changeView({type:"main"})}
                    changeCart={(cart) => SetState({ cart })}
                  />
                ),
              },
              {
                show:view.type === 'cart',flex: 1,
                html:()=>(
                  <Cart cart={cart} onChange={(cart)=>SetState({cart})} onContinue={(items)=>{
                    this.changeView({type:'shipping',items})
                  }}/>
                )
              },
            ],
          }}
        />
      </>
    );
  }
}
class Product extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    let { product } = this.props;
    let firstVariant = product.inStock?product.variants.filter((o) => o.inStock === null?false:!!o.inStock)[0]:undefined;
    this.state = {
      optionValues: firstVariant?{ ...firstVariant.optionValues }:undefined,
      selectedVariant: firstVariant,srcIndex:0
    };
  }
  getVariantBySelected(selected) {
    let { product } = this.props;
    for (let i = 0; i < product.variants.length; i++) {
      let variant = product.variants[i];
      let { optionValues } = variant;
      let isMatch = true;
      for (let prop in selected) {
        if (selected[prop] !== optionValues[prop]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return variant;
      }
    }
    return false;
  }
  changeOptionType(key, value) {
    let { optionValues } = this.state;
    let newSelected = { ...optionValues, [key]: value };
    let variant = this.getVariantBySelected(newSelected);
    this.setState({
      optionValues: newSelected,
      selectedVariant: variant
    });
  }
  optionTypesLayout(optionTypes) {
    let { optionValues } = this.state;
    if(!optionValues || !optionTypes){return {html:''}}
    return {
      className: "box gap-no-color",
      column: [
        {
          column: optionTypes.map(({ name, id, items = [] }) => {
            return {
              column: [
                { size: 12 },
                {html: name,align: "v",className: "size14 color605E5C padding-0-12"},
                { size: 6 },
                {
                  className: "padding-0-12",scroll:'h',gap: 12,
                  row: items.map((item) => {
                    let active = optionValues[id] === item.id,style;
                    if (active) {style = {border: "2px solid #0094D4",color: "#fff",background: "#0094D4",borderRadius: 6};} 
                    else {style = {border: "2px solid #999",color: "#605E5C",borderRadius: 6}}
                    return {html: item.name,align: "vh",className: "size14 padding-3-12",style,attrs: {onClick: () => this.changeOptionType(id, item.id),}};
                  }),
                },
              ],
            };
          }),
        },
        { size: 12 },
      ],
    };
  }
  detailsLayout(details) {
    return {
      className: "box",
      style: { padding: 12 },
      html: (
        <div
          style={{display: "grid",gridTemplateColumns: "auto auto",gridGap: 1,width: "100%",background: "#DADADA"}}
        >
          {details.map((o,i) => {
            return (
              <Fragment key={i}>
                <div className="size12 color605E5C padding-6-12" style={{ background: "#F4F4F4" }}>{o[0]}</div>
                <div className="size12 color605E5C padding-6-12" style={{ background: "#F4F4F4" }}>{o[1]}</div>
              </Fragment>
            );
          })}
        </div>
      ),
    };
  }
  pictureLayout(name, code, src) {
    let {product} = this.props,{srcIndex} = this.state;
    return {
      size: 346,className: "box",
      column: [
        { size: 24 },
        {
          flex: 1,style:{overflow:'hidden'},
          childsProps: { align: "vh" },
          row: [
            { size: 36, html: getSvg("chevronLeft", { flip: true }) ,style:{opacity:srcIndex === 0?0.5:1}},
            { flex: 1, html: <img src={src} alt="" height="100%" /> },
            { size: 36, html: getSvg("chevronLeft") ,style:{opacity:srcIndex === product?0.5:1} },
          ],
        },
        { size: 12 },
        {size: 36,html: name,className: "size16 color323130 bold padding-0-12"},
        {size: 36,html: "کد کالا : " + (code || ""),className: "size14 color605E5C padding-0-12"},
        { size: 12 },
      ],
    };
  }
  priceLayout(count) {
    let { selectedVariant } = this.state;
    if(!selectedVariant || !selectedVariant.inStock || selectedVariant.inStock === null){
      return { column:[{flex:1},{html:"ناموجود",className: "colorD83B01 bold size14" },{flex:1}]};
    }
    return {
      column: [
        { flex: 1 },
        {
          show:!!selectedVariant.discountPercent,
          row: [
            { flex: 1 },
            { html: selectedVariant.discountPrice, className: "colorA19F9D" },
            { size: 6 },
            {
              html: "%" + selectedVariant.discountPercent,
              style: {background: "#FDB913",color: "#fff",borderRadius: 8,padding: "0 3px"},
            },
          ],
        },
        {
          row: [
            { flex: 1 },
            { html: selectedVariant.price, className: "color323130 bold" },
            { size: 6 },
            { html: "ریال", className: "color323130 bold" },
          ],
        },
        { flex: 1 },
      ],
    };
  }
  getSrcs(){
    let { product } = this.props;
    let { srcs = [] } = product;
    let {selectedVariant,srcIndex = 0} = this.state || {};
    if(selectedVariant && selectedVariant.srcs){
      if(selectedVariant.srcs[srcIndex]){return {srcIndex,src:selectedVariant.srcs[srcIndex]}}
      if(selectedVariant.srcs[0]){return {srcIndex:0,src:selectedVariant.srcs[0]}}
    }
    if(srcs[srcIndex]){return {src:srcs[srcIndex],srcIndex}}
    if(srcs[0]){return {srcIndex:0,src:srcs[0]}}
    return false;
  }
  bodyLayout() {
    let { product } = this.props;
    let { name, code, optionTypes, campaignsPrices, details, srcs } = product;
    let {srcIndex} = this.state;
    return {
      flex: 1,
      scroll: "v",
      gap: 12,
      style: { padding: "12px 0" },
      column: [
        this.pictureLayout(name, code, srcs[srcIndex]),
        this.optionTypesLayout(optionTypes),
        this.detailsLayout(details),
      ],
    };
  }
  changeCart(variantId,count){
    let { product,changeCart } = this.props;
    let {cart} = this.context;
    let {selectedVariant} = this.state;
    let {inStock = 0} = selectedVariant;
    if(inStock === null){inStock = 0}
    if(count > inStock){return;}
    if(count < 0){return}
    let newCart = {
      ...cart,
      [variantId]:{
        ...(cart[variantId] || {}),
        count,product,
        variant:product.variants.filter((o) => o.id === variantId)[0]
      }
    };
    changeCart(newCart);
  }
  getCountByVariant() {
    let { selectedVariant } = this.state;
    if(!selectedVariant){return 0}
    let { cart } = this.context;
    if (!Object.keys(cart).length) {return 0;}
    let obj = cart[selectedVariant.id];
    if (!obj) {return 0;}
    let { count = 0 } = cart[selectedVariant.id];
    return count;
  }
  touchStart(variantId,dir,e){
    this.changeCart(variantId, this.getCountByVariant() + dir)
    $(window).bind('touchend',$.proxy(this.touchEnd,this))
    this.timeout = setTimeout(()=>{
      this.interval = setInterval(()=>{
        this.changeCart(variantId,this.getCountByVariant() + dir)
      },100)
    },500)
    
  }
  touchEnd(){
    $(window).unbind('touchend',this.touchEnd)
    clearTimeout(this.timeout)
    clearInterval(this.interval) 
  }
  addToCartLayout(count) {
    let { selectedVariant } = this.state;
    if(!selectedVariant || !selectedVariant.inStock || selectedVariant.inStock === null){
      return {html:''}
    }
    if (!count) {
      return {
        html: (
          <button
            onClick={() => this.changeCart(selectedVariant.id, 1)}
            className={"button-2" + (!selectedVariant ? " disabled" : "")}
          >
            افزودن به سبد خرید
          </button>
        ),
        align: "v",
      };
    }
    return {
      childsProps: { align: "vh" },
      row: [
        {html: (<div onTouchStart={(e)=>this.touchStart(selectedVariant.id,1,e)} className='product-count-button'>+</div>)},
        { size: 60, html: count },
        {html: ()=>(<div onTouchStart={(e) =>this.touchStart(selectedVariant.id,-1,e)} className='product-count-button'>-</div>),show:count > 1},
        {html: ()=>(<div onClick={(e) =>this.changeCart(selectedVariant.id, this.getCountByVariant() - 1)} className='product-count-button'>-</div>),show:count === 1},
      ],
    };
  }
  footerLayout() {
    let count = this.getCountByVariant();
    return {
      size: 72,style: { background: "#fff" },className: "padding-0-12",
      row: [this.addToCartLayout(count), { flex: 1 }, this.priceLayout(count)],
    };
  }
  render() {
    return (
      <RVD
        layout={{
          className: "popup main-bg",
          column: [this.bodyLayout(), this.footerLayout()],
        }}
      />
    );
  }
}
//props : cart,onChange
class Cart extends Component{
  static contextType = appContext
  constructor(props){
    super(props);
    this.state = {activeTabId:'regular'}
  }
  changeCount(variantId,count){
    let { cart,onChange } = this.props;
    let newCart;
    if(count === 0){
      newCart = {};
      for(let id in cart){
        if(id !== variantId){newCart[id] = cart[id]}
      }
    }
    else{
      newCart = {...cart,[variantId]:{...cart[variantId],count}} 
    }
    onChange(newCart);
  }
  getDetails(variantIds){
      let { activeTabId } = this.state,{ cart } = this.props,tabsDictionary = {},tabs = [];
    let cartItems = variantIds.map((variantId, i) => {
      let { product, count, variant } = cart[variantId];
      let { name, optionTypes,campaign } = product;
      let { price, discountPrice, discountPercent, optionValues } = variant;
      if(!campaign){
        if(!tabsDictionary['regular']){
          tabsDictionary['regular'] = 0;
          tabs.push({title:'خرید عادی',id:'regular',flex:1,badge:()=>tabsDictionary['regular']})
        }
        tabsDictionary['regular'] += count;
      }
      else{
        if(!tabsDictionary[campaign.id]){
          tabsDictionary[campaign.id] = 0;
          tabs.push({title:campaign.name,id:campaign.id,flex:1,badge:()=>tabsDictionary[campaign.id]})
        }
        tabsDictionary[campaign.id] += count;
      }
      let details = [];
      for (let j = 0; j < optionTypes.length; j++) {
        let optionType = optionTypes[j];
        details.push([optionType.name, optionValues[optionType.id]]);
      }
      return {
        name,count,src: functions.getProductSrc(product),price:price * count,details,campaign:product.campaign,
        discountPrice,discountPercent,isFirst: i === 0,isLast: i === variantIds.length - 1,
        changeCount:(count) => this.changeCount(variantId,count)
      };
    });
    if(!tabsDictionary[activeTabId]){activeTabId = tabs[0].id; this.state.activeTabId = activeTabId;}
    let basketTotal = 0;
    let filteredCartItems = cartItems.filter(({campaign,price})=>{
      if(activeTabId === 'regular'){
        if(campaign === undefined){basketTotal += price; return true}
        return false;
      }
      if(campaign && campaign.id === activeTabId){basketTotal += price; return true}
      return false
    });
    return {cartItems,filteredCartItems,basketTotal,activeTabId,tabs}
  }
  render(){
    let { cart } = this.props,variantIds = Object.keys(cart);
    let {cartItems = [],filteredCartItems = [],basketTotal,activeTabId,tabs} = (variantIds.length?this.getDetails(variantIds):{});
    let {onContinue} = this.props;
    return (
      <RVD
        layout={{
          flex: 1,
          column: [
            this.context.layout("tabs", {show:cartItems.length !== 0,tabs,activeTabId,onClick: (obj) => this.setState({ activeTabId: obj.id })}),
            {
              show:filteredCartItems.length !== 0,flex: 1,
              column: filteredCartItems.map((o) => this.context.layout("productCard2", {...o})),
            },
            {show:cartItems.length === 0,flex:1,align:'vh',html:'سبد خرید شما خالی است'},
            {
              size: 72,show:cartItems.length !== 0,className: "main-bg padding-0-12",
              row: [
                {
                  flex: 1,
                  column: [
                    { flex: 1 },
                    {align: "v",html: "مبلغ قابل پرداخت",className: "color5757656 size12"},
                    {align: "v",html: functions.splitPrice(basketTotal) + " ریال",className: "color323130 size16"},
                    { flex: 1 },
                  ],
                },
                {show:cartItems.length !== 0,html: ()=><button onClick={()=>onContinue(filteredCartItems)} className="button-2">ادامه فرایند خرید</button>,align: "v"},
              ],
            },
          ],
        }}
      />
    )
  }
}

class CategorySlider extends Component{
  static contextType = appContext;
  render(){
    let {items = [],title,showAll,onClick = ()=>{}} = this.props;
    if(items.length === 0){return null}
    return (
      <RVD
        layout={{
          className: "box gap-no-color",style: { padding: 12 },scroll:'v',
          column: [
            {
              size:36,
              row:[
                {html:title,className: "size14 color323130 bold",align: "v"},
                {size:6},
                {
                  show:showAll !== undefined,html: "مشاهده همه",className: "size12 color0094D4 bold",align: "v",
                  attrs:{onClick:()=>showAll()}
                },
              ]
            },
            {
              gap: 16,scroll:'h',
              row: items.map((o) =>this.context.layout("productCard", {product:o,onClick:()=>onClick(o)})),
            },
          ],
        }}
      />
    )
  }
}
class CategoryView extends Component{
  static contextType = appContext;
  constructor(props){
    super(props);
    this.state = {searchValue:''}
  }
  render(){
    let {name,type,items,campaign} = this.props;
    return (
      <RVD
        layout={{
          flex: 1,style:{overflow:'hidden'},
          column: [
            {show:type === 'category',size: 36,html: name,align: "vh",className: "color605E5C size14 bold"},
            {
              show:type === 'campaign',
              html:()=><ContentSlider items={[{title:campaign.name,color:campaign.color,background:campaign.background,icon:<img src={campaign.src} alt='' height='100%'/>,}]}/>
            },
            {
              size:36,align:'vh',show:type === 'campaign',html:'معرفی جشنواره',className:'size12 colorA19F9D'
            },
            {
              align:'vh',show:type === 'campaign',
              html:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.',
              className:'size14 color323130 padding-12'
            },
            {
              size:36,align:'v',show:type === 'campaign',html:'کالاهای جشنواره',className:'size16 color323130 bold padding-0-12'
            },
            {
              flex: 1,
              scroll: "v",
              gap: 12,
              column: items.map((o) => {
                let {searchValue} = this.state;
                let {onClick = ()=>{}} = this.props;
                if (searchValue && o.name.indexOf(searchValue) === -1) {return false;}
                return this.context.layout("productCard2", {product:o,onClick:()=>onClick(o)});
              }),
            },
          ],
        }}
      />
    )
  }
}

class Shipping extends Component{
  static contextType = appContext;
  constructor(props){
    super(props);
    this.state = {
      name:'حسین تیموری',
      code:'c42345',
      campaign:'فروش ویژه 10 وات',
      basePrice:'پاییز',
      discountPercent:'الکتریکی',
      address:'ونک - خیابان گاندی - نبش کوچه نوزدهم - بن بست چهارم - پلاک 122 طبقه',
      phone:'09123534314',
      shippingMethod:'0',
      paymentMethod:'0'
    }
  }
  render(){
    let {phone,address,shippingMethod,name,code,campaign,basePrice,discountPercent,paymentMethod} = this.state;
    let {items = []} = this.props;
    return (
      <RVD
        layout={{
          flex:1,scroll:'v',
          column:[
            {
              className:'box padding-12',
              column:[
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'نام مشتری:',className:'colorA19F9D size14'},
                    {html:name,className:'size14'}
                  ]
                },
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'کد مشتری:',className:'colorA19F9D size14'},
                    {html:code,className:'size14'},
                    {flex:1},
                    {html:'درصد تخفیف:',className:'colorA19F9D size14'},
                    {html:discountPercent,className:'size14'},
                  ]
                },
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'نام کمپین:',className:'colorA19F9D size14'},
                    {html:campaign,className:'size14'},
                    {flex:1},
                    {html:'قیمت پایه:',className:'colorA19F9D size14'},
                    {html:basePrice,className:'size14'},
                  ]
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'آدرس تحویل'},
                {
                  className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:address
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'شماره تلفن'},
                {
                  className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:phone
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'نحوه ارسال'},
                {
                  html:(
                    <AIOButton
                      type='radio'
                      value={shippingMethod}
                      options={[
                        {value:'0',text:'ماشین توزیع شرکت بروکس (پیشنهادی)'},
                        {value:'1',text:'ماشین باربری'},
                      ]}
                      onChange={(shippingMethod)=>this.setState({shippingMethod})}
                      optionStyle={{width:'100%'}}

                    />
                  )
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'یادداشت'},
                {
                  className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:''
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'محصولات'},
                {
                  column:items.map((o)=>{
                    return this.context.layout('productCard2',o)
                  })
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {size:36,align:'v',className:'color605E5C size14 bold',html:'نحوه پرداخت'},
                {
                  html:(
                    <AIOButton
                      type='radio'
                      value={paymentMethod}
                      options={[
                        {value:'0',text:'آنلاین'},
                        {value:'1',text:'واریز (کارت به کارت)'},
                      ]}
                      onChange={(paymentMethod)=>this.setState({paymentMethod})}
                      optionStyle={{width:'100%'}}

                    />
                  )
                }
              ]
            },
            {size:12},
            {
              className:'box padding-12',
              column:[
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'قیمت کالاها:',className:'color605E5C size14'},
                    {flex:1},
                    {html:61000 + ' ریال',className:'color605E5C size14'}
                  ]
                },
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'تخفیف:',className:'colorFDB913 size14'},
                    {flex:1},
                    {html:7000 + ' ریال',className:'colorFDB913 size14'}
                  ]
                },
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'تخفیف پرداخت آنلاین:',className:'color00B5A5 size14'},
                    {flex:1},
                    {html:2000 + ' ریال',className:'color00B5A5 size14'}
                  ]
                },
                {
                  size:36,childsProps:{align:'v'},
                  row:[
                    {html:'مبلغ قابل پرداخت:',className:'color323130 bold size16'},
                    {flex:1},
                    {html:5344500 + ' ریال',className:'color323130 bold size16'}
                  ]
                },
              ]
            },
          ]
        }}
      />
    )
  }
}