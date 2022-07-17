import React, { Component } from "react";
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import Header from "../../components/header/header";
export default class PeygiriyeSefaresheKharid extends Component {
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
      let { tab,tabs } = this.state;
      let { SetState,theme } = this.context;
      let orders = tabs[tab] || [];
      return (
        <div className={"popup-container" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "popup main-bg",
              column: [
                {html:<Header title="پیگیری سفارش خرید" onClose={()=>SetState({peygiriyeSefaresheKharidZIndex:0})}/>},
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