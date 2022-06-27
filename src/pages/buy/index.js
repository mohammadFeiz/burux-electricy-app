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
import ProductCount from "../../coponents/product-count/index";
import ContentSlider from "../../coponents/content-slider";
import SearchBox from "../../coponents/search-box/index";

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
    let {services} = this.context;
    let campaigns = await services({type:"getCampaigns"});
    this.setState({ campaigns});
  }
  async getCampaignItems(campaign){
    let {services} = this.context;
    return await services({type:"activeCampaignItems",parameter:{campaign}})
  }
  async getPreOrders() {
    let {services} = this.context;
    let preOrders = await services({type:"preOrders"});
    this.setState({ preOrders });
  }
  async getCategories() {
    let {services} = this.context;
    let categories = await services({type:"getCategories",cache:500});
    this.setState({ categories });
  }
  async getFamilies() {
    let {services} = this.context;
    let families = await services({type:'families'});
    this.setState({ families });
  }
  async get_recommendeds(count) {
    let {services} = this.context;
    let recommendeds = await services({type:'recommendeds',parameter:{count}});
    if(count){this.setState({ recommendeds });}
    else {return recommendeds}
  }
  async get_lastOrders(count) {
    let {services} = this.context;
    let lastOrders = await services({type:"lastOrders",parameter:{count}});
    this.setState({ lastOrders });
    if(count){this.setState({ lastOrders });}
    else {return lastOrders}
  }
  async get_bestSellings(count) {
    let {services} = this.context;
    let bestSellings = await services({type:'bestSellings',parameter:{count}});
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
    this.get_lastOrders(10);
    this.getFamilies();
    this.getPreOrders();
    this.get_recommendeds(10);
    this.get_bestSellings(10);
    this.getCategories();
    this.context.SetState({buy_view:undefined})//reset temporary state
  }
  header(){
    return {
      className: "header",size: 60,childsProps: { align: "vh" },
      row: [this.header_sidemenuButton(),this.header_backButton(),this.header_title(),{ flex: 1 },this.header_cartButton(),{ size: 16 }]
    }
  }
  header_sidemenuButton(){
    let {view} = this.state,{SetState} = this.context;
    return {size: 60,html: getSvg(22),attrs: { onClick: () => SetState({ sidemenuOpen: true }) },show: view.type === "main"}
  }
  header_backButton(){
    let {view} = this.state;
    return {size: 60,html: getSvg("chevronLeft", { flip: true }),attrs: { onClick: () => view.onBack?view.onBack():this.changeView('back')},show: view.type !== "main"}
  }
  header_title(){
    let {view} = this.state;
    return {html: {main: "خرید کالا",category: "خرید کالا",campaign: "خرید کالا",product: "خرید کالا",cart: "سبد خرید"}[view.type],className: "size16 color605E5C"}
  }
  header_cartButton(){
    let {cart} = this.context,{view} = this.state;
    let badge = Object.keys(cart).length;
    return {
      show:view.type !== 'cart',
      html: ()=>(
        <AIOButton
          type="button" style={{ background: "none" }} text={getSvg(45)} badge={badge ? badge : undefined}
          badgeAttrs={{ className: "badge-1" }} onClick={() => this.changeView({type:"cart"})}
        />
      ),
    }
  }
  search(){
    let {view} = this.state,{services} = this.context;
    return {show:view.type === 'main' || view.type === 'search',html:()=><SearchBox onChange={async (value)=>{
      if(!value){this.changeView({type:'main'}); return;}
      let res = await services({type:'buy_search',parameter:{value}})
      if(res.length){
        this.changeView({type:'search',items:res,title:value})
      }
      else {this.changeView('back')}
    }}/>}
  }
  tabs(){
    let {view,tabs,activeTabId} = this.state,{layout} = this.context;
    return {
      flex: 1,style:{overflow:'hidden'},show:view.type === 'main',
      column: [
        layout("tabs", {tabs,activeTabId,onClick: (obj) => this.setState({ activeTabId: obj.id })}),
        activeTabId === "1" ? this.tab1() : this.tab2(),
      ],
    }
  }
  tab1(){
    return {
      flex: 1,scroll: "v",className:'buy-tab-1',gap: 12,
      column: [this.campaign(),this.preOrders(),this.families(),this.sliders()]
    }
  }
  tab2(){
    let {categories} = this.state;
    return {
      flex: 1,className:'box gap-no-color padding-12',scroll:'v',gap: 24,childsProps:{flex:1},
      column:categories.map((o)=>{
        return {
          attrs:{onClick:()=>this.changeView({type:'category',items:o.items,name:o.name})},
          column:[
            {size:200,html:<img src={catLamp} alt='' width='100%'/>},
            {size:36,align:'vh',html:o.name,className:'color323130 size16 bold'}
          ] 
        }
      })
    };
  }
  campaign(){
    let {campaigns} = this.state;
    return {
      html:()=>(
        <CampaignSlider campaigns={campaigns} 
          onClick={async (campaign)=>this.changeView({type:'campaign',items:await this.getCampaignItems(campaign),name:campaign.name,campaign})}
        />
      )
    }
  }
  preOrders(){
    return {
      className: "box gap-no-color",style: { padding: 12 },
      column: [
        {html: "پیش سفارشات",className: "size14 color323130 bold",size: 36,align: "v"},
        {gap: 12,size: 120,row: [this.preOrders_visitorWait(),this.preOrders_paymentWait()]}
      ],
    }
  }
  preOrders_visitorWait(){
    let {SetState} = this.context,{preOrders} = this.state;
    return {
      attrs:{
        onClick:()=>{
          SetState({
            activeBottomMenu:'a',
            popup:{mode:'peygiriye-sefareshe-kharid',onBack:()=>SetState({activeBottomMenu:'b',popup:{}})},
            peygiriyeSefaresheKharid_tab:'visitorWait'
          })
        }
      },
      style: { background: "#fafafa", borderRadius: 12 },flex: 1,
      column: [
        {html: "در انتظار تایید ویزیتور",align: "vh",size: 48,className: "size14 color605E5C bold"},
        { html: preOrders.waitOfVisitor, align: "vh", flex: 1 },
      ],
    }
  }
  preOrders_paymentWait(){
    let {SetState} = this.context,{preOrders} = this.state;
    return {
      attrs:{
        onClick:()=>{
          SetState({
            activeBottomMenu:'a',
            popup:{mode:'peygiriye-sefareshe-kharid',onBack:()=>SetState({activeBottomMenu:'b',popup:{}})},
            peygiriyeSefaresheKharid_tab:'factored'
          })
        }
      },
      style: { background: "#fafafa", borderRadius: 12 },flex: 1,
      column: [
        {html: "در انتظار پرداخت",align: "vh",size: 48,className: "size14 color605E5C bold"},
        { html: preOrders.waitOfPey, align: "vh", flex: 1 },
      ],
    }
  }
  families(){
    let {families} = this.state,{layout} = this.context;
    return {
      className: "box gap-no-color",style: { padding: 12 },show: families.length !== 0,
      column: [
        {html: "محبوب ترین خانواده ها",className: "size14 color323130 bold",size: 36,align: "v"},
        {
          gap: 16,scroll:'h',
          row: families.map((o) => {
            let config = {...o,src: src1,onClick: async () => this.changeView({type:"category",name:o.name,items:this.getActiveFamilyItems(o.id)})};
            return layout("productCard", config);
          }),
        },
      ],
    }
  }
  sliders(){
    let sliders = [['bestSellings','پر فروش ترین محصولات'],['lastOrders','آخرین سفارشات شما'],['recommendeds','پیشنهاد سفارش']]
    return {
      gap:12,
      column:sliders.map(([key,name])=>{
        return {
          html:()=>(
            <CategorySlider 
              title={name} items={this.state[key]} 
              showAll={async ()=>this.changeView({type:'category',items:await this['get_' + key](),name})}
              onClick={(product)=>this.changeView({type:'product',product})}
            />
          )
        }
      })
    }
  }
  category(){
    let {view} = this.state,{cart} = this.context;
    return {
      flex:1,show:view.type === "category" || view.type === 'campaign' || view.type === 'search',
      html:()=>(
        <CategoryView 
          items={view.items} name={view.name} type={view.type} cart={cart} campaign={view.campaign}
          onClick={(o)=>this.changeView({type:'product',product:o})}
        />
      )
    }
  }
  shipping(){
    let {view} = this.state;
    return {flex:1,show:view.type === 'shipping',html:()=>(<Shipping items={view.items}/>)}
  }
  product(){
    let {view} = this.state,{SetState} = this.context;
    return {
      flex: 1,show:view.type === "product",
      html: ()=>(<Product product={view.product} onClose={() => this.changeView({type:"main"})} changeCart={(cart) => SetState({ cart })}/>),
    }
  }
  cart(){
    let {view} = this.state,{SetState,cart} = this.context;
    return {
      show:view.type === 'cart',flex: 1,
      html:()=>(<Cart cart={cart} onChange={(cart)=>SetState({cart})} onContinue={(items)=>this.changeView({type:'shipping',items})}/>)
    }
  }
  render() {
    return (
      <RVD layout={{
        flex: 1,className: "buy-page main-bg",style: { width: "100%" },
        column: [this.header(),this.search(),this.tabs(),this.category(),this.shipping(),this.product(),this.cart()]
      }}/>
    )
  }
}
class CampaignSlider extends Component{
  render(){
    let {campaigns,onClick} = this.props;
    return (
      <ContentSlider 
        items={
          campaigns.map((o)=>{
            let {color,background,name,src} = o;
            return {
              title:name,color,background,icon:<img src={src} alt='' height='100%'/>,
              button:{text:'خرید',onClick:()=>onClick(o)}
            }
          })
        }
      />
    )
  }
}
class Product extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    this.getVariants()
    let { product } = this.props;
    let firstVariant = product.inStock?product.variants.filter((o) => o.inStock === null?false:!!o.inStock)[0]:undefined;
    this.state = {
      optionValues: firstVariant?{ ...firstVariant.optionValues }:undefined,showDetails:true,
      selectedVariant: firstVariant,srcIndex:0
    };
  }
  getVariants(){
    let { product } = this.props;
    let {variants,optionTypes} = product;
    let optionTypesDict = {}
    let optionValuesDict = {}
    for(let i = 0; i < optionTypes.length; i++){
      let o = optionTypes[i];
      optionTypesDict[o.id] = o.name;
      for(let j = 0; j < o.items.length; j++){
        let m = o.items[j];
        optionValuesDict[m.id] = m.name;
      }
    }
    let res = [];
    for(let i = 0; i < variants.length; i++){
      let {optionValues,inStock,id} = variants[i];
      if(!inStock || inStock === null){continue}
      let str = [];
      for(let prop in optionValues){
        str.push(optionTypesDict[prop] + ' : ' + optionValuesDict[optionValues[prop]])
      }
      str = str.join(' -- ')
      res.push({text:str,value:id,variant:variants[i]})
    }
    this.options = res;
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
  changeOptionType(obj) {
    let { optionValues } = this.state;
    let newSelected = { ...optionValues,...obj};
    let variant = this.getVariantBySelected(newSelected);
    this.setState({
      optionValues: newSelected,
      selectedVariant: variant
    });
  }
  optionTypesLayout(optionTypes) {
    let { optionValues,selectedVariant } = this.state;
    if(!optionValues || !optionTypes){return {html:''}}
    return {
      className: "box gap-no-color",
      column: [
        {
          column: optionTypes.map(({ name, id, items = [] },i) => {
            return {
              column: [
                { size: 12 },
                {size:36,html: name,align: "v",className: "size14 color605E5C padding-0-12"},
                { size: 6 },
                {
                  className: "padding-0-12",scroll:'h',gap: 12,
                  row: items.map((item) => {
                    let active = optionValues[id] === item.id,style;
                    let className = 'size14 padding-3-12 product-option-value';
                    if (active) {className += ' active';} 
                    return {html: item.name,align: "vh",className,style,attrs: {onClick: () => this.changeOptionType({[id]:item.id}),}};
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
    let {showDetails} = this.state;
    return {
      className: "box",
      style: { padding: 12 },
      column:[
        {
          size:36,childsProps:{align:'v'},
          attrs:{onClick:(()=>this.setState({showDetails:!showDetails}))},
          row:[
            {size:24,align:'vh',html:getSvg('chevronLeft',{width:12,height:12,rotate:showDetails?-90:0})},
            {html: 'مشخصات',className: "size14 color605E5C"}
          ]
        },
        {
          show:!!showDetails,
          html: ()=>(
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
          )
        }
      ]
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
        this.optionsLayout(),
        this.optionTypesLayout(optionTypes),
        this.detailsLayout(details),
      ],
    };
  }
  optionsLayout(){
    let {product} = this.props;
    if(product.optionTypes.length < 2){return false}
    return {
      className:'box',
      column:[
        {
          align:'v',className:'padding-12',
          html:(
            <AIOButton
              type='select' className='product-exist-options main-bg'
              popupAttrs={{style:{maxHeight:400}}}
              options={this.options}
              popupWidth='fit'
              text='انتخاب اقلام موجود'
              optionStyle='{height:28,fontSize:12}'
              onChange={(value,obj)=>{
                this.changeOptionType(obj.option.variant.optionValues)
              }}
            />
          )
        }
      ]

    }
  }
  getInStock(){
    let {selectedVariant} = this.state;
    let {inStock = 0} = selectedVariant;
    if(inStock === null){inStock = 0}
    return inStock;
  }
  changeCart(count){
    let { product,changeCart } = this.props;
    let {cart} = this.context;
    let {selectedVariant} = this.state;
    let {id} = selectedVariant;
    let newCart;
    if(count === 0){
        let res = {};
        for(let prop in cart){
          if(prop.toString() !== id.toString()){res[prop] = cart[prop]}
        }
        newCart = res;
    }
    else{
      newCart = {...cart,[id]:{...(cart[id] || {}),count,product,variant:product.variants.filter((o) => o.id === id)[0]}};
    }
    
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
            onClick={() => this.changeCart(1)}
            className={"button-2" + (!selectedVariant ? " disabled" : "")}
          >
            افزودن به سبد خرید
          </button>
        ),
        align: "v",
      };
    }
    return {size:96,html:()=><ProductCount value={count} onChange={this.changeCart.bind(this)} max={this.getInStock()}/>}
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
          flex: 1,scroll: "v",
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
              size:36,align:'v',show:type === 'campaign',html:'کالاهای جشنواره',className:'size16 color323130 bold padding-0-12'
            },
            {
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