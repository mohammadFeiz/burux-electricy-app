import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import dateCalculator from '../../utils/date-calculator';
import getSvg from '../../utils/getSvg';
import appContext from '../../app-context';
export default class GuaranteePopupSuccess extends Component {
    static contextType = appContext;
    constructor(props){
      super(props);
      this.today = dateCalculator().getToday('jalali','minute')
    }
    render() {
      let today = this.today;
      let {theme,SetState,guaranteePopupSuccessZIndex:zIndex,guaranteePopupSuccessText:text,guaranteePopupSuccessSubtext:subtext} = this.context;
      return (
        <div className={"popup-container padding-24" + (theme?' ' + theme:'')}>
          <RVD
            layout={{
              className: "padding-24 bgFFF theme-1-dark-bg round-24 box-shadow",
              style:{width:'100%',height:'100%',zIndex,boxSizing:'border-box'},
              column: [
                {
                  size: 36,
                  row: [
                    {
                      size: 36,
                      html: getSvg("chevronLeft", { flip: true }),
                      align: "vh",
                      attrs: { onClick: () => SetState({guaranteePopupSuccessZIndex:0}) },
                    },
                    { flex: 1 },
                  ],
                },
                { size: 48 },
                { html: getSvg(41), align: "h" },
                { size: 24 },
                { html: text, className: "color107C10 size20 bold", align: "h" },
                { size: 24 },
                {
                  html: subtext,
                  className: "size14 color605E5C theme-1-colorDDD",
                  align: "h",
                },
                { flex: 1 },
                {
                  size: 60,
                  html: `ثبت درخواست در ${`${today[3]}:${today[4]} ${today[0]}/${today[1]}/${today[2]}`}`,
                  className: "size16 bold color605E5C theme-1-colorDDD",
                  align: "vh",
                },
                {
                  html: (
                    <button onClick={() => SetState({guaranteePopupSuccessZIndex:0})} className="button-2">
                      بازگشت
                    </button>
                  ),
                },
              ],
            }}
          />
        </div>
      );
    }
  }