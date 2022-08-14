import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Header from '../../components/header/header';
import functions from '../../functions';
import appContext from './../../app-context';
export default class Shipping extends Component{
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
    details_layout(){
      let {name,code,campaign,basePrice,discountPercent} = this.state;
      return {
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
      }
    }
    address_layout(){
      let {address} = this.state;
      return {
        className:'box padding-12',
        column:[
          {size:36,align:'v',className:'color605E5C size14 bold',html:'آدرس تحویل'},
          {
            className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:address
          }
        ]
      }
    }
    phone_layout(){
      let {phone} = this.state;
      return {
        className:'box padding-12',
        column:[
          {size:36,align:'v',className:'color605E5C size14 bold',html:'شماره تلفن'},
          {
            className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:phone
          }
        ]
      }
    }
    products_layout(){
      let {shipping} = this.context;
      let {cards} = shipping;
      return {
        className:'box padding-12',
        column:[
          {size:36,align:'v',className:'color605E5C size14 bold',html:'محصولات'},
          {column:cards.map((card)=>{return {html:card}})}
        ]
      }
    }
    amount_layout(){
      let {shipping} = this.context;
      let {total,totalDiscount} = shipping;
      return {
        className:'box padding-12',
        column:[
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'قیمت کالاها:',className:'color605E5C size14'},
              {flex:1},
              {html:functions.splitPrice(total + totalDiscount) + ' ریال',className:'color605E5C size14'}
            ]
          },
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'تخفیف:',className:'colorFDB913 size14'},
              {flex:1},
              {html:functions.splitPrice(totalDiscount) + ' ریال',className:'colorFDB913 size14'}
            ]
          },
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'تخفیف پرداخت آنلاین:',className:'color00B5A5 size14'},
              {flex:1},
              {html:0 + ' ریال',className:'color00B5A5 size14'}
            ]
          },
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'مبلغ قابل پرداخت:',className:'color323130 bold size16'},
              {flex:1},
              {html:functions.splitPrice(total) + ' ریال',className:'color323130 bold size16'}
            ]
          },
        ]
      }
    }
    header_layout(){
      let {SetState} = this.context;
      return {html:<Header title='ادامه فرایند خرید' onClose={()=>SetState({shippingZIndex:0})}/>}
    }
    render(){
      let {phone,address,shippingMethod,name,code,campaign,basePrice,discountPercent,paymentMethod} = this.state;
      let {shipping,shippingZIndex,SetState} = this.context;
      let {cartItems,cards} = shipping;
      debugger;
      return (
        <RVD
          layout={{
            className:'bgFFF fixed',
            style:{zIndex:shippingZIndex},
            flex:1,scroll:'v',
            column:[
              this.header_layout(),
              {
                flex:1, scroll:'v',column:[
                  this.details_layout(),
                  {size:12},
                  this.address_layout(),
                  {size:12},
                  this.phone_layout(),
                  {size:12},
                  // {
                  //   className:'box padding-12',
                  //   column:[
                  //     {size:36,align:'v',className:'color605E5C size14 bold',html:'یادداشت'},
                  //     {
                  //       className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:''
                  //     }
                  //   ]
                  // },
                  // {size:12},
                  this.products_layout(),
                  {size:12},
                  this.amount_layout(),
                  {size:12},
                  {
                    className:'box padding-12',
                    column:[
                      {size:36,align:'vh',className:'color605E5C size14 bold',html:<button className="button-2" onClick={async ()=>{
                        let {services,cart}=this.context;
                        let res = await services({type:"sendToVisitor"})
                        if(res){
                          debugger;
                          for(let i = 0; i < cartItems.length; i++){
                            let {variant} = cartItems[i];
                            let newCart = {};
                            for(let prop in cart){
                              if(prop !== variant.id){
                                newCart[prop] = cart[prop]
                              }
                            }
                            SetState({cart:newCart,shippingZIndex:0})
                          }
                        }
                      }}>ارسال برای ویزیتور</button>},
                      
                    ]
                  },
                ]
              }
            ]
          }}
        />
      )
    }
  }