import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Header from '../../components/header/header';
import functions from '../../functions';
import Popup from '../../components/popup/popup';
import AIOButton from 'aio-button';
import appContext from './../../app-context';
export default class Shipping extends Component{
    static contextType = appContext;
    constructor(props){
      super(props);
      this.state = {
        name:'',
        code:'',
        campaign:'فروش ویژه 10 وات',
        basePrice:'',
        customerGroup:'الکتریکی',
        address:'',
        phone:'09123534314',
        orderNumber:false,
        PayDueDate:'ByDelivery',
        PayDueDate_options:[
          {value:'ByDelivery',text:'نقد'},
          {value:'By15Days',text:'چک 15 روزه'},
          {value:'ByMonth',text:'چک 30 روزه'},
          {value:'By45Days',text:'چک 45 روزه'},
          {value:'By60Days',text:'چک 60 روزه'},
        ],
        PaymentTime:'ByOnlineOrder',
        PaymentTime_options:[
          {value:'ByOnlineOrder',text:'اینترنتی'},
          {value:'ByOrder',text:'واریز قبل ارسال'},
          {value:'ByDelivery',text:'واریز پای بار'},
        ],
        SettleType:'ByDelivery',
        SettleType_options:[
          {value:'ByDelivery',text:'نقد'},
          {value:'Cheque',text:'چک'},

        ],
        DeliveryType:'BRXDistribution',
        DeliveryType_options:[
          {value:'BRXDistribution',text:'ماشین توزیع بروکس'},
          {value:'RentalCar',text:'ماشین اجاره ای'},
          {value:'Cargo',text:'باربری'},
          {value:'HotDelivery',text:'پخش گرم'},
          {value:'BySalesMan',text:'ارسال توسط ویزیتور'}
        ]
      }
    }
    details_layout(){
      let {name,code,campaign,basePrice,customerGroup} = this.state;
      return {
        className:'box padding-12 margin-0-12',
        column:[
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'نام مشتری:',className:'colorA19F9D size14'},
              {html:name,className:'size14'},
              {flex:1},
              {html:'نام کمپین:',className:'colorA19F9D size14'},
              {html:campaign,className:'size14'}
            ]
          },
          {
            size:36,childsProps:{align:'v'},
            row:[
              {html:'کد مشتری:',className:'colorA19F9D size14'},
              {html:code,className:'size14'},
              {flex:1},
              {html:'گروه مشتری:',className:'colorA19F9D size14'},
              {html:customerGroup,className:'size14'},
            ]
          },
          
        ]
      }
    }
    async componentDidMount(){
      let {userInfo,shipping} = this.context;
      this.setState({
        campaign:shipping.title,
        name:userInfo.cardName,
        code:userInfo.cardCode,
        address:userInfo.address,
        phone:userInfo.phone1,
        customerGroup:userInfo.groupName
      })
    }
    address_layout(){
      let {address} = this.state;
      return {
        className:'box padding-12 margin-0-12',
        column:[
          {size:36,align:'v',className:'color605E5C size12 bold',html:'آدرس تحویل'},
          {
            className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:address,size:72
          }
        ]
      }
    }

    options_layout(key,title,cond = true){
      let options = this.state[key + '_options']
      let value = this.state[key];
      if(!cond){return false}
      return {
        className:'box padding-12 margin-0-12',
        column:[
          {size:36,align:'v',className:'color605E5C size12 bold',html:title},
          {
            html:(
              <AIOButton
                type='radio'
                optionStyle='{width:"100%"}'
                options={options}
                value={value}
                onChange={(newValue)=>this.setState({[key]:newValue})}
              />
            )
          }
        ]
      }
    }
    phone_layout(){
      let {phone} = this.state;
      return {
        className:'box padding-12 margin-0-12',
        column:[
          {size:36,align:'v',className:'color605E5C size12 bold',html:'شماره تلفن'},
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
        className:'box padding-12 margin-0-12',
        styke:{overflow:'visible'},
        column:[
          {size:36,align:'v',className:'color605E5C size14 bold',html:'محصولات'},
          {
            style:{overflow:'visible'},column:cards.map((card)=>{return {html:card,style:{overflow:'visible'}}})}
        ]
      }
    }
    amount_layout(){
      let {shipping} = this.context;
      let {totalDiscount,factorDetails} = shipping;
      let total = factorDetails.MarketingLines[0].PriceAfterVat;
      total = total - (total * factorDetails.marketingdetails.DocumentDiscountPercent / 100)
      
      return {
        className:'padding-0-12 bgFFF',
        style:{paddingTop:12,borderRadius:'16px 16px 0 0'},
        column:[
          {
            size:28,childsProps:{align:'v'},
            row:[
              {html:'قیمت کالاها:',className:'color605E5C size14'},
              {flex:1},
              {html:functions.splitPrice(total + totalDiscount) + ' ریال',className:'color605E5C size14'}
            ]
          },
          {
            size:28,childsProps:{align:'v'},
            row:[
              {html:'تخفیف:',className:'colorFDB913 size14'},
              {flex:1},
              {html:functions.splitPrice(totalDiscount) + ' ریال',className:'colorFDB913 size14'}
            ]
          },
          {
            size:28,childsProps:{align:'v'},
            row:[
              {html:'تخفیف پرداخت آنلاین:',className:'color00B5A5 size14'},
              {flex:1},
              {html:0 + ' ریال',className:'color00B5A5 size14'}
            ]
          },
          {
            size:28,childsProps:{align:'v'},
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
      let {shipping,SetState,kharidApis,cart,getFactorDetails,userCardCode,b1Info} = this.context;
      let {address,SettleType,PaymentTime,DeliveryType,PayDueDate} = this.state;
      let {cartItems} = shipping;
      return {
        className:'padding-12',
        column:[
          {size:36,align:'vh',className:'color605E5C size14 bold',html:<button className="button-2" onClick={async ()=>{
            let factorDetails = getFactorDetails(cartItems.map((o)=>{
              return { ItemCode: o.variant.code, ItemQty: o.count }
            }))
            let body = {
              "marketdoc":{
                "CardCode":userCardCode,
                "CardGroupCode": b1Info.customer.groupCode,
                "MarketingLines":cartItems.map((o)=>{
                  return { ItemCode: o.variant.code, ItemQty: o.count }
                }),
                "DeliverAddress":address,
                "marketingdetails":{
                  SettleType,
                  PaymentTime,
                  DeliveryType,
                  PayDueDate
                }
              }
            }
            let res = await kharidApis({type:"sendToVisitor",parameter:body})
            if(res){
              let variantIds = cartItems.map((o)=>o.variant.id)
              let newCart = {};
              for(let prop in cart){
                if(variantIds.indexOf(prop) === -1){
                  newCart[prop] = cart[prop]
                }
              }
              SetState({cart:newCart,cartZIndex:0,categoryZIndex:0,productZIndex:0})
              this.setState({orderNumber:res})
            }
          }}>ارسال برای ویزیتور</button>},
          
        ]
      }
    }
    render(){
      let {orderNumber,PaymentTime} = this.state;
      let {shippingZIndex} = this.context;
      return (
        <>
          <RVD
          layout={{
            className:'main-bg fixed',
            style:{zIndex:shippingZIndex},
            flex:1,
            column:[
              this.header_layout(),
              {
                flex:1,scroll:'v',
                column:[
                  this.details_layout(),
                  {size:12},
                  this.address_layout(),
                  {size:12},
                  this.phone_layout(),
                  {size:12},
                  this.options_layout('DeliveryType','نحوه ارسال'),
                  {size:12},
                  this.options_layout('PaymentTime','زمان پرداخت',),
                  {size:12},
                  this.options_layout('PayDueDate','مهلت تسویه',PaymentTime !== 'ByOnlineOrder'),
                  {size:12},
                  this.products_layout(),
                  {size:12},
                ],
              },
              this.amount_layout(),
              this.sendToVisitor_layout()
            ]
          }}
        />
        {orderNumber !== false && (
          <Popup style={{zIndex:10000}}><SendToVisitor orderNumber={orderNumber}/></Popup>
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
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M97.1429 80C106.611 80 114.286 87.6751 114.286 97.1429C114.286 106.611 106.611 114.286 97.1429 114.286C87.6751 114.286 80 106.611 80 97.1429C80 87.6751 87.6751 80 97.1429 80ZM95.7186 88.5714C94.9297 88.5714 94.2901 89.211 94.2901 90V98.5714C94.2901 99.3604 94.9297 100 95.7186 100H101.429C102.218 100 102.857 99.3604 102.857 98.5714C102.857 97.7824 102.218 97.1429 101.429 97.1429H97.1472V90C97.1472 89.211 96.5076 88.5714 95.7186 88.5714Z" fill="#D83B01"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M79.8538 39.9116L30.2667 18.6696L14.7115 24.6524C13.1672 25.2464 11.8096 26.1566 10.7011 27.2923L60 48.4204L79.8538 39.9116ZM51.923 10.3403L40.3027 14.8096L89.375 35.8311L109.299 27.2923C108.19 26.1566 106.833 25.2464 105.289 24.6524L68.077 10.3403C62.878 8.34067 57.122 8.34067 51.923 10.3403ZM63.75 54.973L112.451 34.1011C112.483 34.4482 112.5 34.799 112.5 35.1525V80.213C108.442 76.5299 103.055 74.2856 97.1429 74.2856C84.5192 74.2856 74.2857 84.5191 74.2857 97.1427C74.2857 100.479 75.0005 103.648 76.2852 106.506L68.077 109.663C66.6682 110.205 65.2185 110.6 63.75 110.848V54.973ZM56.25 54.973V110.848C54.7815 110.6 53.3318 110.205 51.923 109.663L14.7115 95.3507C10.3668 93.6797 7.5 89.5055 7.5 84.8506V35.1525C7.5 34.799 7.51654 34.4482 7.549 34.1011L56.25 54.973Z" fill="url(#paint0_linear_2815_14543)"/>
          <defs>
          <linearGradient id="paint0_linear_2815_14543" x1="60" y1="8.84058" x2="60" y2="110.848" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECC798"/>
          <stop offset="1" stopColor="#D6AE7B"/>
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
          {html:'مشاهده درخواست',className:'color0094D4 size14 bold',attrs:{
            onClick:()=>{
              let {SetState} = this.context;
              SetState({ordersHistoryZIndex:10,shippingZIndex:0})
            }
          }}
        ]
      }
    }
    backButton_layout(){
      let {SetState} = this.context;
      return {html:<button className='button-2' onClick={()=>SetState({shippingZIndex:0})}>بازگشت به خانه</button>,className:'padding-12'}
    }
    render(){
      return (
        <RVD
          layout={{
            style:{width:'100%',height:'100%'},
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