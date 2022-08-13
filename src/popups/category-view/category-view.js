import React, { Component } from 'react';
import RVD from 'react-virtual-dom';
import Header from './../../components/header/header';
import ProductCard from './../../components/product-card/product-card';
import SearchBox from './../../components/search-box/index';
import appContext from './../../app-context';
export default class CategoryView extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = { searchValue: '' }
    }
    render() {
        let {categoryZIndex:zIndex,SetState,category} = this.context;
        let { name,products,src} = category;
        let {searchValue} = this.state;
        return (
            <RVD
                layout={{
                    className:'fixed main-bg',style:{zIndex,overflow:'hidden'},
                    column: [
                        {html:(<Header zIndex={zIndex} title={name} buttons={{cart:true}} onClose={()=>SetState({categoryZIndex:0,category:false})}/>)},
                        {html:<SearchBox value={searchValue} onChange={(searchValue)=>this.setState({searchValue})}/>},
                        {
                            flex:1,scroll: "v",
                            column:[
                                {show: !!src,style:{marginBottom:12},html: () => <img src={src} alt='' width='100%' />},
                                {
                                    gap: 12,
                                    column: products.map((product, i) => {
                                        let { searchValue } = this.state;
                                        if (searchValue && product.name.indexOf(searchValue) === -1) { return false; }
                                        return {html:<ProductCard zIndex={zIndex} product={product} isFirst={i === 0} isLast={i === products.length - 1} type='horizontal' />}
                                    })
                                }
                            ]
                        }
                    ],
                }}
            />
        )
    }
}