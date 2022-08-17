import React,{Component} from 'react';
import appContext from './../../app-context';
import Header from './../../components/header/header';
import SearchBox from './../../components/search-box/index';
import LampSrc from './../../images/lamp.png';
import ProductCard from './../../components/product-card/product-card';
import RVD from 'react-virtual-dom';
export default class Search extends Component {
    static contextType = appContext;
    constructor(props) {
      super(props);
      this.state = {
        searchValue: "",
        searchFamilies: [{ name: "جنرال" },{ name: "جاینت" },{ name: "پنلی" },{ name: "سیم و کابل" }],
        result: [
          
        ],
      };
    }
    async search(){
      let {services} = this.context;
      let {searchValue} = this.state;
      this.setState({loading:true})
      let res = await services({type:"getTaxonProducts", parameter:{Name:searchValue},loading:false});
      this.setState({loading:false})
      console.log(res)
      this.setState({ result: res });
    }
    async changeSearch(searchValue) {
      clearTimeout(this.timeout);
      this.setState({ searchValue });
      this.timeout = setTimeout(async () => {
        this.search()
      }, 2000);
    }
    result_layout(){
      let { result,loading,searchValue } = this.state;
      if(loading){
        return {html:'در حال جستجو...',flex:1,align:'vh'}
      }
      if(!result){return null}
      if(!result.length){
        if(searchValue){return {html:'موردی یافت نشد',flex:1,align:'vh'}}
        return false
      }
      return {
        flex: 1,
        column: result.map((o, i) => {
          return {html:<ProductCard isFirst={i === 0} isLast={i === result.length - 1} product={o} type='horizontal'/>}
        }),
      }
    }
    render() {
      let { SetState,searchZIndex } = this.context;
      let { searchFamilies, result } = this.state;
      return (
        <div className="popup-container">
          <RVD
            layout={{
              className: "popup main-bg",
              column: [
                {html:<Header zIndex={searchZIndex} title='جستجو در محصولات' onClose={()=>SetState({searchZIndex:0})} buttons={{cart:true}}/>},
                {html:<SearchBox onChange={async (searchValue)=>await this.changeSearch(searchValue)}/>},
                {size: 200,align: "vh",className: "size20 color323130 bold",show: false,html: "در میان ان کالا جستجو"},
                {size: 48,align: "v",className: "size14 color323130 bold",html: "جستجو در خانواده ها",style: { padding: "0 24px" }},
                {
                  gap: 12,
                  row: searchFamilies.map((o) => {
                    return {size: 90,html: o.name,className: "color605E5C size14",align: "vh",style: {border: "1px solid #999",borderRadius: 24}};
                  }),
                },
                {size: 48,align: "v",className: "size14 color323130 bold padding-0-24",html: "محصولات"},
                { size: 24 },
                this.result_layout()
              ],
            }}
          />
        </div>
      );
    }
  }
  