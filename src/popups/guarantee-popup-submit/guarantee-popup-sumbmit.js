import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "./../../utils/getSvg";
import appContext from "./../../app-context";
import Table from "./../../components/aio-table/aio-table";
export default class GuaranteePopupSubmit extends Component {
    static contextType = appContext;
    constructor(props) {
      super(props);
      this.state = {
        items: [],
      };
    }
    async onSubmit(){
      let {services,SetState} = this.context;
      let {items} = this.state;
      let res = await services({type:"sabte_kalahaye_garanti", parameter:items});
      if (res) {
        let guaranteeItems = await services({type:"kalahaye_garanti_shode"});
        SetState({
          guaranteeItems,
          guaranteePopupSuccessText:"درخواست گارانتی شما با موفقیت ثبت شد",
          guaranteePopupSuccessZIndex:10,
          guaranteePopupSubmitZIndex:0
        });
      } 
      else {
        SetState({
          guaranteePopupSuccessText:"خطا",
          guaranteePopupSuccessZIndex:10,
          guaranteePopupSubmitZIndex:0
        });
      }
    }
    render() {
      let { items } = this.state;
      let { getHeaderLayout, guaranteeExistItems,theme,SetState } = this.context;
      return (
        <div className={"popup-container" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "popup main-bg",
              column: [
                getHeaderLayout("ثبت درخواست گارانتی جدید", () => SetState({guaranteePopupSubmitZIndex:0})),
                { size: 12 },
                {
                  className: "box",
                  style: { padding: 12 },
                  column: [
                    {
                      row: [
                        {html: "تاریخ مراجعه ویزیتور : ",className: "size16 color605E5C"},
                        {html: "تا 72 ساعت آینده",className: "size16 color605E5C"}
                      ]
                    },
                    { size: 12 },
                    {
                      row: [
                        { size: 16, html: getSvg(42), align: "vh" },
                        { size: 6 },
                        {
                          flex: 1,className: "size12 color00B5A5 bold",
                          html: "ویزیتور جهت ثبت کالاهای گارانتی در تاریخ ذکر شده به فروشگاه شما مراجعه میکند"
                        }
                      ],
                    },
                  ],
                },
                { size: 12 },
                {
                  className: "box",style: { padding: 12 },
                  column: [
                    {html: "کالاهای گارانتی",className: "size16 color605E5C"},
                    { size: 12 },
                    {
                      row: [
                        { size: 16, html: getSvg(42), align: "vh" },
                        { size: 6 },
                        {
                          flex: 1,className: "size12 color00B5A5 bold",
                          html: "با ثبت کالاهای درخواستی برای گارانتی، درخواست شما در اولویت قرار میگیرد."
                        }
                      ]
                    }
                  ]
                },
                { size: 12 },
                {
                  flex: 1,
                  html: (
                    <Table
                      paging={false}
                      columns={[
                        {
                          title: "",
                          width: 36,
                          cellAttrs:(row)=>{
                            return {
                              onClick:()=>{
                                let {items} = this.state;
                                this.setState({items:items.filter((o)=>row.Code !== o.Code)})
                              }
                            }
                          },
                          template: (row) => {
                            return 'X'
                              
                          },
                        },
                        { title: "عنوان", getValue: (row) => row.Name },
                        {
                          title: "تعداد",
                          getValue: (row) => row.Qty,
                          width: 70,
                          inlineEdit: {
                            type: "number",
                            onChange: (row, value) => {
                              let { items } = this.state;
                              row.Qty = value;
                              this.setState({ items });
                            },
                          },
                        },
                      ]}
                      model={items}
                      toolbarItems={[
                        {
                          type: "select",
                          text: "افزودن کالا",
                          caret: false,
                          className:'button-1',
                          popupAttrs: { style:{maxHeight: 400 ,bottom:0,top:'unset',position:'fixed',left:0,width:'100%'}},
                          optionText:'option.Name',
                          optionValue:'option.Code',
                          options: guaranteeExistItems,
                          onChange: (value, obj) => {
                            let { items } = this.state;
                            items.push({
                              Name: obj.text,
                              Code: obj.value,
                              Qty: 1,
                            });
                            this.setState({ items });
                          },
                        }
                      ]}
                    />
                  ),
                },
                {
                  show:!!items.length,html:<button disabled={!items.length} className='button-2' onClick={()=>this.onSubmit()}>ثبت درخواست</button>,style:{padding:12}
                }
              ],
            }}
          />
        </div>
      );
    }
  }