import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import ProductCard from '../product-card/product-card';
import appContext from '../../app-context';
//props
//1 - products [product,product,...]
//2 - title(text) required
//3 - showAll(function) optional
//4 - onClick(function) optional 
export default class CategorySlider extends Component{
    static contextType = appContext;
    render(){
      let {products = [],title,showAll,onClick = ()=>{}} = this.props;
      if(products.length === 0){return null}
      return (
        <RVD
          layout={{
            className: "box gap-no-color",style: { padding: 12 },scroll:'v',
            column: [
              {
                size:36,
                row:[
                  {html:title,className: "size14 color323130 bold",align: "v"},
                  {flex:1},
                  {show:showAll !== undefined,html: "مشاهده همه",className: "size12 color0094D4 bold",align: "v",attrs:{onClick:()=>showAll()}}
                ]
              },
              {
                gap: 16,scroll:'h',
                row: products.map((product,i) =>{
                    return {
                      html:(
                        <ProductCard 
                            type='vertical' product={product} 
                            isFirst={i === 0} isLast={i === products.length - 1} 
                        />
                      )
                    }
                }),
              },
            ],
          }}
        />
      )
    }
  }