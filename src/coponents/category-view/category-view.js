import React, { Component } from 'react';
import RVD from 'react-virtual-dom';
import ContentSlider from '../content-slider';
import PopupHeader from '../popup-header/popup-header';
import ProductCard from '../product-card/product-card';
import SearchBox from '../search-box';
import appContext from '../../app-context';
export default class CategoryView extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = { searchValue: '' }
    }
    render() {
        let {categoryZIndex:zIndex,SetState,category} = this.context;
        let { name, type, products, campaign} = category;
        let {searchValue} = this.state;
        return (
            <RVD
                layout={{
                    scroll: "v",className:'fixed bgFFF',style:{zIndex},
                    column: [
                        {html:<PopupHeader title={type === 'campaign'?campaign.name:name} onClose={()=>SetState({categoryZIndex:0,category:false})}/>},
                        {html:<SearchBox value={searchValue} onChange={(searchValue)=>this.setState({searchValue})}/>},
                        { show: type === 'category', size: 36, html: name, align: "vh", className: "color605E5C size14 bold" },
                        {
                            show: type === 'campaign',
                            html: () => <ContentSlider items={[{ title: campaign.name, color: campaign.color, background: campaign.background, icon: <img src={campaign.src} alt='' height='100%' />, }]} />
                        },
                        {
                            size: 36, align: 'v', show: type === 'campaign', html: 'کالاهای جشنواره', className: 'size16 color323130 bold padding-0-12'
                        },
                        {
                            gap: 12,
                            column: products.map((product, i) => {
                                let { searchValue } = this.state;
                                if (searchValue && product.name.indexOf(searchValue) === -1) { return false; }
                                debugger;
                                return <ProductCard parentZIndex={zIndex} product={product} isFirst={i === 0} isLast={i === products.length - 1} type='horizontal' />
                            })
                        },
                    ],
                }}
            />
        )
    }
}