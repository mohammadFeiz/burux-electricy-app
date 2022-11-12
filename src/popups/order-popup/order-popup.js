import React, { Component } from "react";
import RVD from "react-virtual-dom";
import appContext from "../../app-context";
import Header from './../../components/header/header';
import functions from "../../functions";
export default class OrderPopup extends Component {
    static contextType = appContext;
    state = {details:{}}
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
    async componentDidMount(){
      await this.getDetails()  
    }
    async getDetails(){
      let {kharidApis,order} = this.context;
      let details = await kharidApis({type:'orderProducts',parameter:order})
      this.setState({details})
    }
    render() {
      let { theme,order,SetState,userInfo } = this.context;
      let {details} = this.state;
      let {
        customerName,customerCode,campaignName,basePrice,visitorName,address,mobile,
        phone,paymentMethod,products = []
      } = details;
      let {mainDocNum,date,total} = order;
      return (
        <div className={"popup-container" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "popup main-bg",
              column: [
                {
                  html:<Header title='جزيیات سفارش خرید' onClose={()=>SetState({orderZIndex:0})}/>
                },
                {
                  flex: 1,scroll: "v",gap: 12,
                  column: [
                    {
                      className: "box gap-no-color margin-0-12",
                      style: { padding: 12 },
                      gap: 12,
                      column: [
                        this.getRow("پیش فاکتور", mainDocNum),
                        this.getRow("تاریخ ثبت", date),
                        { size: 12 },
                        this.getRow(
                          "نام مشتری",
                          customerName + " - " + customerCode
                        ),
                        this.getRow("گروه مشتری", userInfo.groupName),
                        this.getRow("نام کمپین", campaignName),
                        this.getRow("قیمت پایه", functions.splitPrice(basePrice)),
                        this.getRow("نام ویزیتور", visitorName),
                        { size: 12 },
                        this.getRow("آدرس", address),
                        this.getRow("تلفن همراه", mobile),
                        this.getRow("تلفن ثابت", phone),
                        { size: 12 },
                        this.getRow("مبلغ پرداختی کل", functions.splitPrice(total)),
                        this.getRow("نحوه پرداخت", paymentMethod),
                      ],
                    },
                    //this.getStatus(order.status),
                    {
                      gap: 2,
                      column: products.map((o, i) => {
                        return this.context.layout("productCard2", {...o,isFirst: i === 0,isLast: i === products.length - 1})
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
  