import React,{Component} from 'react';
import appContext from './../../app-context';
import RVD from 'react-virtual-dom';
import Tabs from './../../components/tabs/tabs';
import ProductCard from './../../components/product-card/product-card';
import Header from './../../components/header/header';
//props : cart,changeCount
export default class Cart extends Component{
    static contextType = appContext;
    constructor(props){
      super(props);
      this.state = {activeTabId:'regular'}
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
      let { cart,changeCart,cartZIndex } = this.context,tabsDictionary = {};
      let variantIds = Object.keys(cart);
      for(let i = 0; i < variantIds.length; i++){
        let variantId = variantIds[i];
        let { product, count, variant } = cart[variantId];
        let { optionTypes,campaign } = product;
        let { price,optionValues,discountPrice } = variant;
        let tabId,tabTitle;
        if(campaign){tabId = campaign.id; tabTitle = campaign.name}
        else{tabId = 'regular'; tabTitle = 'خرید عادی'}
        tabsDictionary[tabId] = tabsDictionary[tabId] || {id:tabId,title:tabTitle,cards:[],total:0,cartItems:[],totalDiscount:0};
        let details = [];
        for (let j = 0; j < optionTypes.length; j++) {
          let optionType = optionTypes[j];
          details.push([optionType.name, optionType.items[optionValues[optionType.id]]]);
        }
        let props = {
          product,details,count,type:'horizontal',
          title:product.campaign?product.campaign.name:undefined,//2
          isFirst:i === 0,isLast: i === variantIds.length - 1,
          parentZIndex:cartZIndex,
          changeCount:(count) => changeCart(count,variantId)
        }
        tabsDictionary[tabId].cards.push(<ProductCard {...props} showIsInCart={false}/>)
        tabsDictionary[tabId].cartItems.push(cart[variantId])
        tabsDictionary[tabId].badge++;
        tabsDictionary[tabId].total += price * count;
        tabsDictionary[tabId].totalDiscount += discountPrice * count;
      }
      this.tabs = Object.keys(tabsDictionary).map((tabId)=>{
        let {id,title,cartItems} = tabsDictionary[tabId]; 
        return {id,title,badge:cartItems.length,flex:1}
      })
      if(tabsDictionary[this.state.activeTabId]){
        this.tab = tabsDictionary[this.state.activeTabId];
      }
      else{
        if(this.tabs[0]){
          this.state.activeTabId = this.tabs[0].id;
          this.tab = tabsDictionary[this.tabs[0].id]
        }
        else{
          this.tab = undefined;
          this.state.activeTabId = undefined;
        }
      }
    }
    header_layout(){
        let {SetState,cartZIndex} = this.context;
        return {html:<Header zIndex={cartZIndex} onClose={()=>SetState({cartZIndex:0})} title='سبد خرید'/>}
    }
    tabs_layout(){
      if(!this.tabs.length){return false}
      return {html:<Tabs tabs={this.tabs} activeTabId={this.state.activeTabId} onChange={(activeTabId)=>this.setState({activeTabId})}/>}
    }
    products_layout(){
      if(this.tab){
        return {flex: 1,scroll:'v',column: this.tab.cards.map((card) => {return {html:card}})}
      }
      return {flex:1,align:'vh',html:'سبد خرید شما خالی است'}
    }
    payment_layout(){
      if(!this.tab){return false}
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
      debugger;
      SetState({shipping:{...this.tab},shippingZIndex:cartZIndex * 10})
    }
    render(){
        let {cartZIndex:zIndex} = this.context;
        this.getDetails();
        return (
            <RVD 
              layout={{
                style:{zIndex},flex: 1,className:'main-bg fixed',
                column: [this.header_layout(),this.tabs_layout(),this.products_layout(),this.payment_layout()]
              }}
            />
        )
    }
  }
  