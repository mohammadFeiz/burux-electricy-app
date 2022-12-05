import React, { Component } from "react";
import RVD from "./../../../npm/react-virtual-dom/react-virtual-dom";
import getSvg from "./../../../utils/getSvg";
import appContext from "./../../../app-context";
import './index.css';
export default class SabteGarantiJadid extends Component {
    static contextType = appContext;
    async continueWithoutSubmit(){
        let { SetState, guarantiApis } = this.context;
        let res = await guarantiApis({ type: "sabte_kala" });
        if (!res) { alert("error"); return; }
        SetState({
            guaranteePopupSuccessText: "درخواست گارانتی شما با موفقیت اعلام شد",
            guaranteePopupSuccessSubtext: "درخواست گارانتی شما در ویزیت بعدی بررسی خواهد شد",
            guaranteePopupSuccessZIndex: 10,
            guaranteePopupZIndex: 0
        })
    }
    continueWithSubmit(){
        let { SetState } = this.context;
        SetState({ guaranteePopupSubmitZIndex: 10, guaranteePopupZIndex: 0 })
    }
    header_layout(){
        if(this.props.close === false){return false}
        let { SetState } = this.context;
        return {
            size: 36,
            row: [
                { flex: 1 },
                { size: 36, html: getSvg('close'), align: "vh", attrs: { onClick: () => SetState({ guaranteePopupZIndex: 0 }) } }
            ]
        }
    }
    title_layout(){
        return {size: 60, html: "درخواست جمع آوری کالاهای گارانتی", className: "size16 bold color323130", align: "vh"}
    }
    subtitle_layout(){
        return {
            html: "با وارد کردن جزئیات کالاهای گارانتی، درخواست شما در اولین فرصت طی 72 ساعت آینده توسط ویزیتور بررسی میگردد.در غیر این صورت درخواست شما در ویزیت بعدی بررسی میگردد",
            className: "size14 color605E5C",
        }
    }
    continueWithoutSubmit_layout(){
        return {html: (<button onClick={()=>this.continueWithoutSubmit()} className="button-1">ادامه بدون ثبت جزئیات</button>)}
    }
    
    continueWithSubmit_layout(){
        return { html: (<button onClick={() => this.continueWithSubmit()} className="button-2">ثبت جزئیات کالاهای گارانتی</button>) }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: "sabte-garanti-jadid",
                    column: [
                        this.header_layout(),
                        this.title_layout(),
                        this.subtitle_layout(),
                        { size: 24 },
                        this.continueWithoutSubmit_layout(),
                        { size: 12 },
                        this.continueWithSubmit_layout()
                    ]
                }}
            />
        );
    }
}