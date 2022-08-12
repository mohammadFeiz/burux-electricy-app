import React, { Component, Fragment } from "react";
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import src1 from "./../../utils/brx66.png";
import Tabs from "../../components/tabs/tabs";
import ContentSlider from "../../components/content-slider";
import CategorySlider from "../../components/category-slider/category-slider";
import SearchBox from "../../components/search-box/index";
import Header from "../../components/header/header";
import FamilyCard from './../../components/family-card/family-card';
import "./index.css";
import Billboard from "../../components/billboard/billboard";

export default class Buy extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    let {view = {type:"main"}} = this.props;
    this.state = {
      searchValue: "",
      view, //main,category,product
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
  async get_recommendeds() {
    let {services} = this.context;
    let recommendeds = await services({type:'recommendeds',cache:660});
    this.setState({ recommendeds });
  }
  async get_lastOrders() {
    let {services} = this.context;
    let lastOrders = await services({type:"lastOrders",cache:660});
    this.setState({ lastOrders });
  }
  async get_bestSellings() {
    let {services} = this.context;
    let bestSellings = await services({type:'bestSellings',cache:660});
    this.setState({ bestSellings });
  }
  //dont set async for parallel data fetching
  componentDidMount() {
    this.get_lastOrders(10);
    this.getFamilies();
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
      column: [
        this.billboard_layout(),
        //this.families(),
        this.sliders()
      ]
    }
  }
  tab2(){
    let {SetState} = this.context;
    let {categories} = this.state;
    return {
      flex: 1,className:'box gap-no-color padding-12',scroll:'v',gap: 24,childsProps:{flex:1},
      column:categories.map((o)=>{
        return {
          attrs:{onClick:()=>SetState({categoryZIndex:10,category:{products:o.products,name:o.name}})},
          column:[
            {size:200,html:<img src={o.src} alt='' height='100%'/>,align:'vh'},
            {size:36,align:'vh',html:o.name,className:'color323130 size16 bold'}
          ] 
        }
      })
    };
  }
  billboard_layout(){
    return {html:<Billboard/>}
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
            return {html:<FamilyCard title={o.name} src={o.src} id={o.id}/>}
          }),
        },
      ],
    }
  }
  sliders(){
    let {SetState} = this.context;
    let sliders = [['bestSellings','پر فروش ترین محصولات'],['lastOrders','آخرین سفارشات شما'],['recommendeds','پیشنهاد سفارش']]
    return {
      gap:12,className:'margin-0-12',
      column:sliders.map(([key,name])=>{
        let products = this.state[key] || [];
        if(!products.length){return false}
        return {
          html:()=>(
            <CategorySlider 
              title={name} products={this.state[key]} 
              showAll={()=>{
                SetState({categoryZIndex:10,category:{products,name}})
              }}
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
          {html:<Header zIndex={1} title='خرید کالا' buttons={{cart:true,sidemenu:true}}/>},
          {html:<SearchBox onClick={()=>SetState({searchZIndex:10})}/>},
          this.tabs()
        ]
      }}/>
    )
  }
}

