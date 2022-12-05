import React, { Component } from 'react';
import RVD from './../../../npm/react-virtual-dom/react-virtual-dom';
import dateCalculator from './../../../utils/date-calculator';
import getSvg from './../../../utils/getSvg';
import appContext from './../../../app-context';
export default class PayameSabteGaranti extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.today = dateCalculator().getToday('jalali', 'minute')
    }
    header_layout(){
        let {SetState} = this.context;
        return {
            size: 36,
            row: [
                { flex: 1 },
                {
                    size: 36,align: "vh",html: getSvg("close"),
                    attrs: { onClick: () => SetState({ guaranteePopupSuccessZIndex: 0 }) },
                },
                
            ],
        }
    }
    icon_layout(){
        return { html: getSvg(41), align: "h" }
    }
    text_layout(){
        let { guaranteePopupSuccessText: text } = this.context;
        return { html: text, className: "color107C10 size20 bold", align: "h",style:{textAlign:'center'} }
    }
    subtext_layout(){
        let { guaranteePopupSuccessSubtext: subtext } = this.context;
        return {html: subtext,className: "size14 color605E5C",align: "h"}
    }
    time_layout(){
        let today = this.today;
        return {
            size: 60,className: "size16 bold color605E5C",align: "vh",
            html: `ثبت درخواست در ${`${today[3]}:${today[4]} ${today[0]}/${today[1]}/${today[2]}`}`
        }
    }
    backButton_layout(){
        let {SetState} = this.context;
        return {html: (<button onClick={() => SetState({ guaranteePopupSuccessZIndex: 0,guaranteePopupZIndex:0 })} className="button-2">بازگشت</button>)}
    }
    render() {
        let { guaranteePopupSuccessZIndex: zIndex } = this.context;
        return (
            <RVD
                layout={{
                    className: "padding-24 bgFFF round-24 box-shadow",
                    style: { width: '100%', height: '100%', zIndex, boxSizing: 'border-box' },
                    column: [
                        this.header_layout(),
                        { size: 48 },
                        this.icon_layout(),
                        { size: 24 },
                        this.text_layout(),
                        { size: 24 },
                        this.subtext_layout(),
                        { flex: 1 },
                        this.time_layout(),
                        this.backButton_layout(),
                    ],
                }}
            />

        );
    }
}