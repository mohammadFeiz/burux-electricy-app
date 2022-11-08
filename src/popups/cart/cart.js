import React,{Component,createRef} from 'react';
import appContext from './../../app-context';
import RVD from 'react-virtual-dom';
import Tabs from './../../components/tabs/tabs';
import ProductCard from './../../components/product-card/product-card';
import Header from './../../components/header/header';
import noItemSrc from './../../images/not-found.png';
import $ from 'jquery';
//props : cart,changeCount
export default class Cart extends Component{
    static contextType = appContext;
    constructor(props){
      super(props);
      this.dom = createRef();
      this.state = {activeTabId:'regular'}
    }
    componentDidMount(){
      $(this.dom.current).animate({
          height: '100%',
          width: '100%',
          left:'0%',
          top:'0%',
          opacity:1
      }, 300);
    }
    splitPrice(price){
      if(!price){return price}
      let str = price.toString(),dotIndex = str.indexOf('.');
      if(dotIndex !== -1){str = str.slice(0,dotIndex)}
      let res = '',index = 0;
      for(let i = str.length - 1; i >= 0; i--){
          res = str[i] + res;
          if(index === 2){index = 0; if(i > 0){res = ',' + res;}}
          else{index++}
      }
      return res
    }
    getDetails(){
      let { cart,changeCart,cartZIndex,fixPrice,getFactorDetails } = this.context,tabsDictionary = {};
      let variantIds = Object.keys(cart);
      for(let i = 0; i < variantIds.length; i++){
        let variantId = variantIds[i];
        let { product } = cart[variantId];
        let { campaign } = product;
        let tabId,tabTitle;
        if(campaign){tabId = campaign.id; tabTitle = campaign.name}
        else{tabId = 'regular'; tabTitle = 'خرید عادی'}
        tabsDictionary[tabId] = tabsDictionary[tabId] || {id:tabId,title:tabTitle,cards:[],total:0,cartItems:[],totalDiscount:0,flex:1};
        tabsDictionary[tabId].cartItems.push(cart[variantId])
        tabsDictionary[tabId].badge++;
      }
      this.tabs = [];
      for(let tabId in tabsDictionary){
        let tab = tabsDictionary[tabId]
        let fixedItems = fixPrice(tab.cartItems.map(({product,count})=>{
          let itemCode = product.defaultVariant.code;
          return {itemCode,itemQty:count} 
        }),'سبد خرید')
        tab.cartItems = tab.cartItems.map((o,i)=>{
          return {...o,product:{...o.product,...fixedItems[i]}}
        })
        tab.badge = tab.cartItems.length;
        tab.cards = tab.cartItems.map(({product,count,variant},i)=>{
          let { optionTypes,campaign } = product;
          let { optionValues } = variant;
          tab.total += count * product.FinalPrice;
          tab.totalDiscount += count * (product.Price - product.FinalPrice)
          let details = [];
          for (let j = 0; j < optionTypes.length; j++) {
            let optionType = optionTypes[j];
            details.push([optionType.name, optionType.items[optionValues[optionType.id]]]);
          }
          let props = {
            product,details,count,type:'horizontal',
            title:campaign?campaign.name:undefined,//2
            isFirst:i === 0,isLast: i === tabsDictionary[tabId].cartItems.length - 1,
            parentZIndex:cartZIndex,
            changeCount:(count) => changeCart(count,variant.id)
          }
          return <ProductCard {...props} showIsInCart={false}/>
        })
        tab.factorDetails =  getFactorDetails(tab.cartItems.map((o)=>{
          return { ItemCode: o.variant.code, ItemQty: o.count }
        }))
        this.tabs.push(tab);
      }
      if(tabsDictionary[this.state.activeTabId]){
        this.tab = tabsDictionary[this.state.activeTabId];
      }
      else{
        if(this.tabs[0]){
          this.state.activeTabId = this.tabs[0].id;
          this.tab = this.tabs[0]
        }
        else{
          this.tab = undefined;
          this.state.activeTabId = undefined;
        }
      }
    }
    onClose(){
      let {SetState} = this.context;
      $(this.dom.current).animate({
        height: '0%',
        width: '0%',
        left:'50%',
        top:'100%',
        opacity:0
      }, 300,()=>SetState({cartZIndex:0}));
      
    }
    header_layout(){
        let {SetState,cartZIndex} = this.context;
        return {html:<Header zIndex={cartZIndex} onClose={()=>this.onClose()} title='سبد خرید'/>}
    }
    tabs_layout(){
      if(!this.tabs.length){return false}
      return {html:<Tabs tabs={this.tabs} activeTabId={this.state.activeTabId} onChange={(activeTabId)=>this.setState({activeTabId})}/>}
    }
    products_layout(){
      if(this.tab){
        return {flex: 1,scroll:'v',column: this.tab.cards.map((card) => {return {html:card}})}
      }
      return {
        style:{background:'#eee',opacity:0.5},
        flex:1,align:'vh',
        column:[
            {html:<img src={noItemSrc} alt='' width='128' height='128'/>},
            {html:'سبد خرید شما خالی است',style:{color:'#858a95'}},
            {size:60}
        ]
      }
    }
    payment_layout(){
      if(!this.tab){return false}
      debugger;
      let {SetState,cartZIndex} = this.context;
      return {
        size: 72,className: "main-bg padding-0-12",
        row: [
          {
            flex: 1,
            column: [
              { flex: 1 },
              {align: "v",html: "مبلغ قابل پرداخت",className: "color5757656 size12"},
              {align: "v",html: this.splitPrice(this.tab.total) + " ریال",className: "color323130 size16"},
              { flex: 1 },
            ],
          },
          {html: <button onClick={()=>this.continue()} className="button-2">ادامه فرایند خرید</button>,align: "v"},
        ],
      }
    }
    continue(){
      let {SetState,cartZIndex} = this.context;
      SetState({shipping:{...this.tab},shippingZIndex:cartZIndex * 10})
    }
    render(){
        let {cartZIndex:zIndex} = this.context;
        this.getDetails();
        return (
            <RVD 
              layout={{
                style:{zIndex,left:'50%',top:'100%',height:'0%',width:'0%',opacity:0},
                attrs:{ref:this.dom},
                flex: 1,className:'main-bg fixed',
                column: [this.header_layout(),this.tabs_layout(),{size:12},this.products_layout(),this.payment_layout()]
              }}
            />
        )
    }
  }
  