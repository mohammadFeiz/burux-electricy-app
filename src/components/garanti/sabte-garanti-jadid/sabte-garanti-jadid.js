import React, { Component } from "react";
import RVD from "./../../../interfaces/react-virtual-dom/react-virtual-dom";
import getSvg from "./../../../utils/getSvg";
import appContext from "./../../../app-context";
import './index.css';
export default class SabteGarantiJadid extends Component {
    static contextType = appContext;
    async continueWithoutSubmit(){
        let { openPopup, guarantiApis } = this.context;
        let {closeParent} = this.props;
        closeParent();
        let res = await guarantiApis({ type: "sabte_kala" });
        if (!res) { alert("error"); return; }
        openPopup('payame-sabte-garanti',{
            text: "درخواست گارانتی شما با موفقیت اعلام شد",
            subtext: "درخواست گارانتی شما در ویزیت بعدی بررسی خواهد شد",
        })
    }
    continueWithSubmit(){
        let { openPopup } = this.context;
        let {closeParent} = this.props;
        closeParent();
        openPopup('sabte-garanti-jadid-ba-joziat')
    }
    header_layout(){
        let { onClose } = this.props;
        if(!onClose){return false}
        return {
            size: 36,
            row: [
                { flex: 1 },
                { size: 36, html: getSvg('close'), align: "vh", attrs: { onClick: () => onClose() } }
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