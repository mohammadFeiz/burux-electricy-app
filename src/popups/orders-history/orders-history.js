import React, { Component } from "react";
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import Header from "../../components/header/header";
import Tabs from "../../components/tabs/tabs";
export default class OrdersHistory extends Component {
    static contextType = appContext;
    constructor(props) {
      super(props);
      this.state = {activeTabId:false,tabs:[]};
    }
    async componentDidMount() {
      let {services} = this.context;
      let {tabs,orders}= await services({type:"ordersHistory"});
      let tabsDic = {}
      for(let i = 0; i < orders.length; i++){
        let order = orders[i];
        let {tabId} = order;
        tabsDic[tabId] = tabsDic[tabId] || [];
        tabsDic[tabId].push(order)
      }
      let Tabs = [];
      for(let i = 0; i < tabs.length; i++){
        let {name,id} = tabs[i];
        let tabOrders = tabsDic[id] || [];
        Tabs.push({title:name,id,orders:tabOrders,badge:tabOrders.length})
      }
      this.setState({tabs:Tabs,activeTabId:Tabs[0].id});
    }
    header_layout(){
      let { SetState} = this.context;
      return {html:<Header title="پیگیری سفارش خرید" onClose={()=>SetState({ordersHistoryZIndex:0})}/>}
    }
    tabs_layout() {
      let {tabs,activeTabId} = this.state;
      return {
        html:(
          <Tabs tabs={tabs} activeTabId={activeTabId} onChange={(activeTabId)=>{
            this.setState({activeTabId})
          }}/>
        )
      }
    }
    async getDetails(o){
      let { SetState,services } = this.context;
      let res = await services({type:"joziatepeygiriyesefareshekharid", parameter:o});
      SetState({popup: {mode: "joziate-sefareshe-kharid",order: res}})
    }
    orders_layout(){
      let { activeTabId,tabs } = this.state;
      if(activeTabId === false){return []}
      let tab = tabs.filter(({id})=>id === activeTabId)[0];
      let orders = tab.orders;
      if(!orders.length){
        return {
          flex:1,html:'سفارشی موجود نیست',className:'size16 color605E5C bold',align:'vh'
        }
      }
      return {
        flex: 1,gap: 12,scroll:'v',
        column: orders.map((o) => {
          return {html: (<OrderCard order={o}/>)};
        })
      }
    }
    render() {
      let { theme } = this.context;
      return (
        <div className={"popup-container" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "popup main-bg",
              column: [
                this.header_layout(),
                this.tabs_layout(),
                { size: 12 },
                this.orders_layout()
              ],
            }}
          />
        </div>
      );
    }
  }

  class OrderCard extends Component {
    static contextType = appContext;
    unit = 'تومان';
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
    header_layout(){
      let {order} = this.props;
      let { code, date} = order;
      return {
        align: "v",size: 36,
        row: [
          { html: "پیش سفارش:", className: "colorA19F9D size12" },
          { size: 4 },
          { html: code, className: "color605E5C size14" },
          { flex: 1 },
          { html: date, className: "colorA19F9D size12" },
        ],
      }
    }
    body_layout(){
      let {order} = this.props;
      let { products = []} = order;
      if(!products.length){return {size:40}}
      products = [...products]
      let plus = 0;
      let showCount = 4
      if(products.length > showCount){
        plus = products.length - showCount;
        products = products.slice(0,showCount)
      }
      return {
        size: 40,
        style: { whiteSpcae: "nowrap", flexWrap: "nowrap" },
        gap:6,
        row:[
          {
            gap:6,
            row:products.map((o)=>{
              return {
                html:<img src={o.src} width={36} height={36} alt='' style={{border:'1px solid #eee'}}/>
              }
            })
          },
          {show:plus !== 0,html:<div style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',color:'#bbb'}}>{plus + '+'}</div>}
        ]
      }
    }
    footer_layout(){
      let {order} = this.props;
      let { total} = order;
      return {
        size: 36,childsProps: { align: "v" },
        row: [
          { flex: 1 },
          { html: this.splitPrice(total), className: "size14 color323130" },
          { size: 6 },
          { html: this.unit, className: "size12 color605E5C" },
        ],
      }
    }
    render() {
      let {SetState} = this.context;
      return (
        <RVD
          layout={{
            className: "box gap-no-color margin-0-12",
            style: { padding: 12 },
            attrs:{onClick:()=>{
              let {order} = this.props;
              SetState({order,orderZIndex:100})
            }},
            column: [
              this.header_layout(),
              //this.body_layout(),
              this.footer_layout(),
            ],
          }}
        />
      );
    }
  }