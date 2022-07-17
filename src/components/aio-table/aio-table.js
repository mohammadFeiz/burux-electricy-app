import React,{Component} from "react";
import Table from './index';
export default class AIOTable extends Component{
    translate(text){
      let dict = {
        'Add':'افزودن','Contain':'شامل','Not Contain':'غیر شامل','Equal':'مساوی','Not Equal':'نا مساوی','Group By':'گروه بندی','Show Columns':'نمایش ستونها',
        'No Data':'رکوردی برای نمایش موجود نیست','Next Page':'صفحه بعدی','Previous Page':'صفحه قبلی','First Page':'صفحه اول','Last Page':'صفحه آخر','Sort':'مرتب سازی',
        'Export To Excel':'دانلود فایل اکسل','Greater':'بزرگتر از','Less':'کوچک تر از','and':'و','or':'یا','Search':'جستجو'
      }
      return dict[text]?dict[text]:text
    }
    render(){
      return (
        <Table
          toolbarStyle={{height:48}}
          rowGap={1} striped={'#FAF9F8'} style={{width:'100%',height:'100%',fontSize:12}} rtl={true}
          rowHeight={36} translate={this.translate.bind(this)}
          paging={{sizes:[10,20,50,100,500],size:50,number:1}} padding={12}
          {...this.props}
        />
      )
    }
  }