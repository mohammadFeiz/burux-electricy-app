import React, { Component, Fragment } from "react";
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import Cart from "../../coponents/cart/cart";
import Product from "../../coponents/product/product";
import src1 from "./../../utils/brx66.png";
import Tabs from "../../coponents/tabs/tabs";
import "./index.css";
import ContentSlider from "../../coponents/content-slider";
import CategorySlider from "../../coponents/category-slider/category-slider";
import SearchBox from "../../coponents/search-box/index";
import PageHeader from "../../coponents/page-header/page-header";

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
  tabs(){
    let {view,tabs,activeTabId} = this.state;
    return {
      flex: 1,style:{overflow:'hidden'},show:view.type === 'main',
      column: [
        {html:<Tabs tabs={tabs} activeTabId={activeTabId} onChange={(activeTabId)=>this.setState({activeTabId})}/>},
        this['tab' + activeTabId]()
      ],
    }
  }
  tab1(){
    return {
      flex: 1,scroll: "v",className:'buy-tab-1',gap: 12,
      column: [this.campaign(),this.pish_sefareshat_layout(),this.families(),this.sliders()]
    }
  }
  tab2(){
    let {SetState} = this.context;
    let {categories} = this.state;
    return {
      flex: 1,className:'box gap-no-color padding-12',scroll:'v',gap: 24,childsProps:{flex:1},
      column:categories.map((o)=>{
        return {
          attrs:{onClick:()=>SetState({categoryZIndex:10,category:{type:'category',products:o.products,name:o.name}})},
          column:[
            {size:200,html:<img src={o.src} alt='' width='100%'/>},
            {size:36,align:'vh',html:o.name,className:'color323130 size16 bold'}
          ] 
        }
      })
    };
  }
  campaign(){
    let {SetState} = this.context;
    let {campaigns} = this.state;
    return {
      html:()=>(
        <ContentSlider 
          items={
            campaigns.map((campaign)=>{
              let {color,background,name,src} = campaign;
              return {
                title:name,color,background,icon:<img src={src} alt='' height='100%'/>,
                button:{
                  text:'خرید',
                  onClick:async (campaign)=>SetState({categoryZIndex:10,category:{type:'campaign',products:await this.getCampaignItems(campaign),name:campaign.name,campaign}})}
              }
            })
          }
        />
      )
    }
  }
  pish_sefareshat_layout(){
    return {
      className: "box gap-no-color",style: { padding: 12 },
      column: [
        {html: "پیش سفارشات",className: "size14 color323130 bold",size: 36,align: "v"},
        {gap: 12,size: 120,row: [this.pish_sefaresh_layout('visitorWait'),this.pish_sefaresh_layout('paymentWait')]}
      ],
    }
  }
  pish_sefaresh_layout(){
    let {SetState} = this.context,{preOrders} = this.state;
    let title,number,peygiriyeSefaresheKharid_tab;
    if(type === 'visitorWait'){
      title = "در انتظار تایید ویزیتور";
      number = preOrders.waitOfVisitor;
      peygiriyeSefaresheKharid_tab = 'SalesApproved';
    }
    if(type === 'paymentWait'){
      title = "در انتظار پرداخت";
      number = preOrders.waitOfPey;
      peygiriyeSefaresheKharid_tab = 'Invoiced';
    }
    return {
      attrs:{
        onClick:()=>{
          SetState({
            activeBottomMenu:'a',peygiriyeSefaresheKharid_tab,
            popup:{mode:'peygiriye-sefareshe-kharid',onBack:()=>SetState({activeBottomMenu:'b',popup:{}})},
          })
        }
      },
      style: {borderRadius: 12 },flex: 1,className:'bgFAFAFA theme-1-light-bg',
      column: [
        {html: title,align: "vh",size: 48,className: "size14 color605E5C bold"},
        { html: <div className='number-view'>{number}</div>, align: "vh", flex: 1,className:'theme-1-colorFFF' },
      ]
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
            let config = {...o,src: undefined,onClick: async () => this.changeView({type:"category",name:o.name,items:this.getActiveFamilyItems(o.id)})};
            return layout("productCard", config);
          }),
        },
      ],
    }
  }
  sliders(){
    let {SetState} = this.context;
    let sliders = [['bestSellings','پر فروش ترین محصولات'],['lastOrders','آخرین سفارشات شما'],['recommendeds','پیشنهاد سفارش']]
    return {
      gap:12,
      column:sliders.map(([key,name])=>{
        return {
          html:()=>(
            <CategorySlider 
              title={name} products={this.state[key]} 
              showAll={async ()=>this.changeView({type:'category',items:await this['get_' + key](),name})}
              onClick={(product)=>SetState({product,productZIndex:10})}
            />
          )
        }
      })
    }
  }
  render() {
    let {SetState} = this.context;
    return (
      <RVD layout={{
        flex: 1,className: "buy-page main-bg",style: { width: "100%" },
        column: [
          {html:<PageHeader title='خرید کالا' buttons={{cart:true}}/>},
          {html:<SearchBox onClick={()=>SetState({searchZIndex:10})}/>},
          this.tabs()
        ]
      }}/>
    )
  }
}

