import React, { Component } from "react";
import RVD from "./../../../npm/react-virtual-dom/react-virtual-dom";
import appContext from "./../../../app-context";
import functions from "./../../../functions";
export default class OrderPopup extends Component {
    static contextType = appContext;
    state = {details:{}}
    getRow(key, value,show = true) {
      if(!show){return false}
      return {
        align: "v",
        row: [
          { size: 110, html: key + " : ", className: "size12 colorA19F9D" },
          { flex: 1, html: value, className: "size12" },
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
      let {kharidApis} = this.context;
      let {order} = this.props;
      let details = await kharidApis({type:'orderProducts',parameter:order})
      this.setState({details})
    }
    async pardakht(){
      let {kharidApis} = this.context;
      let {order} = this.props;
      let res = await kharidApis({type:'pardakhte_kharid',parameter:{order}})
    }
    details_layout(){
      let {userInfo} = this.context;
      let {order} = this.props;
      let {details = {}} = this.state;
      return {
        className: "box gap-no-color margin-0-12 padding-12",gap: 12,
        column: [
          this.getRow("پیش فاکتور", order.mainDocNum),
          this.getRow("تاریخ ثبت", order.date),
          { size: 12 },
          this.getRow("نام مشتری",details.customerName + " - " + details.customerCode),
          this.getRow("گروه مشتری", userInfo.groupName),
          this.getRow("نام کمپین", details.campaignName),
          this.getRow("قیمت پایه", functions.splitPrice(details.basePrice)),
          this.getRow("نام ویزیتور", details.visitorName),
          { size: 12 },
          this.getRow("آدرس", details.address),
          this.getRow("تلفن همراه", details.mobile),
          this.getRow("تلفن ثابت", details.phone),
          { size: 12 },
          this.getRow("نحوه ارسال", details.nahve_ersal),
          this.getRow("نحوه پرداخت", details.nahve_pardakht),
          this.getRow("مهلت تسویه", details.mohlate_tasvie,!!details.mohlate_tasvie),
          this.getRow("مبلغ پرداختی کل", functions.splitPrice(order.total) + ' ریال')
        ],
      }
    }
    dokmeye_pardakht_layout(){
      let {order} = this.props;
      let {docStatus} = order;
      let {details = {}} = this.state;
      let {nahve_pardakht} = details;
      if(docStatus !== 'WaitingForPayment' || nahve_pardakht !== 'اینترنتی'){return false}
      return {
        className:'padding-12',
        html:(<button className="button-2" onClick={()=>this.pardakht()}>پرداخت</button>)
      }
    }
    products_layout(){
      let {details = {}} = this.state;
      let {products = []} = details;
      return {
        gap: 2,className:'margin-0-12',
        column: products.map((o, i) => {
          return (
            <ProductCard
              isFirst={i === 0} isLast={i === products.length - 1}
              price={o.price} details={o.details}
              discountPrice={o.discountPrice} discountPercent={o.discountPercent}
              campaign={o.campaign} src={o.src} count={o.count}
            />
          )
        })
      }
    }
    render() {
      return (
        <RVD
          layout={{
            className: "main-bg",
            column: [
              {
                flex: 1,scroll: "v",gap: 12,
                column: [
                  this.details_layout(),
                  this.products_layout(),
                ],
              },
              this.dokmeye_pardakht_layout()
            ],
          }}
        />
      );
    }
  }

  class ProductCard extends Component{
    getStyle(){
      let {isFirst,isLast} = this.props;
      return {
        padding:6,
        borderBottomLeftRadius:!isLast?0:undefined,
        borderBottomRightRadius:!isLast?0:undefined,
        borderTopLeftRadius:!isFirst?0:undefined,
        borderTopRightRadius:!isFirst?0:undefined
      }
    }
    image_layout(){
      let {src} = this.props;
      return {flex:1,html:<img src={src} width={'100%'} alt=''/>}
    }
    count_layout(){
      let {count} = this.props;
      return {size:24,count}
    }
    campaign_layout(){
      let {campaign} = this.props;
      if(!campaign){return false}
      return {html:campaign.name,className:'size10',style:{color:'rgb(253, 185, 19)'}}
    }
    name_layout(){
      let {name} = this.props;
      return {html:name,className:'size14 color575756 bold'}
    }
    details_layout(){
      let {details = []} = this.props;
      if(!details.length){return false}
      return {
        column:details.map((d)=>{
            return {size:20,align:'v',html:`${d[0]} : ${d[1]}`,className:'size10 colorA19F9D'}
        })
      }
    }
    discount_layout(){
      let {discountPercent,discountPrice} = this.props;
      if(!discountPercent){return false}
      return {
        gap:4,
        row:[
            {flex:1},
            {html:functions.splitPrice(discountPrice),className:'size14 colorA19F9D',align:'v'},
            {html:<div style={{background:'#FFD335',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{discountPercent + '%'}</div>,align:'v'},
        ]  
      }
    }
    price_layout(){
      let {price} = this.props;
      return {
        row:[
            {flex:1},
            {html:functions.splitPrice(price) + ' ریال',className:'size12 color404040 bold',align:'v'}
        ]
      }
    }
    render(){
      return (
        <RVD
          layout={{
            className:'box gap-no-color',gap:12,style:this.getStyle(),
            row:[
              {
                size:96,
                column:[
                    this.image_layout(),
                    this.count_layout()
                ]
              },
              {
                  flex:1,gap:6,
                  column:[
                      this.campaign_layout(),
                      this.name_layout(),
                      {flex:1},
                      this.details_layout(),
                      this.discount_layout(),
                      this.price_layout()
                  ]
              }
            ] 
          }}
        />
      )
    }
  }

  