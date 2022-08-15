import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Header from '../../components/header/header';
import functions from '../../functions';
import Popup from '../../components/popup/popup';
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
        paymentMethod:'0',
        orderNumber:false
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
    sendToVisitor_layout(){
      let {shipping,SetState,services,cart} = this.context;
      let {cartItems} = shipping;
      return {
        className:'box padding-12',
        column:[
          {size:36,align:'vh',className:'color605E5C size14 bold',html:<button className="button-2" onClick={async ()=>{
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
                SetState({cart:newCart,cartZIndex:0,categoryZIndex:0,productZIndex:0})
                this.setState({orderNumber:res})
              }
            }
          }}>ارسال برای ویزیتور</button>},
          
        ]
      }
    }
    render(){
      let {orderNumber} = this.state;
      let {shippingZIndex} = this.context;
      return (
        <>
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
                  this.products_layout(),
                  {size:12},
                  this.amount_layout(),
                  {size:12},
                  this.sendToVisitor_layout()
                ]
              }
            ]
          }}
        />
        {orderNumber !== false && (
          <Popup style={{zIndex:10000}}><SendToVisitor/></Popup>
        )}
        </>
      )
    }
  }

  class SendToVisitor extends Component{
    static contextType = appContext
    header_layout(){
      let {SetState} = this.context;
      return {html:<Header onClose={()=>SetState({shippingZIndex:0})}/>}
    }
    icon_layout(){
      return {
        align:'vh',
        html:(
          <svg width="106" height="103" viewBox="0 0 106 103" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M72.8538 31.9116L23.2667 10.6696L7.71149 16.6524C6.16718 17.2464 4.80959 18.1566 3.70109 19.2923L53 40.4204L72.8538 31.9116ZM44.923 2.3403L33.3027 6.80964L82.375 27.8311L102.299 19.2923C101.19 18.1566 99.8328 17.2464 98.2885 16.6524L61.077 2.3403C55.878 0.340667 50.122 0.340669 44.923 2.3403ZM56.75 46.973L105.451 26.1011C105.483 26.4482 105.5 26.799 105.5 27.1525V72.213C101.442 68.5299 96.0546 66.2856 90.1429 66.2856C77.5192 66.2856 67.2857 76.5191 67.2857 89.1427C67.2857 92.479 68.0005 95.6483 69.2852 98.5058L61.077 101.663C59.6682 102.205 58.2185 102.6 56.75 102.848V46.973ZM49.25 46.973V102.848C47.7815 102.6 46.3318 102.205 44.923 101.663L7.71149 87.3507C3.36683 85.6797 0.5 81.5055 0.5 76.8506V27.1525C0.5 26.799 0.516537 26.4482 0.549003 26.1011L49.25 46.973Z" fill="url(#paint0_linear_2815_14545)"/>
            <defs>
            <linearGradient id="paint0_linear_2815_14545" x1="53" y1="0.840576" x2="53" y2="102.848" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ECC798"/>
            <stop offset="1" stop-color="#D6AE7B"/>
            </linearGradient>
            </defs>
          </svg>
        )
      }
    }
    text_layout(){
      return {
        className:'color107C10 size20 bold',
        html:'درخواست خرید برای ویزیتور ارسال شد',
        align:'vh'
      }
    }
    subtext_layout(){
      return {
        className:'size14 color605E5C padding-0-24',
        html:'بزودی ویزیتور کالاهای شما را فاکتور میکند ویزیتور در تمامی مسیر با شما در ارتباط خواهد بود',
        align:'vh'
      }
    }
    footer_layout(){
      let {orderNumber} = this.props;
      return {
        size:48,align:'v',className:'padding-0-24',
        row:[
          {html:'شماره درخواست:',className:'color605#5C size12'},
          {html:orderNumber,className:'color605E5C size12 bold'},
          {flex:1},
          {html:'مشاهده درخواست',className:'color0094D4 size14 bold'}
        ]
      }
    }
    backButton_layout(){
      let {SetState} = this.context;
      return {html:<button className='button-2' onClick={()=>SetState({shippingZIndex:0})}>بازگشت به خانه</button>,className:'padding-12'}
    }
    render(){
        let {sendToVisitorZIndex:zIndex} = this.context;
      return (
        <RVD
          layout={{
            style:{zIndex,width:'100%',height:'100%'},
            className:'main-bg',
            column:[
              this.header_layout(),
              {size:36},
              this.icon_layout(),
              {size:36},
              this.text_layout(),
              {size:24},
              this.subtext_layout(),
              {flex:1},
              this.footer_layout(),
              this.backButton_layout()
            ]
          }}
        />
      )
    }
  }