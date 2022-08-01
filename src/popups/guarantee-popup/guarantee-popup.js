import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "../../utils/getSvg";
import appContext from "../../app-context";
export default class GuaranteePopup extends Component {
    static contextType = appContext;
    render() {
      let { onClick } = this.props;
      let {theme,SetState,services} = this.context;
      return (
        <div className={"popup-container" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "guarantee-popup theme-1-dark-bg",
              column: [
                {
                  size: 36,
                  row: [
                    { flex: 1 },
                    {size: 36,html: getSvg(40),align: "vh",attrs: { onClick: () => SetState({guaranteePopupZIndex:0}) }}
                  ]
                },
                {
                  size: 60,
                  html: "درخواست جمع آوری کالاهای گارانتی",
                  className: "size16 bold color323130 theme-1-colorFFF",
                  align: "vh",
                },
                {
                  html: "با وارد کردن جزئیات کالاهای گارانتی، درخواست شما در اولین فرصت طی 72 ساعت آینده توسط ویزیتور بررسی میگردد.در غیر این صورت درخواست شما در ویزیت بعدی بررسی میگردد",
                  className: "size14 color605E5C theme-1-colorDDD",
                },
                { size: 24 },
                {
                  html: (
                    <button
                      onClick={async () =>{
                        let res = await services({type:"sabte_kalahaye_garanti"});
                        if(!res){alert("error"); return;}
                        SetState({
                          guaranteePopupSuccessText:"درخواست گارانتی شما با موفقیت اعلام شد",
                          guaranteePopupSuccessSubtext:"درخواست گارانتی شما در ویزیت بعدی بررسی خواهد شد",
                          guaranteePopupSuccessZIndex:10,
                          guaranteePopupZIndex:0   
                        })
                      }}
                      className="button-1"
                    >ادامه بدون ثبت جزئیات</button>
                  ),
                },
                { size: 12 },
                {html: (<button onClick={() => SetState({guaranteePopupSubmitZIndex:10,guaranteePopupZIndex:0})} className="button-2">ثبت جزئیات کالاهای گارانتی</button>)}
              ]
            }}
          />
        </div>
      );
    }
  }