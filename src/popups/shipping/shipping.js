import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
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
    render(){
      let {phone,address,shippingMethod,name,code,campaign,basePrice,discountPercent,paymentMethod} = this.state;
      let {shipping} = this.context;
      let {cartItems,cards} = shipping;
      return (
        <RVD
          layout={{
            className:'bgFFF fixed',
            flex:1,scroll:'v',
            column:[
              {
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
              },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {size:36,align:'v',className:'color605E5C size14 bold',html:'آدرس تحویل'},
                  {
                    className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:address
                  }
                ]
              },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {size:36,align:'v',className:'color605E5C size14 bold',html:'شماره تلفن'},
                  {
                    className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:phone
                  }
                ]
              },
              //{size:12},
              // {
              //   className:'box padding-12',
              //   column:[
              //     {size:36,align:'v',className:'color605E5C size14 bold',html:'نحوه ارسال'},
              //     {
              //       html:(
              //         <AIOButton
              //           type='radio'
              //           value={shippingMethod}
              //           options={[
              //             {value:'0',text:'ماشین توزیع شرکت بروکس (پیشنهادی)'},
              //             {value:'1',text:'ماشین باربری'},
              //           ]}
              //           onChange={(shippingMethod)=>this.setState({shippingMethod})}
              //           optionStyle={{width:'100%'}}
  
              //         />
              //       )
              //     }
              //   ]
              // },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {size:36,align:'v',className:'color605E5C size14 bold',html:'یادداشت'},
                  {
                    className:'size14 color575756 bgF1F1F1 padding-12 round-6',html:''
                  }
                ]
              },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {size:36,align:'v',className:'color605E5C size14 bold',html:'محصولات'},
                  {column:cards.map((card)=>{return {html:card}})}
                ]
              },
              // {size:12},
              // {
              //   className:'box padding-12',
              //   column:[
              //     {size:36,align:'v',className:'color605E5C size14 bold',html:'نحوه پرداخت'},
              //     {
              //       html:(
              //         <AIOButton
              //           type='radio'
              //           value={paymentMethod}
              //           options={[
              //             {value:'0',text:'آنلاین'},
              //             {value:'1',text:'واریز (کارت به کارت)'},
              //           ]}
              //           onChange={(paymentMethod)=>this.setState({paymentMethod})}
              //           optionStyle={{width:'100%'}}
  
              //         />
              //       )
              //     }
              //   ]
              // },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {
                    size:36,childsProps:{align:'v'},
                    row:[
                      {html:'قیمت کالاها:',className:'color605E5C size14'},
                      {flex:1},
                      {html:61000 + ' ریال',className:'color605E5C size14'}
                    ]
                  },
                  {
                    size:36,childsProps:{align:'v'},
                    row:[
                      {html:'تخفیف:',className:'colorFDB913 size14'},
                      {flex:1},
                      {html:7000 + ' ریال',className:'colorFDB913 size14'}
                    ]
                  },
                  {
                    size:36,childsProps:{align:'v'},
                    row:[
                      {html:'تخفیف پرداخت آنلاین:',className:'color00B5A5 size14'},
                      {flex:1},
                      {html:2000 + ' ریال',className:'color00B5A5 size14'}
                    ]
                  },
                  {
                    size:36,childsProps:{align:'v'},
                    row:[
                      {html:'مبلغ قابل پرداخت:',className:'color323130 bold size16'},
                      {flex:1},
                      {html:5344500 + ' ریال',className:'color323130 bold size16'}
                    ]
                  },
                ]
              },
              {size:12},
              {
                className:'box padding-12',
                column:[
                  {size:36,align:'vh',className:'color605E5C size14 bold',html:<button className="button-2" onClick={()=>{
                    let {services}=this.context;
                    let res=services({type:"sendToVisitor"})
                  }}>ارسال برای ویزیتور</button>},
                  
                ]
              },
            ]
          }}
        />
      )
    }
  }